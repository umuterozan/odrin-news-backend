import { Controller, Post, Get, Body, UseGuards, Delete, Param } from '@nestjs/common';
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
  @Delete('logout-current')
  async logoutCurrent(@GetCurrentUser('sessionId') sessionId: number) {
    return await this.authService.logoutCurrent(sessionId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('logout-one/:id')
  async logoutOne(@Param('id') sessionId: number, @GetCurrentUser('sub') userId: number) {
    return await this.authService.logoutOne(sessionId, userId)
  }

  @UseGuards(AccessTokenGuard)
  @Delete('logout-all')
  async logoutAll(@GetCurrentUser('sub') userId: number) {
    return await this.authService.logoutAll(userId)
  }

  @UseGuards(AccessTokenGuard)
  @Get('find-sessions')
  async findSessions(@GetCurrentUser('sub') userId: number, @GetCurrentUser('sessionId') sessionId: number) {
    const sessions = await this.authService.findSessions(userId)
    return {
      currentSession: sessionId,
      sessions,
    }
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
