# Agent Guidelines for Chezmoi Dotfiles Repository

## Repository Type
This is a chezmoi dotfiles repository containing personal configuration files for a Linux desktop environment with Hyprland, Kitty, Fish shell, and various utilities.

## Build/Test Commands
- No traditional build/test commands - this is a configuration repository
- Apply changes: `chezmoi apply`
- Preview changes: `chezmoi diff`
- Add new files: `chezmoi add <file>`
- Edit managed files: `chezmoi edit <file>`

## Code Style Guidelines

### Shell Scripts (Bash)
- Use `#!/bin/bash` shebang
- Quote variables: `"$variable"`
- Use descriptive variable names: `encoded_query`, `query`
- Add comments for complex operations

### Configuration Files
- Use consistent indentation (4 spaces for most configs)
- Group related settings with comments
- Use descriptive variable names: `$terminal`, `$browser`, `$fileManager`
- Include inline documentation for complex configurations

### Fish Functions
- Use descriptive function names
- Include `--wraps` and `--description` for aliases
- Keep functions simple and focused

### General Conventions
- No trailing whitespace
- Use lowercase with underscores for file/variable names
- Include helpful comments for non-obvious configurations
- Maintain consistent formatting within each file type