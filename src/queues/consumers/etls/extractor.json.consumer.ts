import { Channel, ConsumeMessage } from "amqplib";
import { customJsonBuilderEtlLogger } from "../../../libs/logger";
import {
  EXCHANGE_NAMES,
  EXCHANGE_TYPES,
  QUEUE_NAMES,
} from "../../../constants/queue.name.constant";
import { ROUTING_KEYS } from "../../../constants/queue.name.constant";
import extractJSONHandler from "../../handlers/extractJSON.handler";

async function jsonExtractorConsumer(channel: Channel) {
  try {
    await channel.assertExchange(
      EXCHANGE_NAMES.extractor_exchange,
      EXCHANGE_TYPES.direct_exchange,
      { durable: true }
    );

    await channel.assertQueue(QUEUE_NAMES.json_extractor_queue_name, {
      durable: true,
    });

    await channel.bindQueue(
      QUEUE_NAMES.json_extractor_queue_name,
      EXCHANGE_NAMES.extractor_exchange,
      ROUTING_KEYS.extractor_routing_key
    );

    customJsonBuilderEtlLogger.info(
      `Waiting For the Message on the ${QUEUE_NAMES.json_extractor_queue_name}`
    );

    await channel.consume(
      QUEUE_NAMES.json_extractor_queue_name,
      async (msg: ConsumeMessage | null) => {
        try {
          await extractJSONHandler(msg);
        } catch (err) {
          customJsonBuilderEtlLogger.error(
            `Error Consuming the Message For Queue : ${JSON.stringify(
              QUEUE_NAMES.json_extractor_queue_name
            )}`
          );
        } finally {
          if (msg) {
            channel.ack(msg);
          }
        }
      }
    );
  } catch (err) {
    customJsonBuilderEtlLogger.error(
      `Error Starting the JSON Extractor Consumer, Error Reason : ${JSON.stringify(
        err
      )}`
    );
  }
}

export default jsonExtractorConsumer;
