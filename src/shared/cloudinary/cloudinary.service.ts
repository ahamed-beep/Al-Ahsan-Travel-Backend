import {
  Injectable,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { CLOUDINARY } from './cloudinary.provider';
import sharp = require('sharp');

@Injectable()
export class CloudinaryService {
  constructor(@Inject(CLOUDINARY) private readonly _cloudinary: typeof cloudinary) {}

  async uploadImageWebP(
    fileBuffer: Buffer,
    folder: string,
    publicId?: string,
  ): Promise<UploadApiResponse> {
    try {
      const webpBuffer = await sharp(fileBuffer)
        .webp({ quality: 85 })
        .toBuffer();

      return await this.uploadBuffer(webpBuffer, folder, publicId, 'webp');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        `Cloudinary WebP upload failed: ${message}`,
      );
    }
  }

  private uploadBuffer(
    buffer: Buffer,
    folder: string,
    publicId?: string,
    format?: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadOptions: Record<string, unknown> = {
        folder,
        resource_type: 'image',
        format: format ?? 'webp',
      };

      if (publicId) {
        uploadOptions.public_id = publicId;
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error || !result) {
            return reject(
              new InternalServerErrorException(
                `Upload stream error: ${error?.message ?? 'Unknown error'}`,
              ),
            );
          }
          resolve(result);
        },
      );

      uploadStream.end(buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        `Cloudinary delete failed: ${message}`,
      );
    }
  }

  extractPublicId(url: string): string {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    const startIndex =
      uploadIndex + 2 < parts.length &&
      /^v\d+$/.test(parts[uploadIndex + 1])
        ? uploadIndex + 2
        : uploadIndex + 1;

    const withExt = parts.slice(startIndex).join('/');
    return withExt.replace(/\.[^/.]+$/, '');
  }
}