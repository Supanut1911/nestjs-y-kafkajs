import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    console.log('yo=>', process.env.TEST);

    return await this.appService.getHello();
  }

  @Get('/consume')
  async getMessage() {
    return await this.appService.handleSubscribe();
  }
}
