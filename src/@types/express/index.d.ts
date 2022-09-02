declare namespace Express{
    import { JwtPayload } from "jsonwebtoken"
    interface Request{
        JWT: any
        JWTLogged: JwtPayload
        JWTCodeLogged: JwtPayload
    }
}