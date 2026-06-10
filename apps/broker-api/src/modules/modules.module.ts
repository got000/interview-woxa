import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { BrokerModule } from './broker/broker.module';

@Module({
  imports: [AuthModule, UsersModule, RolesModule, BrokerModule],
  exports: [AuthModule, UsersModule, RolesModule, BrokerModule],
})
export class ModulesModule {}
