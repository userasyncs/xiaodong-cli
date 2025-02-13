import path from "path";
import fs from "fs-extra";
import { input, select } from "@inquirer/prompts";
import axios, { AxiosResponse } from "axios";
import { gt } from "lodash";
import { clone } from "../utils/clone";
import { name, version } from "../../package.json";
import chalk from "chalk";

interface Template {
  name: string;
  downloadUrl: string;
  description: string;
  branch: string;
}

const templates: Map<string, Template> = new Map([
  [
    "Vite-Vue3-TypeScript-Pinia-Element-Plus-Template",
    {
      name: "Vite-Vue3-TypeScript-Pinia-Element-Plus-Template",
      downloadUrl: "https://gitee.com/sohucw/admin-pro",
      description: "Vue3通用的后台管理系统模版",
      branch: "dev11",
    },
  ],
  [
    "Vite-Vue3-TypeScript-Pinia-Element-Plus-Temp",
    {
      name: "Vite-Vue3-TypeScript-Pinia-Element-Plus-Temp",
      downloadUrl: "https://gitee.com/sohucw/admin-pro",
      description: "Vue3通用的后台管理系统模版",
      branch: "dev11",
    },
  ],
]);

// 文件夹存在时询问是否覆盖
const isOverWirte = async (projectName: string) => {
  console.warn(`文件夹${projectName}已存在`);
  try {
    return await select({
      message: "请选择是否覆盖？",
      choices: [
        {
          name: "是",
          value: true,
        },
        {
          name: "否",
          value: false,
        },
      ],
    });
  } catch (error) {
    return false;
  }
};

// 获取npm信息
const getNpmInfo = async (name: string) => {
  const npmUrl = "https://registry.npmjs.org/" + name;
  let res = {
    data: "",
  };
  try {
    res = await axios.get(npmUrl);
  } catch (error) {
    console.error("获取npm信息失败:", error);
  }
  return res;
};

// 获取脚手架在npm上的版本
const getNpmLatestVersion = async (name: string) => {
  const { data } = (await getNpmInfo(name)) as AxiosResponse;
  let version = "";
  if (data) {
    version = data["dist-tags"].latest;
  } else {
    version = "0.0.1";
  }
  return version;
};

// 检查脚手架版本
const checkVersion = async (name: string, version: string) => {
  const latestVersion = await getNpmLatestVersion(name);
  const needUpdate = gt(latestVersion, version);
  if (needUpdate) {
    console.log(
      `检测到 xiaodong-cli 最新版本为 ${chalk.blueBright(
        latestVersion
      )}, 当前版本为 ${chalk.blueBright(version)}`
    );
    console.log(`请执行 ${chalk.yellow("npm install -g xiaodong@latest")} 进行更新`);
  }
  return needUpdate;
};

export const create = async (projectName?: string) => {
  // 检查版本
  await checkVersion(name, version);
  const templateList = Array.from(templates).map((item: [string, Template]) => {
    const [name, info] = item;
    return {
      name: name,
      value: name,
      description: info.description,
    };
  });

  if (!projectName) {
    try {
      projectName = await input({
        message: "请输入项目名称",
      });
    } catch (e) {}
  }
  if (!projectName) {
    console.error("项目名称不能为空");
    return;
  }

  // 检查文件夹是否存在
  const projectPath = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(projectPath)) {
    const run = await isOverWirte(projectName);
    // 覆盖
    if (run) {
      // 删除文件夹
      await fs.remove(projectPath);
    } else {
      // 取消
      return;
    }
  }

  // 选择模板
  let templateName = "";
  try {
    templateName = await select({
      message: "请选择一个模板",
      choices: templateList,
    });
  } catch (error) {}
  if (!templateName) {
    console.error("请选择一个模板");
    return;
  }

  const templateInfo = templates.get(templateName);

  if (templateInfo) {
    clone(templateInfo.downloadUrl, projectName, ["-b", `${templateInfo.branch}`]);
  }
  // console.log("projectName: ", projectName);
};
