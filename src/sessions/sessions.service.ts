import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity, UserEntity } from 'src/typeorm/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionsRepository: Repository<SessionEntity>
  ) {}

  create(agent: string, hash: string, user: UserEntity) {
    const newSession = this.sessionsRepository.create({
      agent,
      hash,
      user,
    })

    return this.sessionsRepository.save(newSession)
  }
}