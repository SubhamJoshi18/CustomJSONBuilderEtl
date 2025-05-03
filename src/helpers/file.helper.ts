import path from "path";
import fs from "fs";
import { customJsonBuilderEtlLogger } from "../libs/logger";

class FileHelper {
  public bucketJsonContent: Array<string> = [];

  public async getS3BucketFilePath() {
    return path.join(process.cwd(), "S3Bucket");
  }

  public async getContentFromS3() {
    if (
      Array.isArray(this.bucketJsonContent) &&
      this.bucketJsonContent.length > 0
    ) {
      return this.bucketJsonContent.pop();
    } else {
      customJsonBuilderEtlLogger.info(`There are no Object on the S3Bucket`);
    }
  }

  public async getJsonObjectFromS3() {
    const bucketPath = await this.getS3BucketFilePath();
    const bucketContent = fs.readdirSync(bucketPath);
    if (Array.isArray(bucketContent)) {
      for (const object of bucketContent) {
        if (typeof object === "string" && object.endsWith(".json")) {
          const localiFilePath = path.join(bucketPath, object);
          this.bucketJsonContent.push(localiFilePath);
          break;
        }
      }
    }
  }

  public extractS3Object() {
    return this.getJsonObjectFromS3().then(() => {
      return this.getContentFromS3();
    });
  }
}

export default FileHelper;
