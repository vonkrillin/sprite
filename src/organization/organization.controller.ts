import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { OrganizationService } from './organization.service';
import { CreateOrgDto } from './dto/create.organization.dto';
import { JWTAuthGuard } from 'src/auth/auth.guard';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  getOrganizations() {
    return this.organizationService.getOrgs();
  }

  @Get(':id')
  getOrganization(@Param('id') id: string) {
    return this.organizationService.getOrgById(id);
  }

  @Post()
  createOrganization(
    @Body(new ZodValidationPipe()) createOrgDto: CreateOrgDto,
  ) {
    return this.organizationService.create(createOrgDto);
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  removeOrganization(@Param('id') id: string, @Req() req: any) {
    if (id !== req.organization._id)
      throw new ForbiddenException("You don't have necessary permission.");
    return this.organizationService.deleteOrg(id);
  }
}
