import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { SignUpDto, SignInDto } from './dto';
import { AuthService } from './auth.service';
import { AccessTokenGuard, RefreshTokenGuard } from 'src/common/guards';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() dto: SignUpDto) {
    const user = await this.authService.signUp(dto);
    if (user) return {
      message: 'successful',
    }
  }

  @Post('signin')
  async signIn(@Body() dto: SignInDto) {
    return await this.authService.signIn(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout-current')
  async logoutCurrent(@GetCurrentUser('sessionId') sessionId: number) {
    return await this.authService.logoutCurrent(sessionId);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout-all')
  async logoutAll(@GetCurrentUser('sub') userId: number) {
    return await this.authService.logoutAll(userId)
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(@GetCurrentUser('sessionId') sessionId: number, @GetCurrentUser('refreshToken') refreshToken: string) {
    return await this.authService.refreshTokens(sessionId, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Get('verify-token')
  async verifyToken() {
    return true;
  }
}
