import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, OneToMany } from 'typeorm';
import { Url } from '../url/url.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  password: string; // hashed

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Url, url => url.user)
  urls: Url[];
}