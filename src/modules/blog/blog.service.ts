import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Blog, BlogDocument } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { IBlog, IPaginatedBlogs } from './interfaces/blog.interface';
import { CloudinaryService } from '../../shared/cloudinary/cloudinary.service';

const BLOG_IMAGE_FOLDER = 'blogs';

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);

  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ---------- helpers ----------
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  private async uniqueSlug(title: string, excludeId?: string): Promise<string> {
    const base = this.slugify(title) || 'blog';
    let slug = base;
    let counter = 1;
    while (
      await this.blogModel.exists({
        slug,
        ...(excludeId ? { _id: { $ne: excludeId } } : {}),
      })
    ) {
      slug = `${base}-${counter++}`;
    }
    return slug;
  }

  private calcReadTime(body: string): string {
    const words = body.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  }

  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private assertValidId(id: string): void {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid blog id');
    }
  }

  // Cloudinary se image delete: fail ho to request fail nahi hoti, sirf log hota hai
  private async safeDeleteImage(url?: string | null): Promise<void> {
    if (!url) return;
    try {
      const publicId = this.cloudinaryService.extractPublicId(url);
      if (publicId) await this.cloudinaryService.deleteImage(publicId);
    } catch (error) {
      this.logger.warn(
        `Image cleanup failed for ${url}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private buildFilter(query: QueryBlogDto, isAdmin: boolean): Record<string, unknown> {
    const filter: Record<string, unknown> = {};

    if (!isAdmin) {
      filter.isPublished = true;
    } else if (typeof query.isPublished === 'boolean') {
      filter.isPublished = query.isPublished;
    }

    if (query.category && query.category !== 'All stories') {
      filter.category = query.category;
    }

    const term = query.search?.trim();
    if (term) {
      const regex = new RegExp(this.escapeRegex(term), 'i');
      filter.$or = [
        { title: regex },
        { excerpt: regex },
        { body: regex },
        { country: regex },
        { category: regex },
      ];
    }

    return filter;
  }

  private async paginate(query: QueryBlogDto, isAdmin: boolean): Promise<IPaginatedBlogs> {
    const filter = this.buildFilter(query, isAdmin);
    const page = query.page ?? 1;
    const limit = query.limit ?? 9;

    const [data, total] = await Promise.all([
      this.blogModel
        .find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<IBlog[]>()
        .exec(),
      this.blogModel.countDocuments(filter),
    ]);

    return {
      success: true,
      message: 'Blogs fetched successfully',
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  // Ek waqt me sirf ek featured blog
  private async unsetFeatured(exceptId?: string): Promise<void> {
    await this.blogModel.updateMany(
      { isFeatured: true, ...(exceptId ? { _id: { $ne: exceptId } } : {}) },
      { isFeatured: false },
    );
  }

  // ---------- public ----------
  async findPublic(query: QueryBlogDto) {
    try {
      return await this.paginate(query, false);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Failed to fetch blogs', error instanceof Error ? error.stack : String(error));
      throw new InternalServerErrorException('Failed to fetch blogs');
    }
  }

  async findFeatured() {
    try {
      const blog = await this.blogModel
        .findOne({ isPublished: true, isFeatured: true })
        .sort({ publishedAt: -1 })
        .lean<IBlog>()
        .exec();

      return { success: true, message: 'Featured blog fetched successfully', data: blog };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Failed to fetch featured blog', error instanceof Error ? error.stack : String(error));
      throw new InternalServerErrorException('Failed to fetch featured blog');
    }
  }

  async findBySlug(slug: string) {
    try {
      const blog = await this.blogModel
        .findOne({ slug, isPublished: true })
        .lean<IBlog>()
        .exec();
      if (!blog) throw new NotFoundException('Blog not found');

      return { success: true, message: 'Blog fetched successfully', data: blog };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Failed to fetch blog', error instanceof Error ? error.stack : String(error));
      throw new InternalServerErrorException('Failed to fetch blog');
    }
  }

  // ---------- admin ----------
  async findAllAdmin(query: QueryBlogDto) {
    try {
      return await this.paginate(query, true);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Failed to fetch blogs (admin)', error instanceof Error ? error.stack : String(error));
      throw new InternalServerErrorException('Failed to fetch blogs');
    }
  }

  async findById(id: string) {
    try {
      this.assertValidId(id);

      const blog = await this.blogModel.findById(id).lean<IBlog>().exec();
      if (!blog) throw new NotFoundException('Blog not found');

      return { success: true, message: 'Blog fetched successfully', data: blog };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Failed to fetch blog by id', error instanceof Error ? error.stack : String(error));
      throw new InternalServerErrorException('Failed to fetch blog');
    }
  }

  async create(dto: CreateBlogDto, file?: Express.Multer.File) {
    let uploadedUrl: string | undefined;

    try {
      if (!file) throw new BadRequestException('Blog image is required');

      const upload = await this.cloudinaryService.uploadImageWebP(
        file.buffer,
        BLOG_IMAGE_FOLDER,
      );
      uploadedUrl = upload.secure_url;

      const slug = await this.uniqueSlug(dto.title);

      if (dto.isFeatured) await this.unsetFeatured();

      const blog = await this.blogModel.create({
        ...dto,
        image: uploadedUrl,
        slug,
        readTime: this.calcReadTime(dto.body),
        publishedAt: dto.isPublished ? new Date() : null,
      });

      return {
        success: true,
        message: 'Blog created successfully',
        data: blog.toObject(),
      };
    } catch (error) {
      // DB fail hua to Cloudinary par faltu image na reh jaye
      await this.safeDeleteImage(uploadedUrl);

      if (error instanceof HttpException) throw error;
      this.logger.error('Failed to create blog', error instanceof Error ? error.stack : String(error));
      throw new InternalServerErrorException('Failed to create blog');
    }
  }

  async update(id: string, dto: UpdateBlogDto, file?: Express.Multer.File) {
    let newImageUrl: string | undefined;

    try {
      this.assertValidId(id);

      const existing = await this.blogModel.findById(id);
      if (!existing) throw new NotFoundException('Blog not found');

      const oldImageUrl = existing.image;
      const payload: Partial<Blog> = { ...dto };

      if (file) {
        const upload = await this.cloudinaryService.uploadImageWebP(
          file.buffer,
          BLOG_IMAGE_FOLDER,
        );
        newImageUrl = upload.secure_url;
        payload.image = newImageUrl;
      }

      if (dto.title && dto.title !== existing.title) {
        payload.slug = await this.uniqueSlug(dto.title, id);
      }
      if (dto.body) payload.readTime = this.calcReadTime(dto.body);
      if (dto.isPublished === true && !existing.publishedAt) {
        payload.publishedAt = new Date();
      }
      if (dto.isFeatured) await this.unsetFeatured(id);

      const updated = await this.blogModel
        .findByIdAndUpdate(id, payload, { new: true })
        .lean<IBlog>()
        .exec();

      // Update kamyab hua, ab purani image hata dein
      if (newImageUrl) await this.safeDeleteImage(oldImageUrl);

      return { success: true, message: 'Blog updated successfully', data: updated };
    } catch (error) {
      // Update fail hua to nayi upload hui image hata dein
      await this.safeDeleteImage(newImageUrl);

      if (error instanceof HttpException) throw error;
      this.logger.error('Failed to update blog', error instanceof Error ? error.stack : String(error));
      throw new InternalServerErrorException('Failed to update blog');
    }
  }

  async togglePublish(id: string) {
    try {
      this.assertValidId(id);

      const blog = await this.blogModel.findById(id);
      if (!blog) throw new NotFoundException('Blog not found');

      blog.isPublished = !blog.isPublished;
      if (blog.isPublished && !blog.publishedAt) blog.publishedAt = new Date();
      await blog.save();

      return {
        success: true,
        message: `Blog ${blog.isPublished ? 'published' : 'unpublished'} successfully`,
        data: blog.toObject(),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Failed to toggle publish', error instanceof Error ? error.stack : String(error));
      throw new InternalServerErrorException('Failed to update publish status');
    }
  }

  async toggleFeatured(id: string) {
    try {
      this.assertValidId(id);

      const blog = await this.blogModel.findById(id);
      if (!blog) throw new NotFoundException('Blog not found');

      if (!blog.isFeatured) await this.unsetFeatured(id);
      blog.isFeatured = !blog.isFeatured;
      await blog.save();

      return {
        success: true,
        message: `Blog ${blog.isFeatured ? 'marked' : 'unmarked'} as featured`,
        data: blog.toObject(),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Failed to toggle featured', error instanceof Error ? error.stack : String(error));
      throw new InternalServerErrorException('Failed to update featured status');
    }
  }

  async remove(id: string) {
    try {
      this.assertValidId(id);

      const deleted = await this.blogModel.findByIdAndDelete(id);
      if (!deleted) throw new NotFoundException('Blog not found');

      await this.safeDeleteImage(deleted.image);

      return { success: true, message: 'Blog deleted successfully', data: null };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Failed to delete blog', error instanceof Error ? error.stack : String(error));
      throw new InternalServerErrorException('Failed to delete blog');
    }
  }
}