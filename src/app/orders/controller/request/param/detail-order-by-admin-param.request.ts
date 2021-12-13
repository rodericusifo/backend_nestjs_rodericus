import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { randomUUID } from 'crypto';

export class DetailOrderByAdminParamRequest {
  @ApiProperty({ example: randomUUID() })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
