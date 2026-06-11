import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { BrokerTypeEnum } from './../src/config/constants';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/broker/broker-type (GET) returns the available broker types', async () => {
    const response = await request(app.getHttpServer())
      .get('/broker/broker-type')
      .expect(200);

    expect(response.body.result).toEqual(Object.values(BrokerTypeEnum));
  });

  it('/users (GET) requires authentication', () => {
    return request(app.getHttpServer()).get('/users').expect(401);
  });
});
