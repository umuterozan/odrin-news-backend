import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto, SignInDto } from './dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SessionsService } from 'src/sessions/sessions.service';
import { ITokens } from './interfaces/tokens.interface';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private sessionsService: SessionsService,
  ) {}

  async signUp(dto: SignUpDto) {
    dto.password = await this.hashData(dto.password);
    return await this.usersService.create(dto);
  }

  async signIn(dto: SignInDto) {
    const user = await this.usersService.findOne({ username: dto.username });
    if (!user) throw new UnauthorizedException('User does not exist');
    const matched = await bcrypt.compare(dto.password, user.password);
    if (!matched) throw new UnauthorizedException('Password incorrect');

    const session = await this.sessionsService.create(dto.agent, user);
    const tokens = await this.generateTokens(user.id, user.username, user.isAdmin, session.id);
    const hash = await this.hashData(this.sha256(tokens.refreshToken))
    await this.sessionsService.updateRtHash(session.id, hash)

    return tokens;
  }

  async logoutCurrent(sessionId: number) {
    return await this.sessionsService.deleteOneById(sessionId)
  }

  async logoutAll(userId: number) {
    return await this.sessionsService.deleteAllByUserId(userId)
  }

  async generateTokens(userId: number, username: string, isAdmin: boolean, sessionId: number): Promise<ITokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          isAdmin,
          sessionId,
        },
        {
          secret:
            'access-token-secret-455c4e0b3caed066908b318076bd4c6477aaca722784a407df3007f2a961412f',
          expiresIn: 60 * 30,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          isAdmin,
          sessionId,
        },
        {
          secret:
            'refresh-token-secret-20e82a5045f43e8b67db01fbc77c146dc6b63b6e8f8c294cdc387562a034b51a',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    }
  }

  async refreshTokens(sessionId: number, refreshToken: string) {
    const session = await this.sessionsService.findOne({ id: sessionId });
    if (!session) throw new ForbiddenException('Session does not exist');    
    const user = await this.usersService.findOne({ sessions: { id: sessionId }})
    if (!user) throw new ForbiddenException('User does not exist');
    const matched = await bcrypt.compare(this.sha256(refreshToken), session.hash);
    if (!matched) throw new ForbiddenException('Tokens does not match');

    const tokens = await this.generateTokens(user.id, user.username, user.isAdmin, session.id);
    const hash = await this.hashData(this.sha256(tokens.refreshToken))
    await this.sessionsService.updateRtHash(session.id, hash)

    return tokens;
  }

  async hashData(data: string) {
    return await bcrypt.hash(data, 10);
  }

  sha256(data: string) {
    return createHash('sha256').update(data).digest('hex');
  }
}
