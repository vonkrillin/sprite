import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginOrgDto } from 'src/organization/dto/create.organization.dto';
import { CookieSSRGuard } from 'src/auth/auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(CookieSSRGuard)
  @Render('dashboard/index')
  getDashboard() {
    return { title: 'Dashboard' };
  }

  @Get('login')
  @Render('dashboard/login')
  getLogin() {
    return { title: 'Login' };
  }

  @Post('login')
  async postLogin(@Body() loginDto: LoginOrgDto, @Res() res: any) {
    try {
      const result = await this.authService.signIn(loginDto);
      if (result && result.access_token) {
        // Set HTTP-only cookie for the JWT token
        res.cookie('access_token', result.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 60 * 1000, // 30 minutes (matches JWT expiry)
        });
        return res.redirect('/dashboard');
      }
      return res.render('dashboard/login', {
        title: 'Login',
        error: 'Invalid email or password',
      });
    } catch (error) {
      return res.render('dashboard/login', {
        title: 'Login',
        error: error.message || 'An error occurred during login',
      });
    }
  }
}
