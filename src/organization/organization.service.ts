import { Model, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from 'src/models/organization';
import { CreateOrgDto } from './dto/create.organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<Organization>,
  ) {}

  async create(CreateOrgDto: CreateOrgDto): Promise<Organization> {
    try {
      if (CreateOrgDto.password) {
        CreateOrgDto.password = bcrypt.hashSync(CreateOrgDto.password, 10);
      }
      return await this.organizationModel.create({
        ...CreateOrgDto,
      });
    } catch (error) {
      console.log(error, 'error');
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async getOrgById(id: string | Types.ObjectId): Promise<Organization | null> {
    const organization = await this.organizationModel.findById(id);
    if (!organization) throw new NotFoundException('Organization not found');
    return organization;
  }

  async getOrgs(): Promise<Organization[] | []> {
    return await this.organizationModel.find();
  }

  async deleteOrg(orgId: string | Types.ObjectId) {
    // Delete the board
    return await this.organizationModel.findByIdAndDelete(orgId);
  }

  async findOrgByEmail(email: string) {
    return await this.organizationModel.findOne({ email });
  }
}
