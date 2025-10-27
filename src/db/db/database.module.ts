import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from './database.config'; // ✅ Import your config file

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigModule accessible everywhere
      envFilePath: '.env',
      load: [databaseConfig], // ✅ load your database config
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        ...configService.get('database'),
      }),
    }),
  ],
})
export class DatabaseModule {}
