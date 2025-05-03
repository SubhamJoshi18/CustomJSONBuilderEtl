import { ConsumeMessage } from "amqplib";
import { customJsonBuilderEtlLogger } from "../../libs/logger";
import { QUEUE_NAMES } from "../../constants/queue.name.constant";
import startJSONExtraction from "../../etl/json.extraction";

async function extractJSONHandler(msg: ConsumeMessage | null) {
  try {
    customJsonBuilderEtlLogger.info(
      `Message Received in the ${QUEUE_NAMES.json_extractor_queue_name}`
    );

    if (msg?.content) {
      const parseContent = JSON.parse(msg.content.toString());
      customJsonBuilderEtlLogger.info(
        `Payload : ${JSON.stringify(parseContent)}`
      );

      const { s3Path, jsonQuery } = parseContent;
      const { jsonStructure } = jsonQuery;
      await startJSONExtraction(s3Path, jsonStructure);
    }
  } catch (err) {
    throw err;
  }
}

export default extractJSONHandler;
