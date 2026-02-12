export type FileData = {
  fieldname: string;
  filename: string;
  tempPath: string;
  mimetype: string;
};

export type UploadedFile = {
  fieldname: string;
  filename: string;
  mimetype: string;
  url: string;
}

export type UploadFile  = (file: FileData) => Promise<UploadedFile>;
