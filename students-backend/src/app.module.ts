// ─────────────────────────────────────────────
//  app.module.ts  —  root module
//  connects to postgres and loads all feature
//  modules (just students for now)
// ─────────────────────────────────────────────

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module';
import { Student } from './students/student.entity';

@Module({
  imports: [
    // load .env file and make ConfigService available everywhere
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // set up TypeORM with postgres using values from .env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host:     config.get('DB_HOST'),
        port:     +config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [Student],
        // auto-creates/updates the table on startup — handy for dev,
        // switch to migrations before going to production
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    StudentsModule,
  ],
})
export class AppModule {}
