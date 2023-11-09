import { Database } from "../repositories/database.js";
import { buildRoutePath } from "../../utils/build-route-path.js";

export const UserRoutes = [
  {
    method: "GET",
    path: buildRoutePath("/users"),
    handler: async (request, response) => {
      try {
        const database = new Database();

        const users = await database.select();

        response.end(JSON.stringify(users));
      } catch (error) {
        response.writeHead(error.statusCode).end(JSON.stringify(error));
      }
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/users/:id"),
    handler: async (request, response) => {
      try {
        const database = new Database();

        const { id } = request.params;

        const users = await database.selectById(id);

        response.end(JSON.stringify(users));
      } catch (error) {
        response.writeHead(error.statusCode).end(JSON.stringify(error));
      }
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/users/:id"),
    handler: async (request, response) => {
      try {
        const database = new Database();

        const { id } = request.params;

        await database.delete(id);

        response.writeHead(204).end();
      } catch (error) {
        response.writeHead(error.statusCode).end(JSON.stringify(error));
      }
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/users/:id"),
    handler: async (request, response) => {
      try {
        const database = new Database();

        const { id } = request.params;

        const { name, lastname, email, age, course } = request.body;

        await database.update(id, { name, lastname, email, age, course });

        response.writeHead(200).end();
      } catch (error) {
        response.writeHead(error.statusCode).end(JSON.stringify(error));
      }
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/users"),
    handler: async (request, response) => {
      try {
        const { name, lastname, email, age, course } = request.body;

        const database = new Database();

        await database.insert({
          name,
          lastname,
          email,
          age,
          course,
        });

        return response.writeHead(201).end();
      } catch (error) {
        response.writeHead(error.statusCode).end(JSON.stringify(error));
      }
    },
  },
];
