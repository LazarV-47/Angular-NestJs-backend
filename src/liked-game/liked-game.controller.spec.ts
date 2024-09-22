import { Test, TestingModule } from '@nestjs/testing';
import { LikedGameController } from './liked-game.controller';

describe('LikedGameController', () => {
  let controller: LikedGameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikedGameController],
    }).compile();

    controller = module.get<LikedGameController>(LikedGameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
