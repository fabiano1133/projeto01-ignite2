import { Readable } from "node:stream";
import { randomUUID } from "node:crypto";

class GenerateTenRandomPass extends Readable {
  pass = [];

  _read() {
    const newPass = randomUUID();

    setTimeout(() => {
      if (this.pass.length < 10) {
        const buffer = Buffer.from(newPass);
        this.push(buffer);
        this.pass.push(newPass);
      } else {
        this.push(null);
      }
    }, 2000);
  }
}

fetch("http://localhost:3131", {
  method: "POST",
  body: new GenerateTenRandomPass(),
  duplex: "half",
})
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    console.log(data);
  });
