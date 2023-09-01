import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  /*We can then use the GetUser as the decorator meaning @GetUser in the Get('me) Route in user.controller*/
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest(); //can get request or instead of http websockets
    return request.user;
  },
);
