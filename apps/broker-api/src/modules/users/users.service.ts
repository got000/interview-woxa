import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CryptorService } from 'src/common/cryptor/cryptor.service';
import { ObjectId } from 'mongodb';
import { AggregateCommon } from 'src/common/aggregates/aggregate.common';
import { AggregateLookup } from 'src/common/aggregates/aggregate.lookup';
import { throwHttpException } from 'src/config/filters/http-error.exception.filter';
import { successResponse } from 'src/config/filters/http-success.response';
import { ERROR_MESSAGES, StatusEnum } from 'src/config/constants';
import {
  ChangeUserPasswordInput,
  CreateUserInput,
  GetUserInput,
  UserInput,
} from './inputs';
import { HelperService } from 'src/common/helper/helper.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name)
    private readonly usersModel: Model<Users>,
    private readonly cryptorService: CryptorService,
    private readonly aggregateCommon: AggregateCommon,
    private readonly helperService: HelperService,
  ) {}

  async getUserById(userId: string) {
    const user = await this.usersModel.findOne({
      _id: new ObjectId(userId),
      is_deleted: false,
    });
    return user;
  }

  async getUserByUsername(username: string) {
    username = username?.toLowerCase?.();

    const user = await this.usersModel.findOne({
      email: username,
      is_deleted: false,
    });
    return user;
  }

  async getUser(userId: string) {
    const result = await this.getUserById(userId);
    return successResponse({
      message: `get user successfuly`,
      result,
    });
  }

  async getUsers(payload: GetUserInput) {
    const { limit, skip, user_id } = payload;
    const search = this.helperService.getSearchRegExp(payload?.search ?? '');

    const match = {
      is_deleted: false,
      ...(search && {
        $or: [{ full_name: search }, { email: search }],
      }),
      ...(user_id && { _id: new ObjectId(user_id) }),
    };

    const result = await this.usersModel.aggregate([
      {
        $match: match,
      },
      {
        $sort: {
          created_at: -1,
        },
      },
      ...this.aggregateCommon.pagination({
        skip: Number(skip) || 1,
        limit: Number(limit) || 10,
      }),
      {
        $addFields: {
          status_info: {
            title: this.aggregateCommon.getStatusInfo(),
            value: '$status',
          },
        },
      },
    ]);

    const total = await this.usersModel.countDocuments(match);
    const total_pages = Math.ceil(total / Number(limit ?? 10));
    const current_page = Number(skip) || 1;

    return successResponse({
      message: `get user successfuly`,
      result,
      pagination: {
        current_page,
        total_pages,
        total,
      },
    });
  }

  async createUser(input: CreateUserInput) {
    const { email, full_name } = input;
    const { password, confirm_password } = input;
    const user: any = {
      full_name,
      email,
      status: StatusEnum.ACTIVE,
    };

    const comparePassword = this.validateComparePassword(
      password,
      confirm_password,
    );

    if (!comparePassword) {
      throwHttpException(ERROR_MESSAGES.PASSWORD_MISMATCH);
    }
    const hashPassword = await this.cryptorService.encryptPassword(password);

    user['password'] = hashPassword;

    const checkExitsEmail = await this.checkExitsEmail(email);
    if (checkExitsEmail) {
      throwHttpException(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    await this.usersModel.create(user);

    return successResponse({ message: `create user success` });
  }

  async updateUser(userId: string, input: UserInput, userModifyId: string) {
    const { full_name, email } = input;

    const filter = { _id: new ObjectId(userId) };
    const user = await this.usersModel.findOne(filter);
    if (!user) {
      throwHttpException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const checkExitsEmail = await this.checkExitsEmail(email, userId);
    if (checkExitsEmail) {
      throwHttpException(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    await this.usersModel.updateOne(filter, {
      $set: {
        updated_at: new Date(),
        updated_by: new ObjectId(userModifyId),
        full_name,
        email,
      },
    });

    return successResponse({ message: `update user success` });
  }

  async deleteUser(userId: string, userModifyId: string) {
    const filter = { _id: new ObjectId(userId) };

    await this.usersModel.updateOne(filter, {
      $set: {
        deleted_at: new Date(),
        deleted_by: new ObjectId(userModifyId),
        is_deleted: true,
      },
    });

    return successResponse({ message: `delete user success` });
  }

  async checkExitsEmail(email: string, userId?: string) {
    email = email?.toLowerCase();
    const user = await this.usersModel.findOne({
      email,
      is_deleted: false,
      ...(userId && { _id: { $ne: new ObjectId(userId) } }),
    });
    return user;
  }

  validateComparePassword(password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      return false;
    }

    return true;
  }

  async updatePassword(
    userId: string,
    input: ChangeUserPasswordInput,
    userModifyId: string,
  ) {
    const { password, confirm_password } = input;
    const filter = { _id: new ObjectId(userId) };
    const user = await this.usersModel
      .findOne(filter)
      .orFail(() => throwHttpException(ERROR_MESSAGES.USER_NOT_FOUND));

    const comparePassword = this.validateComparePassword(
      password,
      confirm_password,
    );
    if (!comparePassword) {
      throwHttpException(ERROR_MESSAGES.PASSWORD_MISMATCH);
    }

    const currentPassword = user?.toObject().password ?? '';
    const compareCurrentAndNew = currentPassword
      ? await this.cryptorService.verifyPassword(password, currentPassword)
      : false;

    if (compareCurrentAndNew) {
      throwHttpException(ERROR_MESSAGES.SAME_PASSWORD);
    }

    const hashPassword = await this.cryptorService.encryptPassword(password);

    await this.usersModel.updateOne(filter, {
      $set: {
        password: hashPassword,
        updated_at: new Date(),
        updated_by: new ObjectId(userModifyId),
      },
    });

    return successResponse({ message: `change password user success` });
  }

  validateAndFormatPhonNumber(phoneNumber: string) {
    const startZero = phoneNumber.startsWith('0');
    let phone_number = phoneNumber;
    if (startZero) {
      phone_number = phoneNumber.slice(1);
    }

    if (startZero && phone_number.length !== 9) {
      throwHttpException(ERROR_MESSAGES.PHONE_NUMBER_IVALID_FORMAT);
    }

    return phoneNumber;
  }
}
