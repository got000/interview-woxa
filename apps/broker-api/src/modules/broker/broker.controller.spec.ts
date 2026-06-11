import { Test, TestingModule } from '@nestjs/testing';
import { BrokerController } from './broker.controller';
import { BrokerService } from './broker.service';
import { IUserInSession } from 'src/config/decorators/decorator.inteface';

const CURRENT_USER = {
  _id: 'user-1',
  full_name: 'User One',
  email: 'user@example.com',
} as IUserInSession;

describe('BrokerController', () => {
  let controller: BrokerController;
  let brokerService: {
    getBrokerType: jest.Mock;
    getBroker: jest.Mock;
    getBrokers: jest.Mock;
    createBroker: jest.Mock;
    updateBroker: jest.Mock;
    updateSlug: jest.Mock;
    deleteOrRestoreBroker: jest.Mock;
  };

  beforeEach(async () => {
    brokerService = {
      getBrokerType: jest.fn(),
      getBroker: jest.fn(),
      getBrokers: jest.fn(),
      createBroker: jest.fn(),
      updateBroker: jest.fn(),
      updateSlug: jest.fn(),
      deleteOrRestoreBroker: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrokerController],
      providers: [{ provide: BrokerService, useValue: brokerService }],
    }).compile();

    controller = module.get<BrokerController>(BrokerController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBrokerType', () => {
    it('delegates to BrokerService.getBrokerType', async () => {
      const result = { result: ['cfd', 'bond'] };
      brokerService.getBrokerType.mockResolvedValue(result);

      await expect(controller.getBrokerType()).resolves.toBe(result);
    });
  });

  describe('getBroker', () => {
    it('delegates to BrokerService.getBroker with the slug', async () => {
      const result = { result: { slug: 'acme' } };
      brokerService.getBroker.mockResolvedValue(result);

      await expect(controller.getBroker('acme')).resolves.toBe(result);
      expect(brokerService.getBroker).toHaveBeenCalledWith('acme');
    });
  });

  describe('getBrokers', () => {
    it('delegates to BrokerService.getBrokers with the query', async () => {
      const query = { limit: 10, skip: 1 };
      const result = { result: [] };
      brokerService.getBrokers.mockResolvedValue(result);

      await expect(controller.getBrokers(query)).resolves.toBe(result);
      expect(brokerService.getBrokers).toHaveBeenCalledWith(query);
    });
  });

  describe('createBroker', () => {
    it('delegates to BrokerService.createBroker with the current user id', async () => {
      const payload = { slug: 'new-broker' } as never;
      const result = { message: 'create broker success' };
      brokerService.createBroker.mockResolvedValue(result);

      await expect(
        controller.createBroker(payload, CURRENT_USER),
      ).resolves.toBe(result);
      expect(brokerService.createBroker).toHaveBeenCalledWith(
        payload,
        CURRENT_USER._id,
      );
    });
  });

  describe('updateBroker', () => {
    it('delegates to BrokerService.updateBroker with the current user id', async () => {
      const payload = { slug: 'updated-slug' } as never;
      const result = { message: 'update broker success' };
      brokerService.updateBroker.mockResolvedValue(result);

      await expect(
        controller.updateBroker('broker-1', payload, CURRENT_USER),
      ).resolves.toBe(result);
      expect(brokerService.updateBroker).toHaveBeenCalledWith(
        'broker-1',
        payload,
        CURRENT_USER._id,
      );
    });
  });

  describe('updateSlug', () => {
    it('delegates to BrokerService.updateSlug with the current user id', async () => {
      const payload = { slug: 'new-slug' };
      const result = { message: 'update slug success' };
      brokerService.updateSlug.mockResolvedValue(result);

      await expect(
        controller.updateSlug('broker-1', CURRENT_USER, payload),
      ).resolves.toBe(result);
      expect(brokerService.updateSlug).toHaveBeenCalledWith(
        'broker-1',
        payload,
        CURRENT_USER._id,
      );
    });
  });

  describe('deleteBroker', () => {
    it('delegates to BrokerService.deleteOrRestoreBroker with action "delete"', async () => {
      const result = { message: 'delete broker success' };
      brokerService.deleteOrRestoreBroker.mockResolvedValue(result);

      await expect(
        controller.deleteBroker('broker-1', CURRENT_USER),
      ).resolves.toBe(result);
      expect(brokerService.deleteOrRestoreBroker).toHaveBeenCalledWith(
        'broker-1',
        CURRENT_USER._id,
        'delete',
      );
    });
  });

  describe('restoreBroker', () => {
    it('delegates to BrokerService.deleteOrRestoreBroker with action "restore"', async () => {
      const result = { message: 'restore broker success' };
      brokerService.deleteOrRestoreBroker.mockResolvedValue(result);

      await expect(
        controller.restoreBroker('broker-1', CURRENT_USER),
      ).resolves.toBe(result);
      expect(brokerService.deleteOrRestoreBroker).toHaveBeenCalledWith(
        'broker-1',
        CURRENT_USER._id,
        'restore',
      );
    });
  });
});
