import { Readable } from "stream"

export type FileData = {
  stream: Readable,
  filename: string,
  fieldname: string
};

export type UploadFile = (args: FileData) => Promise<unknown>;
