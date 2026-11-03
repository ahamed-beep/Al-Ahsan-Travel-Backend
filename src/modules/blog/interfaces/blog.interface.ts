import { BlogCategory } from '../enums/blog-category.enum';

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  category: BlogCategory;
  country: string;
  excerpt: string;
  body: string;
  image: string;
  readTime: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IPaginatedBlogs {
  success: boolean;
  message: string;
  data: IBlog[];
  meta: IPaginationMeta;
}