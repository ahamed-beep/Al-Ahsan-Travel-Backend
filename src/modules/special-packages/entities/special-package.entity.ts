    // entities/special-package.entity.ts

    import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
    import { Document } from 'mongoose';
    import { PackageCategory, StarRating, PackageBadge } from '../enums/special-package.enum';

    export type SpecialPackageDocument = SpecialPackage & Document;

    const numericEnumValues = <T extends Record<string, string | number>>(
    e: T,
    ): number[] => Object.values(e).filter((v): v is number => typeof v === 'number');

    @Schema({ _id: false })
    class HotelInfo {
    @Prop({ required: true, trim: true })
    makkah: string;

    @Prop({ required: true, trim: true })
    madinah: string;
    }

    const HotelInfoSchema = SchemaFactory.createForClass(HotelInfo);

    @Schema({ timestamps: true, collection: 'special_packages' })
    export class SpecialPackage {
    @Prop({
        required: true,
        enum: Object.values(PackageCategory),
        index: true,
    })
    category: PackageCategory;

    @Prop({ required: true, trim: true })
    title: string;

    @Prop({ required: true, enum: numericEnumValues(StarRating) })
    stars: StarRating;

    @Prop({ required: true, min: 1 })
    nights: number;

    @Prop({ required: true, trim: true })
    price: string;

    @Prop({ trim: true })
    originalPrice?: string;

    @Prop({ trim: true })
    discount?: string;

    @Prop({ type: HotelInfoSchema, required: true })
    hotels: HotelInfo;

    @Prop({ type: [String], required: true })
    features: string[];

    @Prop({ required: true })
    image: string;

    @Prop({ enum: Object.values(PackageBadge) })
    badge?: PackageBadge;

    @Prop({ default: false })
    isPopular: boolean;

    @Prop({ default: true, index: true })
    isActive: boolean;
    }

    export const SpecialPackageSchema = SchemaFactory.createForClass(SpecialPackage);

    SpecialPackageSchema.index({ category: 1, isActive: 1 });