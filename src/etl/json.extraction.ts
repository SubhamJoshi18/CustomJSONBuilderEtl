import JSONStream from "jsonstream";
import es from "event-stream";
import fs from "fs";
import { customJsonBuilderEtlLogger } from "../libs/logger";
import { ParseKeyConstant } from "../constants/parseJson.constant";
import startSKUExtraction from "./extraction/sku.extraction";
import FileHelper from "../helpers/file.helper";

async function startJSONExtraction(
  localFilePath: string,
  jsonStructure: object
) {
  const fileHelperInstance = new FileHelper();
  return new Promise((resolve, reject) => {
    try {
      const jsonStream = fs.createReadStream(localFilePath, {
        encoding: "utf-8",
      });
      const outputStream = fs.createWriteStream("");
      const stringifyStream = JSONStream.stringify();
      stringifyStream.pipe(outputStream);
      const parseStream = JSONStream.parse(ParseKeyConstant.sku);

      jsonStream
        .pipe(parseStream)
        .on("data", async (chunk: any) => {
          await startSKUExtraction(chunk, stringifyStream);
        })
        .on("end", () => {
          customJsonBuilderEtlLogger.info(`JSON Extraction Has Been Completed`);
          //Publish to the Queue
        });
    } catch (err) {
      customJsonBuilderEtlLogger.error(
        `Error Extracting the JSON, Error: ${JSON.stringify(err)}`
      );
    } finally {
      resolve(true);
    }
  });
}

export default startJSONExtraction;
