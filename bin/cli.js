#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 1. 定义配置：目标路径改为相对于用户当前工作目录 (process.cwd())
const TARGET_ROOT = process.cwd();

const TEMPLATE_CONFIG = {
  'CLAUDE.md': '.claude/CLAUDE.md',        // 自动创建 .claude 目录
  'PROJECT.md': '.memory-bank/PROJECT.md', // 自动创建 .memory-bank 目录
  'MODULES.md': '.memory-bank/MODULES.md',
  'TASK.md': '.memory-bank/TASK.md'
};

// 解析参数
const args = process.argv.slice(2);
const forceOverwrite = args.includes('--force') || args.includes('-f');
const skipExisting = args.includes('--skip-existing') || args.includes('-s');

// 2. 核心工具函数
function extractTemplate(content, templateName) {
  const beginMarker = `<!-- BEGIN: ${templateName} -->`;
  const endMarker = `<!-- END: ${templateName} -->`;
  const beginIndex = content.indexOf(beginMarker);
  const endIndex = content.indexOf(endMarker);

  if (beginIndex === -1 || endIndex === -1 || endIndex <= beginIndex) return null;

  const startPos = beginIndex + beginMarker.length;
  return content.substring(startPos, endIndex).replace(/^\n+/, '').replace(/\n+$/, '') + '\n';
}

// ─── 生成提示词 ───────────────────────────────────────────────────────────────

function generatePrompt(templateContent) {
  const today = new Date().toISOString().slice(0, 10);
  const projectTemplate = extractTemplate(templateContent, 'PROJECT.md');
  const modulesTemplate = extractTemplate(templateContent, 'MODULES.md');

  return `# Memory Bank 填充提示词
> 生成时间：${today}
> 将以下内容粘贴给 AI，让它分析当前项目并填写文档。

---

## 你的任务

分析当前项目，根据项目的实际情况，填写以下两份文档：

1. **PROJECT.md** — 技术规范文档
2. **MODULES.md** — 功能模块清单

**要求**：
- 输出纯 Markdown，不要用代码块包裹整个文档
- 所有占位符（方括号内的文字）必须替换为真实内容
- 无法推断的信息填写"待补充"
- 文档底部更新日期填写：${today}
- 先输出 PROJECT.md 的完整内容，再输出 MODULES.md 的完整内容
- 两份文档之间用 \`---\` 分隔

---

## PROJECT.md 模板

${projectTemplate}
---

## MODULES.md 模板

${modulesTemplate}
---

请开始生成。
`;
}

// ─── 主流程 ──────────────────────────────────────────────────────────────────

function init() {
  // 3. 关键修改：从库的安装位置读取模板，而不是当前目录
  const templatePath = path.join(__dirname, '../templates/template.md');

  if (!fs.existsSync(templatePath)) {
    console.error('❌ Internal Error: Template file not found at', templatePath);
    process.exit(1);
  }

  console.log('🚀 Initializing AI Memory Bank...\n');
  const templateContent = fs.readFileSync(templatePath, 'utf-8');

  for (const [name, relPath] of Object.entries(TEMPLATE_CONFIG)) {
    // 目标绝对路径
    const targetPath = path.join(TARGET_ROOT, relPath);
    const targetDir = path.dirname(targetPath);

    // 确保目录存在
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // 检查文件是否已存在
    if (fs.existsSync(targetPath)) {
      if (skipExisting) {
        console.log(`⏭️  Skipped (exists): ${relPath}`);
        continue;
      }
      if (!forceOverwrite) {
        console.log(`⚠️  Skipped (exists): ${relPath} (use --force to overwrite)`);
        continue;
      }
    }

    // 提取并写入
    const content = extractTemplate(templateContent, name);
    if (content) {
      fs.writeFileSync(targetPath, content, 'utf-8');
      console.log(`✅ Created: ${relPath}`);
    } else {
      console.warn(`⚠️  Template not found: ${name}`);
    }
  }

  // 生成 AI 填充提示词
  const mbDir = path.join(TARGET_ROOT, '.memory-bank');
  if (!fs.existsSync(mbDir)) {
    fs.mkdirSync(mbDir, { recursive: true });
  }
  fs.writeFileSync(path.join(mbDir, 'ANALYZE_PROMPT.md'), generatePrompt(templateContent), 'utf-8');

  console.log('\n✨ Done! Memory Bank is ready.');
  console.log('─'.repeat(60));
  console.log('📋 下一步：让 AI 帮你填写文档');
  console.log('  1. 打开 .memory-bank/ANALYZE_PROMPT.md');
  console.log('  2. 复制全部内容，粘贴给任意 AI');
  console.log('     （Claude / ChatGPT / Gemini 均可）');
  console.log('  3. 将 AI 输出分别粘贴到：');
  console.log('     - .memory-bank/PROJECT.md');
  console.log('     - .memory-bank/MODULES.md');
  console.log('─'.repeat(60));
}

init();
