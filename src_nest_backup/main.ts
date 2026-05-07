import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.use(compression());

  app.enableCors({
    origin: true,
    methods: ['GET'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Holiday API Colombia')
    .setDescription(
      'API para consultar festivos nacionales de Colombia y calcular días hábiles.',
    )
    .setVersion('1.0.0')
    .addTag('Health', 'Estado del servicio')
    .addTag('Holiday', 'Consulta de festivos nacionales de Colombia')
    .addTag('Business Days', 'Cálculo de días hábiles en Colombia')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
