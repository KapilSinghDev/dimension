import authenticationService from "@/service/authentication.service";
import { redis } from "../../lib/redis";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { UserTokenPayload } from "@/controllers/authentication.controller";

const LIMIT = 5;
const WINDOW = 10;

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("rate limiter active");
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const auth = new authenticationService();

    const decodeToken = jwt.verify(token, auth.SECRET_KEY) as UserTokenPayload;

    const windowKey = Math.floor(Date.now() / (WINDOW * 1000));
    const key = `rate_limit:${decodeToken.user_email}:${windowKey}`;

    const currentCount = await redis.incr(key);
    if (currentCount === 1) {
      await redis.expire(key, WINDOW);
    }

    const remaining = Math.max(0, LIMIT - currentCount);

    res.setHeader("X-RateLimit-Limit", LIMIT);
    res.setHeader("X-RateLimit-Remaining", remaining);

    if (currentCount > LIMIT) {
      console.log("user limited is ", decodeToken.user_email);
      return res.status(429).json({
        error: "Too many requests. Please slow down.",
      });
    }

    next();
  } catch (error) {
    // Catches jwt verification errors (invalid signature, expired token, etc.)
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid or expired token" });
  }
};
