export class Response {
  constructor(statusCode?, message?, result?) {
    this.statusCode = statusCode;
    this.message = message;
    this.result = result;
  }

  statusCode: number;
  message: string;
  result: any;
}
