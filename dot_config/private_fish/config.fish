# Fish shell configuration

# Initialize starship prompt
starship init fish | source

# Initialize zoxide (smart cd)
zoxide init fish | source

# Set default editor
set -gx EDITOR nvim

# Set PATH additions
fish_add_path ~/.local/bin
fish_add_path ~/.cargo/bin

# Aliases for modern tools
alias ls='eza --icons --group-directories-first'
alias ll='eza -la --icons --group-directories-first'
alias la='eza -la --icons --group-directories-first'
alias tree='eza --tree --icons'
alias cat='bat'
alias grep='rg'
alias find='fd'
alias cd='z'

# Git aliases - Essential for TypeScript development
alias g='git'
alias ga='git add'
alias gaa='git add .'
alias gc='git commit'
alias gcm='git commit -m'
alias gca='git commit --amend'
alias gcan='git commit --amend --no-edit'
alias gp='git push'
alias gpo='git push origin'
alias gpf='git push --force-with-lease'
alias gl='git pull'
alias glo='git pull origin'
alias gs='git status'
alias gss='git status --short'
alias gd='git diff'
alias gdc='git diff --cached'
alias gds='git diff --staged'
alias gb='git branch'
alias gba='git branch -a'
alias gbd='git branch -d'
alias gco='git checkout'
alias gcb='git checkout -b'
alias gm='git merge'
alias gr='git rebase'
alias gri='git rebase -i'
alias grc='git rebase --continue'
alias gra='git rebase --abort'
alias gst='git stash'
alias gstp='git stash pop'
alias gstl='git stash list'
alias glog='git log --oneline --graph --decorate'
alias gloga='git log --oneline --graph --decorate --all'
alias gundo='git reset HEAD~1'
alias greset='git reset --hard'
alias gclean='git clean -fd'
alias lg='lazygit'

# System aliases
alias top='btop'
alias htop='btop'
alias vim='nvim'
alias vi='nvim'
alias code='code .'
alias c='code .'

# TypeScript/Node.js Development aliases
alias ni='npm install'
alias nid='npm install --save-dev'
alias nig='npm install -g'
alias nr='npm run'
alias nrs='npm run start'
alias nrd='npm run dev'
alias nrb='npm run build'
alias nrt='npm run test'
alias nrtw='npm run test:watch'
alias nrl='npm run lint'
alias nrlf='npm run lint:fix'
alias nrc='npm run clean'
alias nrp='npm run preview'
alias ns='npm start'
alias nt='npm test'
alias nb='npm run build'
alias nci='npm ci'
alias ncl='npm run clean'
alias nls='npm list'
alias nout='npm outdated'
alias nup='npm update'

# Yarn aliases (alternative to npm)
alias y='yarn'
alias ya='yarn add'
alias yad='yarn add --dev'
alias yag='yarn global add'
alias yr='yarn run'
alias ys='yarn start'
alias yd='yarn dev'
alias yb='yarn build'
alias yt='yarn test'
alias ytw='yarn test --watch'
alias yl='yarn lint'
alias ylf='yarn lint --fix'
alias yi='yarn install'
alias yup='yarn upgrade'
alias yout='yarn outdated'

# pnpm aliases (fast package manager)
alias p='pnpm'
alias pi='pnpm install'
alias pa='pnpm add'
alias pad='pnpm add --save-dev'
alias pr='pnpm run'
alias prs='pnpm run start'
alias prd='pnpm run dev'
alias prb='pnpm run build'
alias prt='pnpm run test'
alias prl='pnpm run lint'
alias ps='pnpm start'
alias pt='pnpm test'
alias pb='pnpm build'
alias pup='pnpm update'

# Bun aliases (fast runtime and package manager)
alias b='bun'
alias bi='bun install'
alias ba='bun add'
alias bad='bun add --dev'
alias br='bun run'
alias brs='bun run start'
alias brd='bun run dev'
alias brb='bun run build'
alias brt='bun run test'
alias bs='bun start'
alias bt='bun test'
alias bb='bun build'
alias bup='bun update'
alias bx='bunx'

# Quick navigation
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'

# Chezmoi aliases
alias cz='chezmoi'
alias cza='chezmoi apply'
alias czd='chezmoi diff'
alias cze='chezmoi edit'

# Fun commands
alias matrix='cmatrix'
alias pipes='pipes.sh'
alias clock='tty-clock -c'

# Waifu wallpaper commands
alias waifu='~/.config/scripts/waifu-wallpaper.sh'
alias waifu-start='~/.config/scripts/waifu-rotator.sh start'
alias waifu-stop='~/.config/scripts/waifu-rotator.sh stop'
alias waifu-now='~/.config/scripts/waifu-rotator.sh now'

# Disable greeting
set fish_greeting

