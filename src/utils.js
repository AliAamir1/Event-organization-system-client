export const getError = (error) => {
  return error.response.data
    ? error.response.data.message || error.response.data
    : error.message;
};
