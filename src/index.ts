import { jsonConfig } from "./config/json.config";
import getQueueManagerInstance from "./queues/QueueManager";

async function startJsonBuilder() {
  const queueManager = getQueueManagerInstance();
  await queueManager.startAllConsumers();
}

(async () => {
  await startJsonBuilder();
})();
