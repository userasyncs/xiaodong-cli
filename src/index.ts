import { Command } from "commander";
import { version } from "../package.json";
import { create } from "./command/create";

const program = new Command("xiaodong");

program.version(version, "-v, --version");

program
  .command("create")
  .description("新建一个项目")
  .argument("[name]", "项目名称")
  .action((projectName) => {
    create(projectName);
    // console.log("create project: ", name);
  });

program.parse();
