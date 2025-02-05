import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Length, IsEmail } from 'class-validator';
import * as argon2 from 'argon2';
import { Keybind } from './Keybind';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  @Length(4, 20)
  username: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @Length(4, 100)
  password: string;

  @ManyToMany(() => Keybind, { cascade: true })
  @JoinTable()
  userFavorites: Keybind[];

  @BeforeInsert() async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  validatedUnencryptedPassword(unencryptedPassword: string) {
    return argon2.verify(this.password, unencryptedPassword);
  }
}
