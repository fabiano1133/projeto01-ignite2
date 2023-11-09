import http from "node:http";
import { json } from "./middlewares/json.js";
import { UserRoutes } from "../src/infra/routes/user-routes.js";

const server = http.createServer(async (request, response) => {
  const { method, url } = request;

  await json(request, response);

  const userRouter = UserRoutes.find((router) => {
    return router.method === method && router.path.test(url);
  });

  if (userRouter) {
    const routeParams = request.url.match(userRouter.path);
    request.params = { ...routeParams.groups };

    return userRouter.handler(request, response);
  }

  response.writeHead(404).end();
});

server.listen(3333, () => console.log("Server is running"));
