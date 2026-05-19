// flight-deals.service.ts

import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FlightDeal, FlightDealDocument } from './entities/flight-deal.entity';
import {
  CreateFlightDealDto,
  UpdateFlightDealDto,
  FilterFlightDealDto,
} from './dto/flight-deal.dto';
import {
  IServiceResponse,
  IPaginatedResponse,
  IFlightDealResponse,
} from './interfaces/flight-deal.interface';

@Injectable()
export class FlightDealsService {
  constructor(
    @InjectModel(FlightDeal.name)
    private readonly flightDealModel: Model<FlightDealDocument>,
  ) {}

  async create(
    dto: CreateFlightDealDto,
  ): Promise<IServiceResponse<IFlightDealResponse>> {
    try {
      const created = await this.flightDealModel.create({ ...dto });
      return {
        success: true,
        message: 'Flight deal created successfully',
        data: created.toObject() as unknown as IFlightDealResponse,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Failed to create flight deal: ${message}`,
      );
    }
  }

  async findAll(
    filters: FilterFlightDealDto,
  ): Promise<IPaginatedResponse<IFlightDealResponse>> {
    try {
      const { from, to, isActive, isPopular, page = 1, limit = 10 } = filters;
      const query: Record<string, unknown> = {};

      if (from) query.from = { $regex: new RegExp(from, 'i') };
      if (to) query.to = { $regex: new RegExp(to, 'i') };
      if (isActive !== undefined) query.isActive = isActive;
      if (isPopular !== undefined) query.isPopular = isPopular;

      const skip = (page - 1) * limit;

      const [deals, total] = await Promise.all([
        this.flightDealModel
          .find(query)
          .skip(skip)
          .limit(limit)
          .sort({ isPopular: -1, createdAt: -1 })
          .lean()
          .exec(),
        this.flightDealModel.countDocuments(query).exec(),
      ]);

      return {
        success: true,
        message: 'Flight deals fetched successfully',
        data: deals as unknown as IFlightDealResponse[],
        total,
        page,
        limit,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Failed to fetch flight deals: ${message}`,
      );
    }
  }

  async findOne(
    id: string,
  ): Promise<IServiceResponse<IFlightDealResponse>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid flight deal ID: ${id}`);
      }

      const deal = await this.flightDealModel.findById(id).lean().exec();

      if (!deal) {
        throw new NotFoundException(`Flight deal with ID '${id}' not found`);
      }

      return {
        success: true,
        message: 'Flight deal fetched successfully',
        data: deal as unknown as IFlightDealResponse,
      };
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Failed to fetch flight deal: ${message}`,
      );
    }
  }

  async update(
    id: string,
    dto: UpdateFlightDealDto,
  ): Promise<IServiceResponse<IFlightDealResponse>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid flight deal ID: ${id}`);
      }

      const updated = await this.flightDealModel
        .findByIdAndUpdate(
          id,
          { $set: { ...dto } },
          { new: true, runValidators: true },
        )
        .lean()
        .exec();

      if (!updated) {
        throw new NotFoundException(`Flight deal with ID '${id}' not found`);
      }

      return {
        success: true,
        message: 'Flight deal updated successfully',
        data: updated as unknown as IFlightDealResponse,
      };
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Failed to update flight deal: ${message}`,
      );
    }
  }

  async remove(id: string): Promise<IServiceResponse<null>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid flight deal ID: ${id}`);
      }

      const deleted = await this.flightDealModel
        .findByIdAndDelete(id)
        .lean()
        .exec();

      if (!deleted) {
        throw new NotFoundException(`Flight deal with ID '${id}' not found`);
      }

      return {
        success: true,
        message: 'Flight deal deleted successfully',
        data: null,
      };
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Failed to delete flight deal: ${message}`,
      );
    }
  }

  async toggleActive(
    id: string,
  ): Promise<IServiceResponse<IFlightDealResponse>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid flight deal ID: ${id}`);
      }

      const deal = await this.flightDealModel.findById(id).exec();

      if (!deal) {
        throw new NotFoundException(`Flight deal with ID '${id}' not found`);
      }

      deal.isActive = !deal.isActive;
      const saved = await deal.save();

      return {
        success: true,
        message: `Flight deal ${saved.isActive ? 'activated' : 'deactivated'} successfully`,
        data: saved.toObject() as unknown as IFlightDealResponse,
      };
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Failed to toggle flight deal status: ${message}`,
      );
    }
  }

  async togglePopular(
    id: string,
  ): Promise<IServiceResponse<IFlightDealResponse>> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid flight deal ID: ${id}`);
      }

      const deal = await this.flightDealModel.findById(id).exec();

      if (!deal) {
        throw new NotFoundException(`Flight deal with ID '${id}' not found`);
      }

      deal.isPopular = !deal.isPopular;
      const saved = await deal.save();

      return {
        success: true,
        message: `Flight deal ${saved.isPopular ? 'marked as popular' : 'removed from popular'} successfully`,
        data: saved.toObject() as unknown as IFlightDealResponse,
      };
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(
        `Failed to toggle flight deal popular status: ${message}`,
      );
    }
  }
}