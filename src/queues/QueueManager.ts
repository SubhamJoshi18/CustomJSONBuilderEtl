import getBaseQueueManagerInstance from "./BaseQueueManager";
import { initAllConsumers } from "./consumers/initQueueConsumer";

class QueueManager {
  public baseManager: any;

  constructor() {
    this.baseManager = getBaseQueueManagerInstance();
  }

  public async getConnectionAndChannel() {
    const rabbitmqConfig = await this.baseManager.getterConnectionAndChannel();
    return rabbitmqConfig;
  }

  public async getterChannel() {
    return this.baseManager.getChannel();
  }

  public async startAllConsumers() {
    const { connection, channel } =
      await this.baseManager.getterConnectionAndChannel();
    await initAllConsumers(channel);
  }
}

const getQueueManagerInstance = () => {
  return new QueueManager();
};

export default getQueueManagerInstance;
