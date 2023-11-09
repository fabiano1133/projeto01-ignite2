import { Transform } from "node:stream";
import http from "node:http";

const PORT = 3131;

class PasswordTransformToUperCase extends Transform {
  _transform(chunk, encoding, callback) {
    const passwordTransformed = chunk.toString().toUpperCase();

    console.log(passwordTransformed);

    callback(null, passwordTransformed);
  }
}

const server = http.createServer(async (req, res) => {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  const fullContent = Buffer.concat(buffers).toString();

  console.log(fullContent);

  return res.end(fullContent);

  // return req.pipe(new PasswordTransformToUperCase()).pipe(res);
});

server.listen(PORT, () => console.log(`Server started in PORT: ${PORT}`));
