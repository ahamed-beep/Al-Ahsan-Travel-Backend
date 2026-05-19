// interfaces/flight-deal.interface.ts

export interface IFlightDealResponse {
  _id: string;
  airline: string;
  from: string;
  to: string;
  duration: string;
  price: string;
  image: string;
  badge?: string;
  isPopular: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IServiceResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  total: number;
  page: number;
  limit: number;
}