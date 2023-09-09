import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { Request } from "express";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access-token-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        AccessTokenStrategy.extractJWTFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ]),
      secretOrKey: 'access-token-secret-455c4e0b3caed066908b318076bd4c6477aaca722784a407df3007f2a961412f',
    })
  }

  private static extractJWTFromCookie(req: Request) {
    if (req.cookies && req.cookies.accessToken) {
      return req.cookies.accessToken;
    }
    return null;
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}