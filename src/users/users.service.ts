import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/typeorm/entities';
import { Repository } from 'typeorm';
import { SignUpDto } from 'src/auth/dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(dto: SignUpDto) {
    const newUser = this.usersRepository.create(dto);
    return this.usersRepository.save(newUser);
  }

  findOne(criteria: object) {
    return this.usersRepository.findOneBy(criteria);
  }
}
