// ─────────────────────────────────────────────
//  main.ts  —  app entry point
//  starts the server, enables CORS so the
//  React frontend can talk to it
// ─────────────────────────────────────────────

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // allow requests from the React frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  });

  // auto-validate incoming request bodies using class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // strip unknown fields
      forbidNonWhitelisted: true,
      transform: true,       // auto-cast types (e.g. string -> number)
    }),
  );

  // prefix all routes with /api
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`\n🚀 Server running on http://localhost:${port}/api`);
  console.log(`📋 Students endpoint: http://localhost:${port}/api/students\n`);
}

bootstrap();
