import ImageKit from '@imagekit/nodejs';
import { Transformation } from '@imagekit/nodejs/resources/shared';

import path from "node:path";
import { pipeline } from "node:stream/promises";
import fs from "node:fs";
import { randomUUID } from "node:crypto";

import { UploadFile } from "../media.service";

const IMAGEKIT_PRIVATE_KEY = process.env['IMAGEKIT_PRIVATE_KEY'];
const IMAGE_KIT_BASE_URL = process.env['IMAGE_KIT_BASE_URL'] || '';

export const imageKit = new ImageKit({
  privateKey: IMAGEKIT_PRIVATE_KEY,
});

export const uploadToImageKit: UploadFile = async ({
  filename,
  stream,
  fieldname
}) => {
  await imageKit.folders.create({
    folderName: fieldname,
    parentFolderPath: '/'
  });

  const safeFileName = randomUUID() + filename;

  // Create temp file
  const uploadDir = path.resolve('temp');
  await fs.promises.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, safeFileName);

  await pipeline(
    stream,
    fs.createWriteStream(filePath)
  );

  try {
    const response = await imageKit.files.upload({
      file: fs.createReadStream(filePath),
      fileName: safeFileName,
      folder: fieldname
    });

    return response;
  } catch (error) {
    return console.log(error);
  } finally {
    //delete the temp file
    fs.unlink(filePath, () => { });
  }
}

export const buildURL = (src: string, transformation: { transformation: Transformation[]}) => {
  const transformatedUrl = imageKit.helper.buildSrc({
    src: src,
    urlEndpoint: IMAGE_KIT_BASE_URL,
    ...transformation
  });

  return transformatedUrl;
}