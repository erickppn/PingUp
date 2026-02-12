import { FastifyRequest } from "fastify";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream/promises";

import { AppError } from "@/shared/errors/app-error";
import { cleanupTempPaths } from "@/shared/utils/cleanup-tem-paths";

type UploadedFile = {
  fieldname: string;
  filename: string;
  mimetype: string;
  tempPath: string;
}

type MultipartFiles = Record<string, UploadedFile[]>
type MultipartFields = Record<string, string>

type ParseMultipartOptions = {
  maxFiles?: Record<string, number>
  maxTotalFiles?: number
}

type MultipartDataResult = {
  files: MultipartFiles;
  fields: MultipartFields
}

/**
 * Parses a multipart/form-data request and returns the fields of request.
 *
 * @param request - Fastify request containing multipart data
 *
 */
export async function parseMultipart(
  request: FastifyRequest,
  options?: ParseMultipartOptions
): Promise<MultipartDataResult> {
  const files: MultipartFiles = {};
  const fields: MultipartFields = {};

  const tempPaths: string[] = []

  let totalFilesProcessed = 0;
  const maxTotalFiles = resolveMaxFiles(options);
  let errorToThrow: Error | null = null;

  const uploadDir = path.resolve('temp');
  await fs.promises.mkdir(uploadDir, { recursive: true });

  for await (const part of request.parts()) {
    if (part.type === "file") {
      try {
        totalFilesProcessed++;

        if (maxTotalFiles && totalFilesProcessed > maxTotalFiles) {
          part.file.resume();
          errorToThrow ??= new AppError("Too many files uploaded", 400, "TOO_MANY_FILES");
          continue;
        }

        const fieldLimit = options?.maxFiles?.[part.fieldname];
        const currentCount = files[part.fieldname]?.length ?? 0;

        if (fieldLimit && currentCount >= fieldLimit) {
          part.file.resume();
          errorToThrow ??= new AppError(`Too many files for field ${part.fieldname}. This field only aceppts ${fieldLimit} file`, 400, "TOO_MANY_FILES");
          continue;
        }

        if (!files[part.fieldname]) {
          files[part.fieldname] = [];
        }

        const safeFileName = randomUUID() + part.filename;
        const filePath = path.join(uploadDir, safeFileName);

        // Create temp file
        try {
          await pipeline(
            part.file,
            fs.createWriteStream(filePath)
          );
        } catch (error) {
          errorToThrow = new AppError("Failed to process uploaded file", 500, "FILE_PROCESSING_ERRO");
        }

        const file: UploadedFile = {
          fieldname: part.fieldname,
          filename: part.filename,
          mimetype: part.mimetype,
          tempPath: filePath,
        }

        files[part.fieldname].push(file);
        tempPaths.push(file.tempPath);
      } catch (error) {
        // drain remaining multipart streams to avoid hanging requests
        part.file.resume();
        errorToThrow ??= error as Error;
      }
    } else {
      fields[part.fieldname] = String(part.value);
    }
  }

  if (errorToThrow) {
    await cleanupTempPaths(tempPaths);
    throw errorToThrow;
  }

  return {
    files,
    fields
  }
}

function resolveMaxFiles(options?: ParseMultipartOptions): number | undefined {
  if (options?.maxTotalFiles !== undefined) {
    return options.maxTotalFiles;
  }

  if (options?.maxFiles) {
    return Object.values(options.maxFiles).reduce((sum, limit) => sum + limit, 0);
  }

  return undefined;
}