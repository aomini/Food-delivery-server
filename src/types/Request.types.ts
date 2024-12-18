import { FastifyReply, FastifyRequest } from "fastify";

// @todo do with a decorator
export type Controller<
  Req extends FastifyRequest = FastifyRequest,
  Res = FastifyReply,
  ReturnType = Promise<void>
> = (req: Req, res: Res) => ReturnType;
