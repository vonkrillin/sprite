import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Body,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { OrganizationService } from './organization.service';
import { CreateOrgDto } from './dto/create.organization.dto';

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
  removeOrganization(@Param('id') id: string) {
    return this.organizationService.deleteOrg(id);
  }
}
