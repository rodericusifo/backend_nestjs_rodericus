import { UnauthorizedException } from '@nestjs/common';
import { Role } from '@shared/enum/role.enum';
import * as bcrypt from 'bcrypt';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UserDTO {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(Role, { each: true })
  roles?: Role[];

  @IsOptional()
  @IsDateString()
  createdAt?: Date;

  @IsOptional()
  @IsDateString()
  updatedAt?: Date;

  @IsOptional()
  @IsDateString()
  deletedAt?: Date;

  setAsAdmin() {
    this.roles = [Role.Admin];
  }

  setAsCustomer() {
    this.roles = [Role.Customer];
  }

  async encryptPassword(passwordSaltLength: number) {
    this.password = await bcrypt.hash(this.password, passwordSaltLength);
  }

  async decryptPasswordAndValidate(password: string) {
    const isPasswordValid = await bcrypt.compare(password, this.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        `Combination between Email and Password doesn't match`,
      );
    }
  }
}