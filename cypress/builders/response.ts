export const withSuccess = <T>(data?: T) => ({
  success: true,
  data,
});

export const withError = (errors: string[]) => ({
  success: false,
  errors,
});
