export type GetUploadUrlDto = {
  extension: string;
  path?: string;
};

export type GetMultiUploadUrlsDto = {
  extensions: string[];
  path: string;
};

export type DeleteFileDto = {
  key: string;
};
