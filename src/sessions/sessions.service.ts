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

  async create(agent: string, user: UserEntity) {
    const newSession = this.sessionsRepository.create({
      agent,
      user,
    })

    return await this.sessionsRepository.save(newSession)
  }

  async updateRtHash(id: number, hash: string) {
    await this.sessionsRepository.update({
      id
    }, {
      hash
    })
  }

  async findOne(criteria: Object) {
    return await this.sessionsRepository.findOneBy(criteria);
  }

  async findAll(userId: number) {
    return await this.sessionsRepository.createQueryBuilder("sessions")
    .leftJoinAndSelect("sessions.user", "user")
    .where("user.id = :userId", {userId})
    .select(["sessions.id", "sessions.agent", "sessions.createdAt"])
    .getMany();
  }

  async deleteOneById(id: number) {
    await this.sessionsRepository.delete({ id })

    return { message: 'successful' }
  }

  async deleteAllByUserId(id: number) {
    await this.sessionsRepository.delete({
      user: {
        id,
      }
    })

    return { message: 'successful' }
  }
}