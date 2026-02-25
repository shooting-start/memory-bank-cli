# 发布 npm 包

## 步骤

**1. 检查未提交的更改**

运行 `git status`，如果存在未提交的更改：
- 展示给用户看
- 根据改动内容自行总结 commit message（遵循 conventional commits 格式）
- 执行 `git add -A && git commit -m "<message>"`

**2. 确认版本升级类型**

询问用户选择：
- `patch` — 修复 bug（1.0.0 → 1.0.1）
- `minor` — 新功能（1.0.0 → 1.1.0）
- `major` — 破坏性变更（1.0.0 → 2.0.0）

**3. 执行发布流程**

按顺序执行：
```bash
npm version <patch|minor|major>
git push
npm publish --access public
```

**4. 完成后输出**

告知用户新版本号和发布结果。
