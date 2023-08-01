import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: 'sessions' })
export class SessionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  agent: string;

  @Column({ nullable: true })
  hash: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.sessions)
  user: UserEntity;
}