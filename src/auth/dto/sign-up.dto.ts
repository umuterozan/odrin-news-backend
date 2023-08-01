import { IsNotEmpty, IsString, IsEmail, Length } from "class-validator";

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Length(3, 50)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  password: string;
}