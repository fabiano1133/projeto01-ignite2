import { randomUUID } from "node:crypto";
import { Readable, Writable, Transform } from "node:stream";

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
    }, 1000);
  }
}

class PasswordTransformToUperCase extends Transform {
  _transform(chunk, encoding, callback) {
    const passwordTransformed = chunk.toString().toUpperCase();

    callback(null, passwordTransformed);
  }
}

class AddTimestampToGeneratedPassWord extends Writable {
  index = 0;
  _write(chunk, encoding, callback) {
    const passwordResult =
      ` Pass: ${this.index++} ` + chunk + "-" + new Date().getTime();
    console.log(passwordResult);
    callback();
  }
}

new GenerateTenRandomPass()
  .pipe(new PasswordTransformToUperCase())
  .pipe(new AddTimestampToGeneratedPassWord());
