import { 
  Controller, Post, Body, UseInterceptors, UploadedFile, UploadedFiles, 
  Get, HttpException, HttpStatus, Param, Patch, Delete, Query 
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProductsService } from './products.service';
import { CreateProductDto } from './DTO/product.dto';
import { isValidObjectId } from 'mongoose';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ===== Single Image Upload =====
  @Post('create-single')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async createSingle(@Body() dto: CreateProductDto, @UploadedFile() file: Express.Multer.File) {
    try {
      const product = await this.productsService.create(dto, [file.filename]);
      return { success: true, message: 'Product created with single image', data: product };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // ===== Multiple Images Upload =====
  @Post('create-multiple')
  @UseInterceptors(
    FilesInterceptor('images', 5, {  // max 5 files
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async createMultiple(@Body() dto: CreateProductDto, @UploadedFiles() files: Express.Multer.File[]) {
    try {
      const fileNames = files.map(file => file.filename);
      const product = await this.productsService.create(dto, fileNames);
      return { success: true, message: 'Product created with multiple images', data: product };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

 // ===== Get All Products with Filters =====
  @Get('all')
  async getAll(
    @Query('name') name?: string,
    @Query('createdAt') createdAt?: string,
    @Query('stock') stock?: number,
  ) {
    try {
      const filters: any = {};
      if (name) filters.name = { $regex: name, $options: 'i' }; // case insensitive search
      if (createdAt) filters.createdAt = { $gte: new Date(createdAt) };
      if (stock) filters.stock = Number(stock);

      const products = await this.productsService.findAll(filters);
      return { success: true, data: products };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // ===== Get Product By ID =====
 
@Get(':id')
async getById(@Param('id') id: string) {
  if (!isValidObjectId(id)) {
    throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
  }

  const product = await this.productsService.findById(id);
  if (!product) {
    throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
  }

  return { success: true, data: product };
}

  // ===== Update Product =====
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateProductDto>) {
    try {
      const product = await this.productsService.update(id, dto);
      return { success: true, message: 'Product updated successfully', data: product };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // ===== Delete Product =====
  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      await this.productsService.delete(id);
      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
