import { Test, TestingModule } from '@nestjs/testing';
import { LikedGameService } from './liked-game.service';

describe('LikedGameService', () => {
  let service: LikedGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikedGameService],
    }).compile();

    service = module.get<LikedGameService>(LikedGameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
