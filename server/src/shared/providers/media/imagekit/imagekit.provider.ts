import fs from "node:fs";

import ImageKit from '@imagekit/nodejs';
import { Transformation } from '@imagekit/nodejs/resources/shared';

import { UploadFile } from "@/shared/providers/media/media.provider";

const IMAGEKIT_PRIVATE_KEY = process.env['IMAGEKIT_PRIVATE_KEY'];
const IMAGE_KIT_BASE_URL = process.env['IMAGE_KIT_BASE_URL'] || '';

const imageKit = new ImageKit({
  privateKey: IMAGEKIT_PRIVATE_KEY,
});

export const uploadToImageKit: UploadFile<ImageKit.Files.FileUploadResponse | void> = async ({
  fieldname,
  filename,
  filePath
}) => {
  // Upload the file to Imagekit
  try {
    await imageKit.folders.create({
      folderName: fieldname,
      parentFolderPath: '/'
    });

    const response = await imageKit.files.upload({
      file: fs.createReadStream(filePath),
      fileName: filename,
      folder: fieldname
    });

    return response;
  } catch (error) {
    console.log(error);
  }
}

export const buildURL = (src: string, transformation: { transformation: Transformation[] }) => {
  const transformatedUrl = imageKit.helper.buildSrc({
    src: src,
    urlEndpoint: IMAGE_KIT_BASE_URL,
    ...transformation
  });

  return transformatedUrl;
}