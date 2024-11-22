import { Expose } from "class-transformer";
import { UserResponseDto } from "./user-response.dto";

export class PaginatedUsersResponseDto {
    @Expose()
    data: UserResponseDto[];
  
    @Expose()
    meta: {
      total: number;
      page: number;
      size: number;
      totalPages: number;
      hasMore: boolean;
    };
  }