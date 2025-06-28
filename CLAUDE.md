# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Type
This is a chezmoi dotfiles repository for a Linux desktop environment featuring Hyprland (Wayland compositor), Catppuccin Macchiato theming, and modern TUI applications. It contains personal configuration files managed by chezmoi.

## Essential Commands

### Chezmoi Management
- `chezmoi apply` - Apply configuration changes to the system
- `chezmoi diff` - Preview changes before applying
- `chezmoi add <file>` - Add new files to be managed by chezmoi
- `chezmoi edit <file>` - Edit managed configuration files
- `cz` / `cza` / `czd` / `cze` - Fish shell aliases for chezmoi commands

### Development Environment
- `code .` or `c` - Open current directory in VS Code
- `lg` - Launch lazygit for Git operations
- `yazi` - Open file manager with syntax highlighting
- `btop` - System monitor (replaces htop)

### TypeScript/Node.js Development
- `nr <script>` - npm run shortcut (e.g., `nr dev`, `nr build`, `nr test`)
- `create-ts-project <name>` - Create new TypeScript project with proper setup
- `create-react-ts <name>` - Create React + TypeScript project
- `create-next-ts <name>` - Create Next.js + TypeScript project
- `create-vite-ts <name>` - Create Vite + TypeScript project
- `kill-port <port>` - Kill process running on specific port
- `ts-run <file.ts>` - Run TypeScript file directly

## Architecture & Structure

### File Naming Convention
- `dot_` prefix indicates dotfiles (e.g., `dot_bashrc` → `~/.bashrc`)
- `private_` prefix for files requiring special handling
- Configuration files are organized by application in `dot_config/`

### Key Configuration Areas

**Shell Environment:**
- Fish shell with extensive TypeScript/Node.js aliases in `dot_config/private_fish/config.fish`
- Starship prompt with Catppuccin theming in `dot_config/starship.toml`
- Modern command replacements: `eza` (ls), `bat` (cat), `rg` (grep), `fd` (find)

**Desktop Environment:**
- Hyprland configuration in `dot_config/hypr/hyprland.conf`
- Waybar status bar configuration in `dot_config/waybar/`
- Terminal: Ghostty with GPU acceleration

**Development Tools:**
- File manager: Yazi with syntax highlighting
- Git interface: Lazygit with visual operations
- System monitor: btop for performance monitoring

**Automation Scripts:**
- Waifu wallpaper system with rotation, favorites, and multiple sources
- Menu scripts for application launching and system controls
- All scripts located in `dot_config/scripts/` and `dot_config/wofi/`

### Development Workflow Integration
The setup includes extensive aliases and functions for:
- Git operations (extensive git aliases with `g` prefix)
- Package managers: npm, yarn, pnpm, bun with consistent aliases
- Project creation templates for TypeScript/React/Next.js/Vite
- Port management and development server utilities

## Code Style Guidelines

**Shell Scripts (Bash):**
- Use `#!/bin/bash` shebang
- Quote variables: `"$variable"`
- Use descriptive variable names
- Include comments for complex operations

**Fish Functions:**
- Use descriptive function names
- Include `--wraps` and `--description` for aliases
- Keep functions simple and focused

**Configuration Files:**
- Use consistent indentation (4 spaces for most configs)
- Group related settings with comments
- Use descriptive variable names in configs
- Maintain consistent formatting within each file type

## Important Notes
- No traditional build/test commands - this is a configuration repository
- System uses Catppuccin Macchiato color scheme consistently
- All package manager commands have unified aliases (nr/yr/pr/br for run commands)
- Extensive TypeScript development workflow integration
- Auto-applies Hyprland on login from tty1