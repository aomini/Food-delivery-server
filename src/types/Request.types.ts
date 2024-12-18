import { FastifyReply, FastifyRequest } from "fastify";

// @todo do with a decorator
export type Controller<
  Req extends FastifyRequest = FastifyRequest,
  Res = FastifyReply,
  ReturnType = void
> = (
  req: Req,
  res: Res
) => ReturnType extends void
  ? Promise<void> | void
  : Promise<ReturnType> | ReturnType;
