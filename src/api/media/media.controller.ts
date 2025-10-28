import { Body, Controller, Post } from "@nestjs/common";

import { MediaService } from "../media/media.service";
import {
  DeleteFileDto,
  GetMultiUploadUrlsDto,
  GetUploadUrlDto
} from "./dto/media.dto";
import { Public } from "../auth/decorators";

@Public()
@Controller("media")
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post("get-upload-url")
  getUploadUrl(@Body() data: GetUploadUrlDto) {
    const { extension, path } = data;
    return this.mediaService.getUploadUrl(extension, path);
  }

  @Post("get-multi-upload-urls")
  async getMultiUploadUrls(
    @Body() { extensions, path }: GetMultiUploadUrlsDto
  ) {
    return this.mediaService.getMultiUploadUrls(extensions, path);
  }

  @Post("delete-file")
  async deleteFile(@Body() { key }: DeleteFileDto) {
    return this.mediaService.deleteFile(key);
  }
}
