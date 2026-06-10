import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IMongoEnv } from '../environments/environment.interface';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const { MONGO_URL } = configService.getOrThrow<IMongoEnv>('mongodb');
        return { uri: MONGO_URL };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
