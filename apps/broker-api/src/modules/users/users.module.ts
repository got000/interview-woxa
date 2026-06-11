import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersMongooseModule } from './schemas';
import { CommonModule } from './../../common/common.module';

@Module({
  imports: [UsersMongooseModule, CommonModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
