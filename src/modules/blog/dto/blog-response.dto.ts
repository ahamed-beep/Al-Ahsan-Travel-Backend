import { Expose, Transform } from 'class-transformer';
import { BlogCategory } from '../enums/blog-category.enum';

export class BlogResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id?.toString())
  id: string;

  @Expose() title: string;
  @Expose() slug: string;
  @Expose() category: BlogCategory;
  @Expose() country: string;
  @Expose() excerpt: string;
  @Expose() body: string;
  @Expose() image: string;
  @Expose() readTime: string;
  @Expose() isPublished: boolean;
  @Expose() isFeatured: boolean;
  @Expose() publishedAt: Date | null;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}