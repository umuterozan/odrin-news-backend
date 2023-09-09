import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express"
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWTFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ]),
      secretOrKey: 'refresh-token-secret-20e82a5045f43e8b67db01fbc77c146dc6b63b6e8f8c294cdc387562a034b51a',
      passReqToCallback: true,
    })
  }

  private static extractJWTFromCookie(req: Request) {
    if (req.cookies && req.cookies.refreshToken) {
      return req.cookies.refreshToken;
    }
    return null;
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.cookies.refreshToken;
    return {
      ...payload,
      refreshToken,
    }
  }
}