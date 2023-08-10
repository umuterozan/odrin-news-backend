import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreatePostDto {
  @IsString()
  thumbnail: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 150)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 7000)
  body: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}