import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 1500)
  text: string;

  @IsNotEmpty()
  @IsNumber()
  postId: number;
}