import { randomUUID } from "node:crypto";
import { readFile, writeFile } from "node:fs";
import { promisify } from "node:util";
import { AppError } from "../../shared/error/AppError.js";

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

export class Database {
  constructor() {
    this.USERS_TABLE = "./src/infra/repositories/tables/users.json";
  }

  async select() {
    try {
      const users = await readFileAsync(this.USERS_TABLE, "utf8");

      return JSON.parse(users);
    } catch (error) {
      throw new AppError(error, 500);
    }
  }

  async selectById(id) {
    try {
      const users = await this.select();

      const userAllreadyExists = users.some((user) => user.id === id);

      if (!userAllreadyExists) throw new Error("User not found");

      return users.find((user) => user.id === id);
    } catch (error) {
      throw new AppError(error.message, 404);
    }
  }

  async delete(id) {
    try {
      const users = await this.select();

      const userAllreadyExists = users.some((user) => user.id === id);

      if (!userAllreadyExists) throw new Error("User not found");

      const usersFiltered = users.filter((user) => user.id !== id);

      await writeFileAsync(this.USERS_TABLE, JSON.stringify(usersFiltered));
    } catch (error) {
      throw new AppError(error.message, 404);
    }
  }

  async update(id, data) {
    try {
      const users = await this.select();

      const userAllreadyExists = users.some((user) => user.id === id);

      if (!userAllreadyExists) throw new Error("User not found");

      const user = users.findIndex((user) => user.id === id);

      users[user] = {
        id,
        ...data,
      };

      await writeFileAsync(this.USERS_TABLE, JSON.stringify(users));
    } catch (error) {
      throw new AppError(error.message, 404);
    }
  }

  async insert(data) {
    try {
      const users = await this.select();
      const id = data.id <= 2 ? data.id : randomUUID();

      const emailAlreadyExists = users.some(
        (user) => user.email === data.email
      );

      if (emailAlreadyExists) throw new Error("Email already exists");

      const user = {
        id,
        ...data,
      };
      const userSaved = [...users, user];

      await writeFileAsync(this.USERS_TABLE, JSON.stringify(userSaved));
    } catch (error) {
      throw new AppError(error.message, 400);
    }
  }
}
