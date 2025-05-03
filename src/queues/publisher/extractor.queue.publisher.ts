import { Channel } from "amqplib";
import {
  EXCHANGE_NAMES,
  EXCHANGE_TYPES,
  QUEUE_NAMES,
  ROUTING_KEYS,
} from "../../constants/queue.name.constant";
import { customJsonBuilderEtlLogger } from "../../libs/logger";

async function extractQueuePublisher(
  msg: Buffer<ArrayBuffer>,
  channel: Channel
) {
  return new Promise(async (resolve, reject) => {
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

      await channel.prefetch(1);

      channel.publish(
        EXCHANGE_NAMES.extractor_exchange,
        ROUTING_KEYS.extractor_routing_key,
        msg
      );

      customJsonBuilderEtlLogger.info(`
        Message : ${JSON.stringify(msg.toString())} Published to the ${
        QUEUE_NAMES.json_extractor_queue_name
      }`);
      resolve(true);
    } catch (err) {
      customJsonBuilderEtlLogger.error(
        `Error Publishing to the Queue Consumer : ${QUEUE_NAMES.json_extractor_queue_name}`
      );
    } finally {
      resolve(true);
    }
  });
}

export default extractQueuePublisher;
