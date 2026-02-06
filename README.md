# AI Memory Bank Init

Use this tool to initialize a robust "Memory Bank" context management structure for your AI-assisted projects (Claude, Cursor, etc.).

## What is a Memory Bank?

It's a standardized set of markdown files that help AI coding assistants maintain context, follow project rules, and remember lessons learned.

- **.claude/CLAUDE.md**: The "operating system" for the AI, defining rules and behaviors.
- **.memory-bank/PROJECT.md**: Technical constraints, architectural decisions, and lessons learned.
- **.memory-bank/MODULES.md**: Current feature status and known issues (backlog).
- **.memory-bank/TASK.md**: Scratchpad for complex task planning.

## Usage

Run this command in the root of your project:

```bash
npx @pcqxh/memory-bank
```

This will create the `.claude` and `.memory-bank` directories with the initial templates.

### Options

- `--force`, `-f`: Overwrite existing files.
- `--skip-existing`, `-s`: Skip files that already exist.

## Workflow

1. **Initialize**: Run the command.
2. **Populate**: Ask Claude to "Analyze this project and fill in PROJECT.md and MODULES.md".
3. **Maintain**:
    - Update `MODULES.md` when features are completed.
    - Update `PROJECT.md` when you learn a new "lesson" or change the tech stack.
