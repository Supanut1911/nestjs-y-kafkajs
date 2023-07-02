import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class AppService {
  kafka = new Kafka({
    clientId: 'nestjs-app2',
    brokers: [
      process.env.KAFKA_BROKER_1,
      process.env.KAFKA_BROKER_2,
      process.env.KAFKA_BROKER_3,
    ],
  });

  producer = this.kafka.producer();

  async getHello(): Promise<string> {
    return 'hi am from app-y';
  }
}
