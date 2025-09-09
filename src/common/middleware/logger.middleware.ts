import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.originalUrl}`);

    // Example: If you want JWT check globally
    if (req.originalUrl.startsWith('/auth')) {
      return next(); // Skip for login/register routes
    }

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new HttpException('Missing Authorization header', HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      (req as any).user = decoded; 
      console.log(decoded);// attach user info to request
      next();
    } catch (err) {
      console.log("dd");
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
