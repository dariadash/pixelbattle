import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { UserStatus } from "../types";

export class UpdateUserStatusDTO {
  @ApiProperty({ enum: UserStatus, example: UserStatus.REGULAR })
  @IsEnum(UserStatus)
  public newStatus: UserStatus;
}
