import { Request, Response } from "express";
import { z } from "zod";
function validate(schema: z.ZodObject<any>) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (req: Request, res: Response) {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).send({
          message: "Bad request",
          errors: result.error,
        });
      }
      req.body = result.data;
      return originalMethod.apply(this, [req, res]);
    };
  };
}

export { validate };
