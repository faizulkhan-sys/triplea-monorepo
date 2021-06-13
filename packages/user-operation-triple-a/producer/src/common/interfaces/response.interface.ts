export interface IResponse {
  statusCode: number;
  message: string;
}

export interface response {
	statusCode: string | number;
	message: string;
}
export interface Ipagination {
	total_pages: number;
	total_items: number;
	next: string;
	previous: string;
	current_page: number;
	items: any;
}