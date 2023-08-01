import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto, SignInDto } from './dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SessionsService } from 'src/sessions/sessions.service';
import { ITokens } from './interfaces/tokens.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private sessionsService: SessionsService,
  ) {}

  async signUp(dto: SignUpDto) {
    dto.password = await this.hashData(dto.password);
    return this.usersService.create(dto);
  }

  async signIn(dto: SignInDto) {
    const user = await this.usersService.findOne({ username: dto.username });
    if (!user) throw new UnauthorizedException('User does not exist');
    const matched = await bcrypt.compare(dto.password, user.password);
    if (!matched) throw new UnauthorizedException('Password incorrect');

    const tokens = await this.generateTokens(user.id);
    const session = await this.sessionsService.create(dto.agent, tokens.refreshToken, user);
    return {
      tokens,
      session: {
        id: session.id,
      },
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      }
    }
  }

  logout() {}

  async generateTokens(userId: number): Promise<ITokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
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

  refreshTokens() {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
}
