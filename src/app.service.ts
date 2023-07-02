import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class AppService {
  kafka = new Kafka({
    clientId: 'nestjs-appYYYYYYYYYY',
    brokers: [
      process.env.KAFKA_BROKER_1,
      process.env.KAFKA_BROKER_2,
      process.env.KAFKA_BROKER_3,
    ],
  });

  producer = this.kafka.producer();
  consumer = this.kafka.consumer({ groupId: 'app-Y-group' });

  async getHello(): Promise<string> {
    return 'hi am from app-y';
  }

  async handleSubscribe() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'test-from-appX',
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          partition,
          value: message.value.toString(),
        });
      },
    });

    return 'recieve message success';
  }
}
