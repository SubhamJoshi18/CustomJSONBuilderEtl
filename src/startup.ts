import { IJsonStructure } from "./interface/json.interface";
import { customJsonBuilderEtlLogger } from "./libs/logger";
import { jsonConfig } from "./config/json.config";
import FileHelper from "./helpers/file.helper";
import { QUEUE_NAMES } from "./constants/queue.name.constant";
import getQueueManagerInstance from "./queues/QueueManager";
import extractQueuePublisher from "./queues/publisher/extractor.queue.publisher";

class AWSLambda {
  private fileHelper: FileHelper;
  private queueManager: any;

  constructor() {
    this.fileHelper = new FileHelper();
    this.queueManager = getQueueManagerInstance();
  }

  public async InvokeJsonBuilder(jsonStructure: Partial<IJsonStructure>) {
    return new Promise(async (resolve, reject) => {
      try {
        const s3BucketEventPath = await this.fileHelper.extractS3Object();
        const queuePayload = {
          queue: QUEUE_NAMES.json_extractor_queue_name,
          s3Path: s3BucketEventPath,
          jsonQuery: jsonConfig,
        };
        const stringifyPayload = Buffer.from(JSON.stringify(queuePayload));
        const channel = await this.queueManager.getterChannel();
        await extractQueuePublisher(stringifyPayload, channel);
      } catch (err) {
        reject(err);
      }
    });
  }
}

const getLambdaFactory = (): AWSLambda => {
  return new AWSLambda();
};

async function startLambda() {
  try {
    const lambdaFunc = getLambdaFactory();
    await lambdaFunc.InvokeJsonBuilder(jsonConfig as Partial<IJsonStructure>);
  } catch (err) {
    customJsonBuilderEtlLogger.error(
      `Error Starting or Invoking the AWS Lambda Function`
    );
  } finally {
    customJsonBuilderEtlLogger.info(
      `Etl-Process For Custom JSON Builder Has been Started`
    );
  }
}

(async () => {
  await startLambda();
})();
