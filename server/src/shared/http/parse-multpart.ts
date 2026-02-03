import { FastifyRequest } from "fastify";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream/promises";

interface UploadedFile {
  fieldname: string;
  filename: string;
  mimetype: string;
  tempPath: string;
}

type MultipartFiles = Record<string, UploadedFile[]>
type MultipartFields = Record<string, string>

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
): Promise<MultipartDataResult> {
  const files: MultipartFiles = {};
  const fields: MultipartFields = {};

  const uploadDir = path.resolve('temp');
  await fs.promises.mkdir(uploadDir, { recursive: true });

  for await (const part of request.parts()) {
    if (part.type === "file") {
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
        console.log(error);
      }

      const file: UploadedFile = {
        fieldname: part.fieldname,
        filename: part.filename,
        mimetype: part.mimetype,
        tempPath: filePath,
      }

      files[part.fieldname].push(file);
    } else {
      fields[part.fieldname] = String(part.value);
    }
  }

  return {
    files,
    fields
  }
}