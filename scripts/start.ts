/* tslint:disable:no-console */

import * as program from "../node_modules/commander";

import { ChildProcessManager } from "./child-process-manager";
import * as spawn from "cross-spawn";
//const https = require('https');

const children = new ChildProcessManager();

function serve(buildTarget: string, cb) {
  const target = process.env["TARGET"] || "development";
  const aot = process.env["AOT"] || "false";
  const prod = target !== "development";
  const c = {
    cmd: "ng",
    args: [
      "serve",
      buildTarget,
      //'--progress=true',
      "--prod=" + prod,
      "--configuration=" + buildTarget,
      "--aot=" + aot,
      "--port",
      "9101"
    ]
  };

  console.log(`Serving: ${JSON.stringify(c.args.slice(1))}`);
  const child = spawn.spawn(c.cmd, c.args);
  children.register(child);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  child.on("exit", code => {
    cb(code);
  });
}

/*function getCredentials(password: string, username: string, url: string) {
  const uri = `${url}/oauth/token`;
  https.post('', (resp) => {

  })
}*/
program
  .version("0.0.1")
  .option("-t, --target <env>", "Build Target (angular-cli environment)")
  //.option('-ct, --cf-token <token>', 'UAA Token for Cloud Foundry')
  //.option('-cu --cf-user <user>', 'Cloud Foundry User')
  //.option('-cp --cf-password <password>', 'Cloud Foundry Passwords')
  //.option('-uu --uaa-url <uaa>', 'The Url of the UAA')
  .parse(process.argv);

serve(program["target"], code => {
  process.exit(code);
});
