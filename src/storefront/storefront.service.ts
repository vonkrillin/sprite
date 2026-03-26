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

  async getAllProducts(): Promise<Products[] | []> {
    return await this.productsModel.find().populate('category');
  }

  async getProductById(id: string | Types.ObjectId): Promise<Products> {
    const product = await this.productsModel.findById(id).populate('category');
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async updateProduct(
    id: string | Types.ObjectId,
    productDto: UpdateProductDto,
  ): Promise<Products> {
    const product = await this.productsModel.findByIdAndUpdate(
      id,
      { $set: productDto },
      { new: true },
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async deleteProduct(id: string | Types.ObjectId): Promise<any> {
    const product = await this.productsModel.findByIdAndDelete(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  // Category Operations
  async createCategory(
    categoryDto: ProductCategoryDto,
  ): Promise<ProductCategory> {
    try {
      return await this.productCategoryModel.create(categoryDto);
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Category already exists');
      }
      throw error;
    }
  }

  async resolveCategoryIds(
    categoryNames: string[],
  ): Promise<Record<string, Types.ObjectId>> {
    const uniqueNames = [...new Set(categoryNames.filter(Boolean))];
    const categoryMap: Record<string, Types.ObjectId> = {};

    for (const name of uniqueNames) {
      let category = await this.productCategoryModel.findOne({ name });
      if (!category) {
        category = await this.productCategoryModel.create({ name });
      }
      categoryMap[name] = category._id as Types.ObjectId;
    }

    return categoryMap;
  }

  async getAllCategories(): Promise<ProductCategory[] | []> {
    return await this.productCategoryModel.find();
  }

  async getCategoryById(id: string | Types.ObjectId): Promise<ProductCategory> {
    const category = await this.productCategoryModel.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async updateCategory(
    id: string | Types.ObjectId,
    categoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategory> {
    const category = await this.productCategoryModel.findByIdAndUpdate(
      id,
      { $set: categoryDto },
      { new: true },
    );
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async deleteCategory(id: string | Types.ObjectId): Promise<any> {
    const category = await this.productCategoryModel.findByIdAndDelete(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }
}
