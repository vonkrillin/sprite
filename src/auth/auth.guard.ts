import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

// Role Enum for RBAC implementation
export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      // Attaches the organization to the context request object
      // so it can be accessed in route handlers
      request['organization'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}


@Injectable()
export class CookieSSRGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const token = request.cookies?.access_token;

    if (!token) {
      response.redirect('/dashboard/login');
      return false;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      request['organization'] = payload;
      return true;
    } catch {
      response.redirect('/dashboard/login');
      return false;
    }
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  // constructor(private reflector: Reflector) {} // Inject Reflector when implementing core logic

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const organization = request.organization; // Attached by JWTAuthGuard

    // Core implementation for RBAC logic skipped as requested
    // Example logic to be added later:
    // const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);
    // if (!requiredRoles) return true;
    // return requiredRoles.some((role) => organization?.roles?.includes(role));

    return true;
  }
}
