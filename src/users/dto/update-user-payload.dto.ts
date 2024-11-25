import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateUserDto } from './update-user.dto';

export class UpdateUserPayloadDto {
  @IsString()
  identifier: string;

  @ValidateNested()
  @Type(() => UpdateUserDto)
  data: UpdateUserDto;
}