# Enable vi mode
fish_vi_key_bindings

# Custom functions for development
function mkcd
    mkdir -p $argv[1] && cd $argv[1]
end

# Create a new TypeScript project
function create-ts-project
    if test (count $argv) -eq 0
        echo "Usage: create-ts-project <project-name>"
        return 1
    end
    
    set project_name $argv[1]
    mkdir -p $project_name
    cd $project_name
    
    # Initialize npm project
    npm init -y
    
    # Install TypeScript and essential dev dependencies
    npm install -D typescript @types/node ts-node nodemon
    
    # Create tsconfig.json
    npx tsc --init
    
    # Create basic project structure
    mkdir -p src tests
    echo 'console.log("Hello, TypeScript!");' > src/index.ts
    
    # Create basic package.json scripts
    npm pkg set scripts.start="node dist/index.js"
    npm pkg set scripts.dev="ts-node src/index.ts"
    npm pkg set scripts.build="tsc"
    npm pkg set scripts.watch="tsc --watch"
    npm pkg set scripts.dev:watch="nodemon --exec ts-node src/index.ts"
    
    echo "TypeScript project '$project_name' created successfully!"
    echo "Run 'npm run dev' to start development"
end

# Create a new React TypeScript project
function create-react-ts
    if test (count $argv) -eq 0
        echo "Usage: create-react-ts <project-name>"
        return 1
    end
    
    npx create-react-app $argv[1] --template typescript
    cd $argv[1]
    echo "React TypeScript project created! Run 'npm start' to begin."
end

# Create a new Next.js TypeScript project
function create-next-ts
    if test (count $argv) -eq 0
        echo "Usage: create-next-ts <project-name>"
        return 1
    end
    
    npx create-next-app@latest $argv[1] --typescript --tailwind --eslint --app
    cd $argv[1]
    echo "Next.js TypeScript project created! Run 'npm run dev' to start."
end

# Create a new Vite TypeScript project
function create-vite-ts
    if test (count $argv) -eq 0
        echo "Usage: create-vite-ts <project-name>"
        return 1
    end
    
    npm create vite@latest $argv[1] -- --template vanilla-ts
    cd $argv[1]
    npm install
    echo "Vite TypeScript project created! Run 'npm run dev' to start."
end

# Quick git commit with message
function gcommit
    if test (count $argv) -eq 0
        echo "Usage: gcommit <commit-message>"
        return 1
    end
    
    git add .
    git commit -m "$argv"
end

# Quick git push to current branch
function gpush
    set current_branch (git branch --show-current)
    git push origin $current_branch
end

# Quick git pull from current branch
function gpull
    set current_branch (git branch --show-current)
    git pull origin $current_branch
end

# Find and kill process by port
function kill-port
    if test (count $argv) -eq 0
        echo "Usage: kill-port <port-number>"
        return 1
    end
    
    set pid (lsof -ti:$argv[1])
    if test -n "$pid"
        kill -9 $pid
        echo "Killed process on port $argv[1]"
    else
        echo "No process found on port $argv[1]"
    end
end

# Quick server for current directory
function serve
    set port 8000
    if test (count $argv) -gt 0
        set port $argv[1]
    end
    
    echo "Serving current directory on http://localhost:$port"
    python -m http.server $port
end

# Open current directory in VS Code
function code-here
    code .
end

# Quick npm package search
function npm-search
    if test (count $argv) -eq 0
        echo "Usage: npm-search <package-name>"
        return 1
    end
    
    npm search $argv[1]
end

# Check if port is in use
function port-check
    if test (count $argv) -eq 0
        echo "Usage: port-check <port-number>"
        return 1
    end
    
    lsof -i:$argv[1]
end

# Quick TypeScript compilation and run
function ts-run
    if test (count $argv) -eq 0
        echo "Usage: ts-run <file.ts>"
        return 1
    end
    
    ts-node $argv[1]
end

function extract
    switch $argv[1]
        case '*.tar.bz2'
            tar xjf $argv[1]
        case '*.tar.gz'
            tar xzf $argv[1]
        case '*.bz2'
            bunzip2 $argv[1]
        case '*.rar'
            unrar x $argv[1]
        case '*.gz'
            gunzip $argv[1]
        case '*.tar'
            tar xf $argv[1]
        case '*.tbz2'
            tar xjf $argv[1]
        case '*.tgz'
            tar xzf $argv[1]
        case '*.zip'
            unzip $argv[1]
        case '*.Z'
            uncompress $argv[1]
        case '*.7z'
            7z x $argv[1]
        case '*'
            echo "Unknown archive format"
    end
end

# Auto-start X at login on tty1
if status is-login
    if test -z "$DISPLAY" -a "$XDG_VTNR" = 1
        exec Hyprland
    end
end
