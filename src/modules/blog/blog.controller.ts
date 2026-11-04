import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { BlogResponseDto } from './dto/blog-response.dto';

// ⚠️ Apne project ke hisaab se paths adjust kar lein
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequireRole } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { SerializeResponse } from 'src/common/decorators/serialize.interceptor';
import { multerImageOptions } from 'src/shared/cloudinary/multer.config';

@Controller('blogs')
@SerializeResponse(BlogResponseDto)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // ================= PUBLIC =================

  // GET /blogs?search=dubai&category=Destinations&page=1&limit=9
  @Public()
  @Get()
  async findPublic(@Query() query: QueryBlogDto) {
    try {
      return await this.blogService.findPublic(query);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch blogs');
    }
  }

  @Public()
  @Get('featured')
  async findFeatured() {
    try {
      return await this.blogService.findFeatured();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch featured blog');
    }
  }

  // ================= ADMIN =================

  // GET /blogs/admin/all?search=umrah&isPublished=false
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRole('admin')
  async findAllAdmin(@Query() query: QueryBlogDto) {
    try {
      return await this.blogService.findAllAdmin(query);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch blogs');
    }
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRole('admin')
  async findById(@Param('id') id: string) {
    try {
      return await this.blogService.findById(id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch blog');
    }
  }

  // multipart/form-data, image field ka naam: "image"
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('image', multerImageOptions  ))
  async create(
    @Body() dto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return await this.blogService.create(dto, file);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create blog');
    }
  }

  // Image optional hai: bheji to replace hogi, warna purani rahegi
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('image', multerImageOptions))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      return await this.blogService.update(id, dto, file);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update blog');
    }
  }

  @Patch(':id/toggle-publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRole('admin')
  async togglePublish(@Param('id') id: string) {
    try {
      return await this.blogService.togglePublish(id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update publish status');
    }
  }

  @Patch(':id/toggle-featured')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRole('admin')
  async toggleFeatured(@Param('id') id: string) {
    try {
      return await this.blogService.toggleFeatured(id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update featured status');
    }
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRole('admin')
  async remove(@Param('id') id: string) {
    try {
      return await this.blogService.remove(id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete blog');
    }
  }

  // ⚠️ Hamesha sabse last me, warna "featured"/"admin" ko slug samajh lega
  @Public()
  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    try {
      return await this.blogService.findBySlug(slug);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch blog');
    }
  }
}