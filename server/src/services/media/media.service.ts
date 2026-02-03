export type FileData = {
  fieldname: string;
  filename: string;
  filePath: string
};

export type UploadFile<T = unknown>  = (file: FileData) => Promise<T>;
