import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BrokerService } from './broker.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './../../config/guard/auth.guard';
import {
  CreateBrokerInput,
  GetBrokerInput,
  UpdateSlugInput,
} from './inputs/broker.input';
import { User } from 'src/config/decorators/user.decorator';
import { IUserInSession } from 'src/config/decorators/decorator.inteface';

@Controller('broker')
@ApiTags('Broker')
export class BrokerController {
  constructor(private readonly brokerService: BrokerService) {}

  @Get('/broker-type')
  async getBrokerType() {
    return await this.brokerService.getBrokerType();
  }

  @Get(':id')
  async getBroker(@Param('id') brokerId: string) {
    return await this.brokerService.getBroker(brokerId);
  }

  @Get()
  async getBrokers(@Query() query: GetBrokerInput) {
    return await this.brokerService.getBrokers(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createBroker(
    @Body() payload: CreateBrokerInput,
    @User() user: IUserInSession,
  ) {
    return await this.brokerService.createBroker(payload, user?._id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateBroker(
    @Param('id') brokerId: string,
    @Body() payload: CreateBrokerInput,
    @User() user: IUserInSession,
  ) {
    return await this.brokerService.updateBroker(brokerId, payload, user?._id);
  }

  @Put(':id/update-slug')
  @UseGuards(AuthGuard)
  async updateSlug(
    @Param('id') brokerId: string,
    @User() user: IUserInSession,
    @Body() payload: UpdateSlugInput,
  ) {
    return await this.brokerService.updateSlug(brokerId, payload, user?._id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteBroker(
    @Param('id') brokerId: string,
    @User() user: IUserInSession,
  ) {
    return await this.brokerService.deleteOrRestoreBroker(
      brokerId,
      user?._id,
      'delete',
    );
  }

  @Patch(':id/restore')
  @UseGuards(AuthGuard)
  async restoreBroker(
    @Param('id') brokerId: string,
    @User() user: IUserInSession,
  ) {
    return await this.brokerService.deleteOrRestoreBroker(
      brokerId,
      user?._id,
      'restore',
    );
  }
}
