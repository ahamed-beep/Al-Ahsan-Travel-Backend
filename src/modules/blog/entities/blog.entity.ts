import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BlogCategory } from '../enums/blog-category.enum';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ timestamps: true, collection: 'blogs' })
export class Blog {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true, enum: BlogCategory, index: true })
  category: BlogCategory;

  @Prop({ required: true, trim: true })
  country: string;

  @Prop({ required: true, trim: true })
  excerpt: string;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true })
  image: string;

  @Prop({ default: '1 min read' })
  readTime: string;

  @Prop({ default: false, index: true })
  isPublished: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ type: Date, default: null })
  publishedAt: Date | null;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.index({ title: 'text', excerpt: 'text', body: 'text', country: 'text' });