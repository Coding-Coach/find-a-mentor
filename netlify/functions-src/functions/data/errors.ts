export class DataError extends Error {
  constructor(public statusCode: number, public message: string =  `Date Error: ${statusCode}`) {
    super(message);
  }
}
