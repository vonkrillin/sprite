import { BadRequestException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { LoginOrgDto } from 'src/organization/dto/create.organization.dto';
import { OrganizationService } from 'src/organization/organization.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private organization: OrganizationService,
    private jwt: JwtService,
  ) {}

  async signIn(loginDto: LoginOrgDto): Promise<any> {
    const user = await this.organization.findOrgByEmail(loginDto.email);
    if (user) {
      if (!bcrypt.compareSync(loginDto.password, user.password)) {
        throw new BadRequestException('Invalid email or password');
      }

      let token = await this.createUserAccessToken({
        _id: user._id,
        email: user.email,
      });

      return {
        user,
        access_token: token,
      };
    }
  }

  async createUserAccessToken(org: {
    _id: string | Types.ObjectId;
    email: string;
  }) {
    return this.jwt.signAsync(org, {
      expiresIn: '30m',
      secret: process.env.ACCESS_TOKEN_SECRET as string,
    });
  }
}
