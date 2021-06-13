import { ApiProperty } from '@nestjs/swagger';
export class PaginationDto {
  @ApiProperty({
		description: 'Page'
	})
  page: number;

  @ApiProperty({
		description: 'Offset'
	})
  offset: number;

  @ApiProperty({
		description: 'Limit'
	})
  limit: number;

  @ApiProperty({
		description: 'Request Type'
	})
  request_type: string;

  @ApiProperty({
		description: 'Order By'
	})
  order_by: string;

  @ApiProperty({
		description: 'Search'
	})
  search: any;
}
