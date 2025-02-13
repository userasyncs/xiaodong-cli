import { simpleGit } from "simple-git";
import type { SimpleGit, SimpleGitOptions } from "simple-git";
import Logger from "progress-estimator";
import chalk from "chalk";

chalk.level = 2; // 颜色深度
const gitOptions: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(), // 根目录
  binary: "git", //  git命令
  maxConcurrentProcesses: 6, // 最大并发数
  trimmed: false,
};

// 初始化进度条
const logger = Logger({
  spinner: {
    interval: 300,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"].map((frame) => chalk.green(frame)),
  },
});

export const clone = async (downloadUrl: string, projectName: string, options: string[]) => {
  const git: SimpleGit = simpleGit(gitOptions);
  try {
    // 克隆代码
    await logger(git.clone(downloadUrl, projectName, options), "代码下载中...", {
      estimate: 10000, // 预估代码下载时间
    });

    // 相关提示
    console.log();
    console.log(chalk.blueBright(`==================================`));
    console.log(chalk.blueBright(`=== 欢迎使用 xiaodong-cli 脚手架 ===`));
    console.log(chalk.blueBright(`==================================`));
    console.log();
    console.log();
    console.info(`${chalk.blue(projectName)} 项目创建成功`);
    console.log("执行以下命令运行项目：");
    console.info(`  ${chalk.green(`cd ${projectName}`)}`);
    console.info(`  ${chalk.green(`pnpm install`)}`);
    console.info(`  ${chalk.green(`pnpm run dev`)}`);
  } catch (error) {
    console.log("下载代码失败：", chalk.red(error));
  }
};
