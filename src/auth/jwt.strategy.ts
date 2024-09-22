import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthJwtPayload } from "./types/auth-Jwtpayload.dto";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'mySecret',
        });
    }

    async validate(payload: AuthJwtPayload) {
        return { 
            userId: payload.sub,
            username: payload.username,
            email: payload.email,
            picture: payload.picture,
            role: payload.role
        };
    }
}