import { ConsumeMessage } from "amqplib";
import { customJsonBuilderEtlLogger } from "../../libs/logger";
import { QUEUE_NAMES } from "../../constants/queue.name.constant";

async function extractJSONHandler(msg: ConsumeMessage | null) {
  try {
    customJsonBuilderEtlLogger.info(
      `Message Received in the ${QUEUE_NAMES.json_extractor_queue_name}`
    );

    if (msg?.content) {
      const parseContent = msg.content.toString();
      customJsonBuilderEtlLogger.info(
        `Payload : ${JSON.stringify(parseContent)}`
      );
    }
  } catch (err) {
    throw err;
  }
}

export default extractJSONHandler;
