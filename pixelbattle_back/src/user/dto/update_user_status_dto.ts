import { IsEnum } from "class-validator";
import { UserStatus } from "../types";

export class UpdateUserStatusDTO {
  @IsEnum(UserStatus)
  public newStatus: UserStatus;
}