# 🚀 Epic Linux Rice - Hyprland + Catppuccin Setup

A beautiful, modern Linux desktop environment featuring Hyprland, Catppuccin Macchiato theme, and amazing TUI applications.

![Theme](https://img.shields.io/badge/Theme-Catppuccin%20Macchiato-blue)
![WM](https://img.shields.io/badge/WM-Hyprland-purple)
![Terminal](https://img.shields.io/badge/Terminal-Ghostty-green)
![Shell](https://img.shields.io/badge/Shell-Fish-orange)

## 📸 Screenshots

*Add your screenshots here after applying the configuration*

## 🎨 Theme & Colors

This setup uses the **Catppuccin Macchiato** color palette for a consistent, beautiful appearance across all applications:

- **Base**: `#24273a` - Main background
- **Text**: `#cad3f5` - Primary text color  
- **Blue**: `#8aadf4` - Accent color
- **Green**: `#a6da95` - Success/active states
- **Yellow**: `#eed49f` - Warnings/highlights
- **Red**: `#ed8796` - Errors/critical states

## 🏗️ Core Components

### Window Manager
- **Hyprland** - Modern Wayland compositor with animations
- **Waybar** - Customized status bar with Catppuccin theme
- **SWWW** - Wallpaper daemon for smooth transitions

### Terminal & Shell
- **Ghostty** - GPU-accelerated terminal emulator
- **Fish** - User-friendly shell with autocompletion
- **Starship** - Beautiful, fast prompt with git integration

### Applications
- **Wofi** - Modern application launcher
- **Yazi** - Feature-rich TUI file manager
- **Mako** - Lightweight notification daemon
- **Firefox** - Web browser
- **Rofi** - Additional menus (screenshot, search)

### Security & Session
- **Hyprlock** - Beautiful lock screen with blur effects
- **Hypridle** - Intelligent idle management

## 📦 Installation

### Prerequisites

Make sure you have these installed:
```bash
# Essential packages
sudo pacman -S hyprland waybar fish chezmoi git

# AUR helper (if not already installed)
sudo pacman -S --needed base-devel git
git clone https://aur.archlinux.org/paru.git
cd paru && makepkg -si
```

### Core Applications
```bash
# Terminal and shell tools
paru -S ghostty-git starship

# File management and utilities  
paru -S yazi ffmpegthumbnailer unarchiver jq poppler fd ripgrep fzf zoxide

# Wayland tools
paru -S mako wofi hyprlock hypridle swww

# System utilities
paru -S brightnessctl playerctl pavucontrol nm-applet
```

### TUI Programs
```bash
# System monitoring and development
paru -S btop lazygit neofetch

# File utilities
paru -S bat eza lsd

# Entertainment
paru -S cava tty-clock cmatrix pipes.sh
```

### Apply Configuration
```bash
# Clone and apply dotfiles
chezmoi init --apply https://github.com/yourusername/dotfiles
# OR if already using chezmoi:
chezmoi apply
```

## ⌨️ Keybindings

### Window Management
| Key Combination | Action |
|-----------------|--------|
| `Super + Return` | Open terminal (Ghostty) |
| `Super + Q` | Close active window |
| `Super + M` | Exit Hyprland |
| `Super + V` | Toggle floating mode |
| `Super + F` | Toggle fullscreen |
| `Super + P` | Toggle pseudo-tiling |
| `Super + J` | Toggle split direction |

### Applications
| Key Combination | Action |
|-----------------|--------|
| `Super + D` | Open application launcher (Wofi) |
| `Super + E` | Open file manager (Yazi) |
| `Super + W` | Open web browser |
| `Super + S` | Screenshot menu |
| `Super + G` | DuckDuckGo search menu |

### Navigation
| Key Combination | Action |
|-----------------|--------|
| `Super + Arrow Keys` | Move focus between windows |
| `Super + 1-9` | Switch to workspace 1-9 |
| `Super + Shift + 1-9` | Move window to workspace 1-9 |
| `Super + Mouse Wheel` | Switch workspaces |

### System Controls
| Key Combination | Action |
|-----------------|--------|
| `XF86AudioRaiseVolume` | Increase volume |
| `XF86AudioLowerVolume` | Decrease volume |
| `XF86AudioMute` | Toggle mute |
| `XF86MonBrightnessUp` | Increase brightness |
| `XF86MonBrightnessDown` | Decrease brightness |
| `XF86AudioPlay` | Play/pause media |
| `XF86AudioNext/Prev` | Next/previous track |

## 🛠️ TUI Applications Guide

### 💻 Development-Focused Hotkeys & Aliases

Since you're a TypeScript developer, here are the most useful commands and aliases configured in your setup:

#### **Git Workflow (Lazygit + Aliases)**
```bash
# Quick git operations
gcommit "feat: add new feature"  # Add all + commit with message
gpush                           # Push to current branch
gpull                           # Pull from current branch
gundo                          # Undo last commit (soft reset)
gcan                           # Amend last commit without editing message
gpf                            # Force push with lease (safer)

# Branch management
gcb feature/new-feature        # Create and checkout new branch
gm main                        # Merge main into current branch
gri HEAD~3                     # Interactive rebase last 3 commits

# Stash operations
gst                            # Stash current changes
gstp                           # Pop last stash
gstl                           # List all stashes
```

#### **Node.js/TypeScript Development**
```bash
# npm shortcuts
nr dev                         # npm run dev
nr build                       # npm run build
nr test                        # npm run test
nrtw                          # npm run test:watch
nrl                           # npm run lint
nrlf                          # npm run lint:fix

# Project creation
create-ts-project my-app       # Create new TypeScript project
create-react-ts my-react-app   # Create React + TypeScript
create-next-ts my-next-app     # Create Next.js + TypeScript
create-vite-ts my-vite-app     # Create Vite + TypeScript

# Development utilities
kill-port 3000                # Kill process on port 3000
port-check 3000               # Check what's running on port 3000
serve 8080                    # Quick HTTP server on port 8080
ts-run script.ts              # Run TypeScript file directly
```

#### **Alternative Package Managers**
```bash
# Yarn
yr dev                        # yarn run dev
ya @types/node               # yarn add @types/node
yad eslint                   # yarn add --dev eslint

# pnpm (faster alternative)
pr dev                       # pnpm run dev
pa typescript               # pnpm add typescript
pad @types/react            # pnpm add --dev @types/react

# Bun (fastest alternative)
br dev                       # bun run dev
ba typescript               # bun add typescript
bx create-react-app my-app  # bunx create-react-app my-app
```

#### **File Management with Yazi**
```bash
# Development-specific Yazi usage
yazi ~/projects              # Open projects directory
yazi node_modules           # Browse dependencies
yazi dist                   # Check build output

# In Yazi:
# 'e' - Edit file in default editor
# 'o' - Open with specific application
# ';' - Run shell command in current directory
# 's' - Open shell in current directory
```

## 🛠️ TUI Applications Guide

### 📁 Yazi (File Manager)
```bash
yazi                    # Launch file manager
yazi /path/to/dir       # Open specific directory
```

**Essential Navigation:**
- `h/j/k/l` or `←/↓/↑/→` - Navigate (vim-style or arrows)
- `Enter` - Open file/directory
- `Backspace` or `H` - Go to parent directory
- `~` - Go to home directory
- `g` - Go to top, `G` - Go to bottom
- `gg` - Go to first file, `G` - Go to last file
- `{` / `}` - Jump to previous/next sibling directory

**File Operations:**
- `Space` - Select/deselect file
- `v` - Visual mode (select multiple)
- `V` - Visual mode (select all in view)
- `Ctrl+a` - Select all files
- `Ctrl+r` - Reverse selection
- `y` - Copy (yank), `x` - Cut, `p` - Paste
- `d` - Delete, `D` - Delete permanently
- `r` - Rename current file
- `a` - Create new file
- `A` - Create new directory
- `;` - Run shell command
- `z` - Toggle hidden files
- `.` - Toggle hidden files
- `s` - Open shell in current directory

**Search & Filter:**
- `/` - Search files
- `n` - Next search result, `N` - Previous
- `f` - Filter files (show only matching)
- `F` - Smart filter
- `Ctrl+s` - Cancel search/filter

**Preview & View:**
- `i` - Toggle preview pane
- `I` - Toggle preview pane (full)
- `Tab` - Switch between panes
- `t` - New tab, `T` - Close tab
- `1-9` - Switch to tab 1-9
- `[` / `]` - Switch to previous/next tab

**Bookmarks & Quick Access:**
- `m` - Create bookmark
- `'` - Jump to bookmark
- `"` - Jump to bookmark (interactive)

**Advanced:**
- `o` - Open with (choose application)
- `O` - Open with (interactive)
- `e` - Open in editor
- `w` - Open task manager
- `?` - Show help
- `q` - Quit

### 📊 Btop (System Monitor)
```bash
btop                    # Launch system monitor
```
**Controls:**
- `q` - Quit
- `+/-` - Increase/decrease update speed
- `m` - Toggle memory view
- `n` - Toggle network view
- `p` - Toggle process view

### 🌟 Lazygit (Git Interface)
```bash
lazygit                 # Launch in git repository
lazygit -p /path/to/repo # Launch in specific repository
```

**Panel Navigation:**
- `Tab` / `Shift+Tab` - Switch between panels
- `1-5` - Jump to specific panel (Files, Branches, Commits, etc.)
- `h/j/k/l` - Navigate within panels
- `q` - Quit

**File Operations:**
- `Space` - Stage/unstage files
- `a` - Stage all files
- `A` - Stage all files including new ones
- `d` - View diff
- `D` - View diff options
- `e` - Edit file
- `o` - Open file
- `i` - Ignore file (add to .gitignore)
- `r` - Refresh
- `s` - Stash files
- `M` - Resolve merge conflicts

**Commit Operations:**
- `c` - Commit staged files
- `C` - Commit using git editor
- `Shift+A` - Amend last commit
- `Shift+R` - Reword last commit
- `Ctrl+j` - Move commit down
- `Ctrl+k` - Move commit up

**Branch Operations:**
- `Space` - Checkout branch
- `n` - New branch
- `b` - Create branch from selected commit
- `d` - Delete branch
- `r` - Rebase branch
- `M` - Merge branch
- `f` - Fast-forward branch
- `g` - Reset to selected commit

**Remote Operations:**
- `p` - Pull
- `P` - Push
- `Shift+P` - Push with force
- `f` - Fetch
- `F` - Fetch all remotes

**Advanced:**
- `x` - View command options
- `z` - Undo last action
- `Ctrl+z` - Redo
- `W` - Open diff menu
- `@` - Open command log
- `?` - Show help

### 🦇 Bat (File Viewer)
```bash
bat filename            # View file with syntax highlighting
bat -A filename         # Show all characters including whitespace
```

### 📋 Eza (Modern ls)
```bash
eza                     # List files
eza -la                 # List all files with details
eza --tree              # Tree view
eza --icons             # Show icons
```

### 🎵 Cava (Audio Visualizer)
```bash
cava                    # Launch audio visualizer
```
**Controls:**
- `q` - Quit
- `r` - Reload config
- `c` - Cycle through color schemes

### ⏰ Tty-clock
```bash
tty-clock               # Simple clock
tty-clock -c            # Centered clock
tty-clock -s            # Enable seconds
tty-clock -D            # Enable date
```

### 🌈 Fun Commands
```bash
cmatrix                 # Matrix rain effect
pipes.sh                # Animated pipes
neofetch                # System information with ASCII art
```

## 🎨 Customization

### Changing Wallpapers
```bash
# Add wallpapers to ~/Wallpapers/
swww img ~/Wallpapers/your-wallpaper.jpg

# Edit startup wallpaper in:
# ~/.config/hypr/start.sh
```

### Modifying Colors
Edit the Catppuccin color variables in:
- `~/.config/waybar/style.css`
- `~/.config/ghostty/config`
- `~/.config/mako/config`
- `~/.config/wofi/style.css`

### Adding Custom Keybindings
Edit `~/.config/hypr/hyprland.conf`:
```bash
bind = $mainMod, KEY, exec, COMMAND
```

## 🔧 Configuration Files

```
~/.config/
├── hypr/
│   ├── hyprland.conf      # Main Hyprland configuration
│   ├── hyprlock.conf      # Lock screen settings
│   └── start.sh           # Startup script
├── waybar/
│   ├── config.jsonc       # Waybar modules and layout
│   └── style.css          # Waybar styling
├── ghostty/
│   └── config             # Terminal configuration
├── yazi/
│   ├── yazi.toml          # File manager settings
│   └── theme.toml         # File manager theme
├── mako/
│   └── config             # Notification settings
├── wofi/
│   ├── config             # Launcher settings
│   └── style.css          # Launcher styling
├── hypridle/
│   └── hypridle.conf      # Idle management
└── starship.toml          # Shell prompt configuration
```

## 🚨 Troubleshooting

### Common Issues

**Ghostty not starting:**
```bash
# Check if installed correctly
which ghostty
# Try running from terminal to see errors
ghostty
```

**Waybar not showing:**
```bash
# Restart waybar
killall waybar && waybar &
# Check for errors
waybar -l debug
```

**Notifications not working:**
```bash
# Test mako
notify-send "Test" "This is a test notification"
# Restart mako
killall mako && mako &
```

**Yazi not showing icons:**
```bash
# Install a Nerd Font
paru -S ttf-firacode-nerd
# Update font cache
fc-cache -fv
```

### Performance Issues

**High CPU usage:**
- Reduce waybar update intervals in `config.jsonc`
- Disable blur effects in Hyprland if needed
- Lower animation speeds

**Memory usage:**
- Reduce Yazi cache size in `yazi.toml`
- Limit btop update frequency

## 🤝 Contributing

Feel free to:
- Report issues
- Suggest improvements
- Share your customizations
- Submit pull requests

## 📝 License

This configuration is released under the MIT License. Feel free to use, modify, and share!

## 🙏 Credits

- **Catppuccin** - Amazing color palette
- **Hyprland** - Incredible Wayland compositor
- **All the amazing developers** of the tools used in this setup

## 🚀 **Development Workflow Integration**

Your setup is now optimized for TypeScript development with:

### **Integrated Development Environment**
- **Ghostty** - Fast terminal with GPU acceleration
- **Yazi** - File manager with syntax highlighting preview
- **Lazygit** - Visual git interface
- **Starship** - Git-aware prompt showing branch/status
- **Fish** - Smart autocompletion for npm/git commands

### **Quick Development Commands**
```bash
# Start new project workflow
create-ts-project my-api      # → cd my-api → npm run dev
create-react-ts my-frontend   # → cd my-frontend → npm start
create-next-ts my-fullstack   # → cd my-fullstack → npm run dev

# Daily development workflow
yazi ~/projects              # Browse projects
cd my-project && lg          # Open lazygit for git operations
nr dev                       # Start development server
code .                       # Open in VS Code
```

### **Productivity Features**
- **Auto-completion** for all npm/yarn/pnpm commands
- **Git branch** visible in prompt
- **Smart directory jumping** with `z` (zoxide)
- **Syntax highlighting** for code preview in Yazi
- **Integrated terminal** workflows

### **Performance Optimizations**
- **GPU-accelerated** terminal rendering
- **Fast file search** with ripgrep/fd
- **Efficient git operations** with lazygit
- **Quick package management** with multiple package manager support

This setup provides a modern, efficient development environment perfectly suited for TypeScript/JavaScript development! 🔥

---

**Enjoy your epic Linux rice! 🚀**

*For questions or support, feel free to open an issue or reach out!*