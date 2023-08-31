import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); //creates app
  await app.listen(3333); //Port 3333
}
bootstrap();
