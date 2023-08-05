import { Controller, Post, Body, Req } from '@nestjs/common';
import { SignUpDto, SignInDto } from './dto';
import { AuthService } from './auth.service';
import { Request } from 'express';

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

  @Post('logout-current')
  async logoutCurrent(@Req() req: Request) {
    const user = req.user
    return await this.authService.logoutCurrent(user['sessionId']);
  }

  @Post('logout-all')
  async logoutAll(@Req() req: Request) {
    const user = req.user
    return await this.authService.logoutAll(user['sub'])
  }

  @Post('refresh')
  async refreshTokens(@Req() req: Request) {
    const user = req.user
    return await this.authService.refreshTokens(user['sessionId'], user['refreshToken']);
  }
}
