import { memoryStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { BadRequestException } from '@nestjs/common';

export const multerImageOptions: MulterOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new BadRequestException(
          'Only JPG, PNG, and WebP images are allowed',
        ),
        false,
      );
    }
  },
};