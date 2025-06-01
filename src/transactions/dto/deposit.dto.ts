import { IsInt, Min } from "class-validator"

export class DepositDto {
  @IsInt()
  toUserId: number

  @IsInt()
  @Min(0.01)
  value: number
}
