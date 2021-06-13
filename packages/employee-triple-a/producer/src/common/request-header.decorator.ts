import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { formatErrors } from '@utils/helpers';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export const RequestHeader = createParamDecorator(
  async (value: any, ctx: ExecutionContext) => {
    // extract headers
    const headers = ctx.switchToHttp().getRequest().headers;

    // Convert headers to DTO object
    const dto: any = plainToClass(value, headers);

    // Validate
    const errors = await validate(dto, { whitelist: true });

    if (errors.length > 0) {
      throw new BadRequestException(formatErrors(errors));
    }

    // return header dto object
    return dto;
  },
);
