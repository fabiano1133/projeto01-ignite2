import http from "node:http";
import { randomUUID } from "node:crypto";

const users = [];

const server = http.createServer((request, response) => {
  const { method, url } = request;

  const sequence_id = randomUUID();

  if (method === "POST" && url === "/users") {
    let data = "";

    request.on("data", (chunk) => {
      data += chunk;
    });

    request.on("end", () => {
      const user = JSON.parse(data);
      if (user.name === "" || user.name === undefined) {
        response.writeHead(400);
        response.end();
        return;
      }

      users.push({ ...user, id: sequence_id });
      response.writeHead(201);
      response.end();
    });
  }

  if (method === "GET" && url === "/users") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(users));
  }
});

server.listen(3333, () => console.log("Server is running"));
