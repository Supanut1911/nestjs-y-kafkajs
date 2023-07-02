import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';

interface SubPayload {
  x: number;
  y: number;
}

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
  consumer = this.kafka.consumer({ groupId: 'app-Y-consumer-group' });

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

  async handleSub() {
    let payload: SubPayload;

    //************* subscribe / consume part *************
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'need-sub-from-appY',
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          partition,
          value: message.value.toString(),
        });

        payload = JSON.parse(message.value.toString());
      },
    });
    //****************************************************

    //deconstructure and assign
    const x = payload.x;
    const y = payload.y;

    //process business logic
    const result = x - y;

    //publish part
    await this.producer.connect();
    await this.producer.send({
      topic: 'need-back-sub-result-to-appX',
      messages: [{ value: `result:${result}` }],
    });
  }
}
