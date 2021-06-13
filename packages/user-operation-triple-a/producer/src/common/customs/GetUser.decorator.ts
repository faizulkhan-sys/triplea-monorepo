import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/* istanbul ignore file */

export const /**
	 *
	 *
	 * @param {unknown} data
	 * @param {ExecutionContext} ctx
	 * @return {*}
	 */

	GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
		return ctx.switchToHttp().getRequest().user;
	});
