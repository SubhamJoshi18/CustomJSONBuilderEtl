import { Channel } from "amqplib";
import { customJsonBuilderEtlLogger } from "../../libs/logger";
import { queueConsumerConfig } from "../../config/consumer.config";

export async function initAllConsumers(channel: Channel) {
  try {
    for (const [key, value] of Object.entries(queueConsumerConfig)) {
      if (typeof key === "string" && key.includes("consumer")) {
        if (typeof value === "function") {
          customJsonBuilderEtlLogger.info(
            `Consumer Has been Started For : ${key}`
          );
          await value(channel);
        }
      }
    }
  } catch (err) {
    customJsonBuilderEtlLogger.error(
      `
            Error Starting the Consumers, Due to : ${JSON.stringify(err)}     `
    );
  }
}
