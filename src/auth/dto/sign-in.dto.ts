import { IsNotEmpty, IsString, Length } from "class-validator";

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  password: string;

  @IsString()
  @Length(1, 300)
  agent: string;
}