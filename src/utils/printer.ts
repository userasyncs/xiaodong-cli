import figlet from "figlet";
import chalk from "chalk";
import { log } from "./log";
export const goodPrinter = (msg: string) => {
  return new Promise((resolve, reject) => {
    figlet.text(msg, (err, data) => {
      if (err) {
        log.error(`figlet Error:${chalk.red(err)}`);
        reject(err);
        return;
      }
      console.log(chalk.rgb(40, 156, 193).visible(data));
      resolve(data);
    });
  });
};
