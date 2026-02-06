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
  let extracted = content.substring(startPos, endIndex);
  return extracted.replace(/^\n+/, '').replace(/\n+$/, '') + '\n';
}

function init() {
  // 3. 关键修改：从库的安装位置读取模板，而不是当前目录
  const templatePath = path.join(__dirname, '../templates/template.md');

  if (!fs.existsSync(templatePath)) {
    console.error('❌ Internal Error: Template file not found at', templatePath);
    process.exit(1);
  }

  console.log('🚀 Initializing AI Memory Bank...\n');
  const templateContent = fs.readFileSync(templatePath, 'utf-8');
  let successCount = 0;

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
      successCount++;
    } else {
      console.warn(`⚠️  Template not found: ${name}`);
    }
  }

  console.log('\n✨ Done! Memory Bank is ready.');
  if (successCount > 0) {
    console.log('👉 Tip: Ask Claude to "Read MODULES.md" to get started.');
  }
}

init();
