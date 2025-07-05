import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalUrl: string;

  @Index()
  @Column({ unique: true })
  slug: string;

  @Column({ default: 0 })
  visitCount: number;

  @Index()
  @ManyToOne(() => User, user => user.urls, { nullable: true })
  user: User;

  @CreateDateColumn()
  created_at: Date;
}
