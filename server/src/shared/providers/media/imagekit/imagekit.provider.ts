import fs from "node:fs";

import ImageKit from '@imagekit/nodejs';
import { Transformation } from '@imagekit/nodejs/resources/shared';

import { UploadFile } from "@/shared/providers/media/media.provider";
import { ImageUploadError } from "@/shared/errors/uploads/image-upload.error";

const IMAGEKIT_PRIVATE_KEY = process.env['IMAGEKIT_PRIVATE_KEY'];
const IMAGE_KIT_BASE_URL = process.env['IMAGE_KIT_BASE_URL'] || '';

const imageKit = new ImageKit({
  privateKey: IMAGEKIT_PRIVATE_KEY,
});

export const uploadToImageKit: UploadFile = async ({
  fieldname,
  filename,
  tempPath,
  mimetype
}) => {
  // Upload the file to Imagekit
  await imageKit.folders.create({
    folderName: fieldname,
    parentFolderPath: '/'
  });

  const response = await imageKit.files.upload({
    file: fs.createReadStream(tempPath),
    fileName: filename,
    folder: fieldname
  });

  if (!response.name || !response.fileType || !response.url) {
    throw new ImageUploadError(fieldname);
  }

  const uploadedFile = {
    fieldname,
    filename: response.name,
    mimetype: response.fileType,
    url: response.url
  }

  return uploadedFile;
}

export const buildURL = (src: string, transformation: { transformation: Transformation[] }) => {
  const transformatedUrl = imageKit.helper.buildSrc({
    src: src,
    urlEndpoint: IMAGE_KIT_BASE_URL,
    ...transformation
  });

  return transformatedUrl;
}