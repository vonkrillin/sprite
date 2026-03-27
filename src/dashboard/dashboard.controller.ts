import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Render,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import {
  CreateOrgDto,
  LoginOrgDto,
} from '../organization/dto/create.organization.dto';
import { type Response } from 'express';
import { CookieSSRGuard } from '../auth/auth.guard';
import { OrganizationService } from '../organization/organization.service';
import { StorefrontService } from '../storefront/storefront.service';
import { WalletsService } from '../wallets/wallets.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly authService: AuthService,
    private readonly organizationService: OrganizationService,
    private readonly storefrontService: StorefrontService,
    private readonly walletsService: WalletsService,
  ) {}

  @Get()
  @UseGuards(CookieSSRGuard)
  @Render('dashboard/index')
  async getDashboard(@Req() req: any) {
    const organizationId = req.organization._id;

    // Fetch counts and recent data
    const [productsData, categoriesData, wallets] = await Promise.all([
      this.storefrontService.getAllProducts(organizationId, { page: 1, limit: 5 }),
      this.storefrontService.getAllCategories(organizationId, { page: 1, limit: 1 }),
      this.walletsService.listWallets({ organizationId }),
    ]);

    return {
      title: 'Dashboard',
      showSidebar: true,
      stats: {
        totalProducts: productsData.total,
        totalCategories: categoriesData.total,
        totalWallets: wallets.length,
      },
      recentProducts: productsData.data,
    };
  }

  @Get('login')
  @Render('dashboard/login')
  getLogin(@Query('success') success?: string) {
    return { title: 'Login', success };
  }

  @Post('login')
  async postLogin(@Body() loginDto: LoginOrgDto, @Res() res: Response) {
    try {
      const result = await this.authService.signIn(loginDto);
      if (result && result.access_token) {
        res.cookie('access_token', result.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 60 * 1000,
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

  @Get('register')
  @Render('dashboard/register')
  getRegister() {
    return { title: 'Register' };
  }

  @Post('register')
  async postRegister(@Body() createOrgDto: CreateOrgDto, @Res() res: Response) {
    try {
      await this.organizationService.create(createOrgDto);
      return res.redirect(
        '/dashboard/login?success=Account created successfully. Please login.',
      );
    } catch (error) {
      return res.render('dashboard/register', {
        title: 'Register',
        error: error.message || 'An error occurred during registration',
      });
    }
  }
}
