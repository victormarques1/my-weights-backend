import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/core/services/prisma.service';
import { GuestOnlyGuard } from 'src/auth/guards/guest-only.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, GuestOnlyGuard],
  exports: [UsersService],
})
export class UsersModule {}
