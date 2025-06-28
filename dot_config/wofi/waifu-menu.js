#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const SCRIPT_DIR = path.join(process.env.HOME, '.config', 'scripts');
const WAIFU_SCRIPT = path.join(SCRIPT_DIR, 'waifu-wallpaper.js');
const WALLPAPERS_DIR = path.join(process.env.HOME, 'Pictures', 'Wallpapers');
const CACHE_DIR = path.join(process.env.HOME, '.cache', 'waifu-wallpapers');

// Ensure wallpapers directory exists
if (!fs.existsSync(WALLPAPERS_DIR)) {
    fs.mkdirSync(WALLPAPERS_DIR, { recursive: true });
}

class WaifuMenu {
    constructor() {
        this.options = [
            { emoji: '🎲', name: 'Random Waifu', action: 'random' },
            { emoji: '🎌', name: 'Waifu.pics', action: 'waifu-pics' },
            { emoji: '🎨', name: 'Waifu.im (HQ)', action: 'waifu-im' },
            { emoji: '🌸', name: 'Safebooru', action: 'safebooru' },
            { emoji: '🎯', name: 'Konachan', action: 'konachan' },
            { emoji: '🎭', name: 'Danbooru', action: 'danbooru' },
            { emoji: '🌺', name: 'Gelbooru', action: 'gelbooru' },
            { emoji: '🖼️', name: 'Picsum', action: 'picsum' },
            { emoji: '📁', name: 'Cached', action: 'cached' },
            { emoji: '💾', name: 'Download Current to Wallpapers', action: 'download' },
            { emoji: '❤️', name: 'Favorites', action: 'favorites' },
            { emoji: '📜', name: 'History', action: 'history' }
        ];
    }

    generateMenuString() {
        return this.options
            .map(option => `${option.emoji} ${option.name}`)
            .join('\n');
    }

    async downloadCurrentWallpaper() {
        // Show loading notification
        this.notify('💾 Downloading...', 'Saving current wallpaper to Pictures/Wallpapers/', null, 'low');

        try {
            // Get current wallpaper path from swww
            const swwwOutput = execSync('swww query', { encoding: 'utf8' });
            const match = swwwOutput.match(/image: (.+)/);

            if (!match) {
                this.notify('❌ Download Failed', 'No current wallpaper found', null, 'critical');
                return;
            }

            const currentWallpaper = match[1].trim();

            if (!fs.existsSync(currentWallpaper)) {
                this.notify('❌ Download Failed', 'Current wallpaper file not found', null, 'critical');
                return;
            }

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const extension = path.extname(currentWallpaper);
            const filename = `waifu_${timestamp}${extension}`;
            const destinationPath = path.join(WALLPAPERS_DIR, filename);

            // Copy file to wallpapers directory
            fs.copyFileSync(currentWallpaper, destinationPath);

            this.notify('✅ Download Complete', `Wallpaper saved as ${filename}`, destinationPath, 'normal');
            console.log(`✅ Wallpaper downloaded to: ${destinationPath}`);

        } catch (error) {
            console.error('Error downloading wallpaper:', error.message);
            this.notify('❌ Download Failed', `Error: ${error.message}`, null, 'critical');
        }
    }

    notify(title, message, icon = null, urgency = 'normal') {
        try {
            let cmd = `notify-send \"${title}\" \"${message}\" --urgency=${urgency}`;
            if (icon) {
                cmd += ` --icon=\"${icon}\"`;
            }
            execSync(cmd, { stdio: 'ignore' });
        } catch (error) {
            // Notification failed, but that's not critical
            console.log(`${title}: ${message}`);
        }
    }

    async executeAction(action) {
        switch (action) {
            case 'download':
                await this.downloadCurrentWallpaper();
                break;

            case 'favorites':
                this.notify('📋 Opening Favorites', 'Loading favorites menu...');
                spawn('node', [path.join(process.env.HOME, '.config', 'wofi', 'waifu-favorites.js'), 'list'], { stdio: 'inherit' });
                break;

            case 'history':
                this.notify('📜 Opening History', 'Loading history menu...');
                spawn('node', [path.join(process.env.HOME, '.config', 'wofi', 'waifu-history.js'), 'list'], { stdio: 'inherit' });
                break;

            default:
                // Execute waifu wallpaper script with the specified source
                spawn('node', [WAIFU_SCRIPT, action], { stdio: 'inherit' });
                break;
        }
    }

    async showMenu() {
        try {
            const menuString = this.generateMenuString();

            // Use wofi to show the menu
            const wofiProcess = spawn('wofi', [
                '--dmenu',
                '--prompt', 'Waifu Wallpapers',
                '--width', '350',
                '--height', '450'
            ], {
                stdio: ['pipe', 'pipe', 'inherit']
            });

            // Send menu options to wofi
            wofiProcess.stdin.write(menuString);
            wofiProcess.stdin.end();

            let output = '';
            wofiProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            wofiProcess.on('close', async (code) => {
                if (code === 0 && output.trim()) {
                    const selected = output.trim();

                    // Find the corresponding action
                    const option = this.options.find(opt =>
                        selected === `${opt.emoji} ${opt.name}`
                    );

                    if (option) {
                        await this.executeAction(option.action);
                    }
                }
            });

        } catch (error) {
            console.error('Error showing menu:', error.message);
        }
    }
}

// Main execution
async function main() {
    const menu = new WaifuMenu();
    await menu.showMenu();
}

// Run if called directly
if (require.main === module) {
    main().catch(error => {
        console.error(`❌ Unexpected error: ${error.message}`);
        process.exit(1);
    });
}

module.exports = WaifuMenu;