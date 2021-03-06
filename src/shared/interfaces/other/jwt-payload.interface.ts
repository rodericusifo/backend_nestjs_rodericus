import { Role } from '@shared/enums/role.enum';

export interface IJwtPayload {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly roles: Role[];
  readonly iat: number;
  readonly exp: number;
}
