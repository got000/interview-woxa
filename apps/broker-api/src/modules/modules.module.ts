import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BrokerModule } from './broker/broker.module';

@Module({
  imports: [AuthModule, UsersModule, BrokerModule],
  exports: [AuthModule, UsersModule, BrokerModule],
})
export class ModulesModule {}
