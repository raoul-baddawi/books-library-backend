import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MediaService {
  client: S3Client;
  bucket: string;

  constructor() {
    this.client = new S3Client({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.S3_ACCESS_KEY_SECRET || ""
      },
      region: process.env.S3_REGION
    });
    this.bucket = process.env.S3_BUCKET || "";
  }

  _createMediaPath(extension: string, path = "") {
    const formattedPath = path ? `${path}/` : "";
    return `${formattedPath}${extension}`;
  }

  async getUploadUrl(extension: string, path?: string) {
    const newPath = this._createMediaPath(extension, path);

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: newPath
    });

    const url = await getSignedUrl(this.client, command);

    return { url, path: newPath };
  }

  async getMultiUploadUrls(extensions: string[], path?: string) {
    const urls = await Promise.allSettled(
      extensions.map((extension) => this.getUploadUrl(extension, path))
    );

    const successfulUrls = [];

    for (const url of urls) {
      if (url.status === "fulfilled") {
        successfulUrls.push(url.value);
        continue;
      }
    }
    return { data: successfulUrls };
  }

  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key
    });

    try {
      const data = await this.client.send(command);
      return data; // For unit tests.
    } catch (err) {
      console.error("Error", err);
    }
  }
}
