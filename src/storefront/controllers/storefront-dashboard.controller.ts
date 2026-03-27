import {
    Body,
    Controller,
    Get,
    Post,
    Render,
    Res,
    UseGuards,
    Req,
    Query,
} from '@nestjs/common';
import { StorefrontService } from '../storefront.service';
import {
    CreateProduct,
    ProductCategoryDto,
} from '../dto/create.storefront.dto';
import { type Response } from 'express';
import { CookieSSRGuard } from '../../auth/auth.guard';

@Controller('dashboard')
@UseGuards(CookieSSRGuard)
export class StorefrontDashboardController {
    constructor(private readonly storefrontService: StorefrontService) { }

    @Get('products')
    @Render('dashboard/products/index')
    async getProducts(
        @Req() req: any,
        @Query('page') pageQuery: string = '1',
        @Query('limit') limitQuery: string = '10',
    ) {
        const page = parseInt(pageQuery, 10) || 1;
        const limit = parseInt(limitQuery, 10) || 10;
        const organizationId = req.organization._id;
        const { data, total } = await this.storefrontService.getAllProducts(
            organizationId,
            {
                page,
                limit,
            }
        );

        const totalPages = Math.ceil(total / limit);

        return {
            title: 'Products',
            products: data,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
                nextPage: page + 1,
                prevPage: page - 1,
            },
            showSidebar: true,
        };
    }

    @Get('products/create')
    @Render('dashboard/products/create')
    async getCreateProduct(@Req() req: any) {
        const organizationId = req.organization._id;
        const { data: categories } = await this.storefrontService.getAllCategories(
            organizationId,
            {
                page: 1,
                limit: 100,
            },
        );
        return { title: 'Create Product', categories, showSidebar: true };
    }

    @Post('products/create')
    async postCreateProduct(
        @Body() productDto: CreateProduct,
        @Req() req: any,
        @Res() res: Response,
    ) {
        try {
            const organizationId = req.organization._id;
            await this.storefrontService.createProduct({
                ...productDto,
                organization: organizationId,
            } as any);
            return res.redirect('/dashboard/products');
        } catch (error) {
            const { data: categories } = await this.storefrontService.getAllCategories(
                req.organization._id,
                {
                    page: 1,
                    limit: 100,
                },
            );
            return res.render('dashboard/products/create', {
                title: 'Create Product',
                categories,
                showSidebar: true,
                error: error.message || 'An error occurred during product creation',
            });
        }
    }

    @Get('categories')
    @Render('dashboard/categories/index')
    async getCategories(
        @Req() req: any,
        @Query('page') pageQuery: string = '1',
        @Query('limit') limitQuery: string = '10',
    ) {
        const page = parseInt(pageQuery, 10) || 1;
        const limit = parseInt(limitQuery, 10) || 10;
        const organizationId = req.organization._id;
        const { data, total } = await this.storefrontService.getAllCategories(
            organizationId,
            {
                page,
                limit,
            },
        );

        const totalPages = Math.ceil(total / limit);

        return {
            title: 'Categories',
            categories: data,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
                nextPage: page + 1,
                prevPage: page - 1,
            },
            showSidebar: true,
        };
    }

    @Get('categories/create')
    @Render('dashboard/categories/create')
    getCreateCategory() {
        return { title: 'Create Category', showSidebar: true };
    }

    @Post('categories/create')
    async postCreateCategory(
        @Body() categoryDto: ProductCategoryDto,
        @Req() req: any,
        @Res() res: Response,
    ) {
        try {
            const organizationId = req.organization._id;
            await this.storefrontService.createCategory(categoryDto, organizationId);
            return res.redirect('/dashboard/categories');
        } catch (error) {
            return res.render('dashboard/categories/create', {
                title: 'Create Category',
                showSidebar: true,
                error: error.message || 'An error occurred during category creation',
            });
        }
    }
}
