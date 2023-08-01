import { Controller, Post, Body } from '@nestjs/common';
import { SignUpDto, SignInDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() dto: SignUpDto) {
    await this.authService.signUp(dto);
    return {
      success: true,
    }
  }

  @Post('signin')
  async signIn(@Body() dto: SignInDto) {
    return await this.authService.signIn(dto);
  }

  @Post('logout')
  async logout() {
    this.authService.logout();
  }

  @Post('refresh')
  async refreshTokens() {
    this.authService.refreshTokens();
  }
}
