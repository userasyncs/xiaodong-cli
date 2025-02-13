import { Command } from "commander";
import { version } from "../package.json";
import { create } from "./command/create";
import { update } from "./command/update";

const program = new Command("xiaodong");

program.version(version, "-v, --version");

program
  .command("update")
  .description("更新脚手架")
  .action(() => {
    update();
  });

// 创建项目
program
  .command("create")
  .description("新建一个项目")
  .argument("[name]", "项目名称")
  .action((projectName) => {
    create(projectName);
    // console.log("create project: ", name);
  });

program.parse();
