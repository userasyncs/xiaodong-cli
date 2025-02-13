import path from "path";
import fs from "fs-extra";
import { input, select } from "@inquirer/prompts";
import { clone } from "../utils/clone";

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
};

export const create = async (projectName?: string) => {
  const templateList = Array.from(templates).map((item: [string, Template]) => {
    const [name, info] = item;
    return {
      name: name,
      value: name,
      description: info.description,
    };
  });

  if (!projectName) {
    projectName = await input({
      message: "请输入项目名称",
    });
  }

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

  const templateName = await select({
    message: "请选择一个模板",
    choices: templateList,
  });

  const templateInfo = templates.get(templateName);

  if (templateInfo) {
    clone(templateInfo.downloadUrl, projectName, ["-b", `${templateInfo.branch}`]);
  }
  console.log("projectName: ", projectName);
};
