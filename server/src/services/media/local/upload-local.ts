import path from "node:path";
import { pipeline } from "node:stream/promises";
import fs from "node:fs";
import { randomUUID } from "node:crypto";

import { UploadFile } from "../media.service";

export const uploadToLocal: UploadFile = async ({
  filename,
  stream,
  fieldname
}) => {
  const uploadDir = path.resolve('uploads', fieldname);
  await fs.promises.mkdir(uploadDir, { recursive: true });

  const safeFileName = randomUUID() + filename;

  const filePath = path.join(uploadDir, safeFileName);

  await pipeline(
    stream,
    fs.createWriteStream(filePath)
  );

  return {
    name: filename,
    filePath,
    url: filePath
  }
}
