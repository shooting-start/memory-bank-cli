# 发布 npm 包

## 步骤

**1. 检查未提交的更改**

运行 `git status`，如果存在未提交的更改：
- 展示给用户看
- 根据改动内容自行总结 commit message（遵循 conventional commits 格式）
- 执行 `git add -A && git commit -m "<message>"`

**2. 根据改动内容自行判断版本升级类型**

- `patch` — 仅 bug 修复、文字调整、无新功能
- `minor` — 新增功能、向后兼容
- `major` — 破坏性变更、不向后兼容

**3. 执行发布流程**

按顺序执行：
```bash
npm version <patch|minor|major>
git push
```

**4. 将发布命令复制到剪贴板**

npm 发布需要生物验证，执行以下命令将发布命令复制到剪贴板，然后提示用户在 VS Code 终端粘贴并按 Enter：

```bash
echo -n "npm publish --access public" | pbcopy
```
