// src/auth/guards/guest-only.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GuestOnlyGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return true;
    }

    try {
      const token = authHeader.split(' ')[1];
      const secret = this.configService.get<string>('JWT_SECRET');

      this.jwtService.verify(token, { secret });
      throw new ForbiddenException('Você já está logado');
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      return true;
    }
  }
}
