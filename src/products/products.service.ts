import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './Schema/product.schema';
import { CreateProductDto } from './DTO/product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  // ===== Create Product =====
  async create(dto: CreateProductDto, images: string[]): Promise<Product> {
    try {
      const product = new this.productModel({ ...dto, images });
      return await product.save();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ===== Get All Products with Filters =====
  async findAll(filters: any = {}): Promise<Product[]> {
    try {
      return await this.productModel.find(filters).exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ===== Get Product By ID =====
  async findById(id: string): Promise<Product> {
    try {
      const product = await this.productModel.findById(id).exec();
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ===== Update Product =====
  async update(id: string, dto: Partial<CreateProductDto>): Promise<Product> {
    try {
      const updated = await this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
      if (!updated) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return updated;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ===== Delete Product =====
  async delete(id: string): Promise<void> {
    try {
      const deleted = await this.productModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
