import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OrganizationService } from 'src/organization/organization.service';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from 'src/models/organization';
import { JWTAuthGuard, CookieSSRGuard } from './auth.guard';
import { Global } from '@nestjs/common';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, OrganizationService, JwtService, JWTAuthGuard, CookieSSRGuard],
  exports: [JWTAuthGuard, JwtService, AuthService, CookieSSRGuard],
})
export class AuthModule {}
