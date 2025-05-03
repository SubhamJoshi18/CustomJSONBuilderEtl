import amqp from "amqplib";
import { getEnvValue } from "../utils/env.utils";
import { customJsonBuilderEtlLogger } from "../libs/logger";

class BaseQueueManager {
  private connection: amqp.ChannelModel | undefined;
  private channel: amqp.Channel | undefined;
  private rabbitMQUrl: string;

  constructor() {
    this.rabbitMQUrl = getEnvValue("RABBITMQ_URL") as string;
  }

  public async getConnection(): Promise<any> {
    try {
      this.connection = await amqp.connect(this.rabbitMQUrl);
      return this.connection;
    } catch (err) {
      customJsonBuilderEtlLogger.info(
        `AMQPError: Error connecting to the RabbitMQ Server`
      );
      process.exit(1);
    }
  }

  public async getChannel(): Promise<any> {
    try {
      const getConnection = await this.getConnection();
      this.channel = await getConnection.createChannel();
      return this.channel;
    } catch (err) {
      customJsonBuilderEtlLogger.info(
        `AMQPError: Error Connecting  to the Channel RabbitMQ Server`
      );
      process.exit(1);
    }
  }

  public async initalizeConnection() {
    const [connection, channel] = await Promise.all([
      this.getConnection(),
      this.getChannel(),
    ]);
    return {
      connection,
      channel,
    };
  }

  public async getterConnectionAndChannel() {
    const connectionConfig = await this.initalizeConnection();
    const { connection, channel } = connectionConfig;
    return {
      connection: connection,
      channel: channel,
    };
  }
}

const getBaseQueueManagerInstance = () => {
  return new BaseQueueManager();
};

export default getBaseQueueManagerInstance;
