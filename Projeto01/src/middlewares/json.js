export const json = async (request, response, next) => {
  const buffers = [];

  for await (const chunk of request) {
    buffers.push(chunk);
  }
  try {
    request.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch (error) {
    request.body = {};
  }
  response.setHeader("Content-Type", "application/json");
};