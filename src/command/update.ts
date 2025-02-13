import chalk from "chalk";
import ora from "ora";
import { exec } from "child_process";

const spinner = ora({
  text: "xiaodong-cli 正在更新...",
  spinner: {
    interval: 300,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"].map((frame) => chalk.green(frame)),
  },
});

export const update = () => {
  spinner.start();
  exec("npm i xiaodong-cli@latest -g", (err) => {
    spinner.stop();
    if (err) {
      console.log(chalk.red("更新失败：", err));
    } else {
      console.log(chalk.green("更新成功!"));
    }
  });
};
