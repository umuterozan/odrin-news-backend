import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access-token-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'access-token-secret-455c4e0b3caed066908b318076bd4c6477aaca722784a407df3007f2a961412f',
    })
  }

  async validate(payload: any) {
    return payload;
  }
}