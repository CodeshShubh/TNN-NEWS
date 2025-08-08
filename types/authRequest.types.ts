import {Request} from 'express';


export interface jwtPayload {
    id:string,
    role:string,
}

export interface AuthRequest extends Request{
    user?:jwtPayload,
    userCategory?:string[]
}