// interfaces/contact.interface.ts

export interface IContactResponse {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  travelDate?: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  repliedAt?: Date;
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