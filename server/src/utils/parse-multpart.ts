import { FastifyRequest } from "fastify";
import { Readable } from "node:stream";

import { uploadToLocal } from "../services/media/local/upload-local";

type MultipartData = {
  files: Record<string, unknown[]>;
  fields: Record<string, string>
}

type FileConsumer = (args: {
  stream: Readable
  filename: string
  mimetype: string
  fieldname: string
}) => Promise<unknown>

/**
 * Parses a multipart/form-data request and returns the fields of request.
 *
 * @param request - Fastify request containing multipart data
 * @param consumeFile - Function responsible for consuming the file stream (ex: Imagekit, Amazon S3).
 * If not provided, files will be saved to disk using the default strategy.
 * 
 *
 * @returns An object containing parsed form fields and processed files
 */
export async function parseMultipart(
  request: FastifyRequest,
  consumeFile: FileConsumer = uploadToLocal
): Promise<MultipartData> {
  const files: Record<string, unknown[]> = {};
  const fields: Record<string, string> = {};

  for await (const part of request.parts()) {
    if (part.type === 'file') {
      if (!files[part.fieldname]) {
        files[part.fieldname] = [];
      }

      const result = await consumeFile({
        fieldname: part.fieldname,
        filename: part.filename,
        mimetype: part.mimetype,
        stream: part.file
      });

      files[part.fieldname].push(result);
    } else {
      fields[part.fieldname] = String(part.value);
    }
  }

  return {
    files,
    fields
  }
}