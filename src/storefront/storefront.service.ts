import { Model, Types } from 'mongoose';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductCategory, Products } from 'src/models/products';
import {
  CreateProduct,
  UpdateProductDto,
  ProductCategoryDto,
  UpdateProductCategoryDto,
} from './dto/create.storefront.dto';

@Injectable()
export class StorefrontService {
  constructor(
    @InjectModel(Products.name)
    private productsModel: Model<Products>,
    @InjectModel(ProductCategory.name)
    private productCategoryModel: Model<ProductCategory>,
  ) {}

  async createProduct(productDto: CreateProduct): Promise<Products> {
    return await this.productsModel.create(productDto);
  }

  async createManyProducts(products: CreateProduct[]) {
    const result = await this.productsModel.insertMany(products);
    return result;
  }

  async getAllProducts(id: string | Types.ObjectId): Promise<Products[] | []> {
    return await this.productsModel
      .find({ organization: new Types.ObjectId(id) })
      .populate('category');
  }

  async getProductById(data: {
    organizationId: string;
    productId: string;
  }): Promise<Products> {
    const product = await this.productsModel
      .findById({
        organization: new Types.ObjectId(data.organizationId),
        _id: new Types.ObjectId(data.productId),
      })
      .populate('category');
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async updateProduct(
    data: { organizationId: string; productId: string },
    productDto: UpdateProductDto,
  ): Promise<Products> {
    const product = await this.productsModel.findOneAndUpdate(
      {
        organization: new Types.ObjectId(data.organizationId),
        _id: new Types.ObjectId(data.productId),
      },
      { $set: productDto },
      { new: true },
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async deleteProduct(data: {
    organizationId: string;
    productId: string;
  }): Promise<any> {
    const product = await this.productsModel.findOneAndDelete({
      _id: new Types.ObjectId(data.productId),
      organization: data.organizationId,
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  // Category Operations
  async createCategory(
    categoryDto: ProductCategoryDto,
    organizationId: string | Types.ObjectId,
  ): Promise<ProductCategory> {
    try {
      return await this.productCategoryModel.create({
        ...categoryDto,
        organization: new Types.ObjectId(organizationId),
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Category already exists');
      }
      throw error;
    }
  }

  async resolveCategoryIds(
    categoryNames: string[],
    organizationId: string | Types.ObjectId,
  ): Promise<Record<string, Types.ObjectId>> {
    const uniqueNames = [...new Set(categoryNames.filter(Boolean))];
    const categoryMap: Record<string, Types.ObjectId> = {};

    for (const name of uniqueNames) {
      let category = await this.productCategoryModel.findOne({
        name,
        organization: new Types.ObjectId(organizationId),
      });
      if (!category) {
        category = await this.productCategoryModel.create({
          name,
          organization: new Types.ObjectId(organizationId),
        });
      }
      categoryMap[name] = category._id as Types.ObjectId;
    }

    return categoryMap;
  }

  async getAllCategories(
    organizationId: string | Types.ObjectId,
  ): Promise<ProductCategory[] | []> {
    return await this.productCategoryModel.find({
      organization: new Types.ObjectId(organizationId),
    });
  }

  async getCategoryById(data: {
    id: string | Types.ObjectId;
    organizationId: string | Types.ObjectId;
  }): Promise<ProductCategory> {
    const category = await this.productCategoryModel.findOne({
      _id: new Types.ObjectId(data.id),
      organization: new Types.ObjectId(data.organizationId),
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async updateCategory(
    data: {
      id: string | Types.ObjectId;
      organizationId: string | Types.ObjectId;
    },
    categoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategory> {
    const category = await this.productCategoryModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(data.id),
        organization: new Types.ObjectId(data.organizationId),
      },
      { $set: categoryDto },
      { new: true },
    );
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async deleteCategory(data: {
    id: string | Types.ObjectId;
    organizationId: string | Types.ObjectId;
  }): Promise<any> {
    const category = await this.productCategoryModel.findOneAndDelete({
      _id: new Types.ObjectId(data.id),
      organization: new Types.ObjectId(data.organizationId),
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }
}
