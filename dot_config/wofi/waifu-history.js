#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// Configuration
const HISTORY_FILE = path.join(process.env.HOME, '.config', 'waifu-history.txt');
const CACHE_DIR = path.join(process.env.HOME, '.cache', 'waifu-wallpapers');

class WaifuHistory {
    constructor() {
        this.historyFile = HISTORY_FILE;
        this.cacheDir = CACHE_DIR;
        this.maxEntries = 50;
    }

    notify(title, message, icon = null, urgency = 'normal') {
        try {
            let cmd = `notify-send \"${title}\" \"${message}\" --urgency=${urgency}`;
            if (icon) {
                cmd += ` --icon=\"${icon}\"`;
            }
            execSync(cmd, { stdio: 'ignore' });
        } catch (error) {
            console.log(`${title}: ${message}`);
        }
    }

    addToHistory(wallpaperPath) {
        if (!wallpaperPath || !fs.existsSync(wallpaperPath)) {
            return false;
        }

        try {
            const timestamp = new Date().toISOString()
                .replace('T', ' ')
                .split('.')[0];
            const entry = `${timestamp}|${wallpaperPath}\n`;

            // Append to history file
            fs.appendFileSync(this.historyFile, entry);

            // Keep only last N entries
            this.trimHistory();

            console.log(`✅ Added to history: ${path.basename(wallpaperPath)}`);
            return true;
        } catch (error) {
            console.error('Error adding to history:', error.message);
            return false;
        }
    }

    trimHistory() {
        try {
            if (!fs.existsSync(this.historyFile)) return;

            const lines = fs.readFileSync(this.historyFile, 'utf8')
                .split('\n')
                .filter(line => line.trim())
                .slice(-this.maxEntries);

            fs.writeFileSync(this.historyFile, lines.join('\n') + '\n');
        } catch (error) {
            console.error('Error trimming history:', error.message);
        }
    }

    getHistoryEntries() {
        try {
            if (!fs.existsSync(this.historyFile)) {
                return [];
            }

            const content = fs.readFileSync(this.historyFile, 'utf8');
            const entries = content
                .split('\n')
                .filter(line => line.trim())
                .map(line => {
                    const [timestamp, filePath] = line.split('|');
                    return { timestamp, filePath };
                })
                .filter(entry => entry.filePath && fs.existsSync(entry.filePath))
                .reverse(); // Newest first

            return entries;
        } catch (error) {
            console.error('Error reading history:', error.message);
            return [];
        }
    }

    formatDisplayName(entry) {
        const basename = path.basename(entry.filePath);
        // Truncate long filenames
        const displayName = basename.length > 30
            ? basename.substring(0, 27) + '...'
            : basename;

        return `📜 ${entry.timestamp} - ${displayName}`;
    }

    async showHistoryList() {
        const entries = this.getHistoryEntries();

        if (entries.length === 0) {
            this.notify('📜 History', 'No wallpaper history found');
            return;
        }

        // Create menu options
        let menuOptions = entries.map(entry => this.formatDisplayName(entry));

        // Add management options
        menuOptions.push('━━━━━━━━━━━━━━━━');
        menuOptions.push('🗑️ Clear History');

        const menuString = menuOptions.join('\n');

        try {
            const wofiProcess = spawn('wofi', [
                '--dmenu',
                '--prompt', 'Wallpaper History',
                '--width', '500',
                '--height', '400'
            ], {
                stdio: ['pipe', 'pipe', 'inherit']
            });

            wofiProcess.stdin.write(menuString);
            wofiProcess.stdin.end();

            let output = '';
            wofiProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            wofiProcess.on('close', (code) => {
                if (code === 0 && output.trim()) {
                    this.handleHistorySelection(output.trim(), entries);
                }
            });

        } catch (error) {
            console.error('Error showing history menu:', error.message);
        }
    }

    handleHistorySelection(selected, entries) {
        switch (selected) {
            case '🗑️ Clear History':
                this.clearHistory();
                break;

            case '━━━━━━━━━━━━━━━━':
                // Separator - do nothing
                break;

            default:
                this.applyHistoryWallpaper(selected, entries);
                break;
        }
    }

    applyHistoryWallpaper(selected, entries) {
        // Extract timestamp from selection to find the entry
        const match = selected.match(/📜 (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) - (.+)/);
        if (!match) return;

        const timestamp = match[1];
        const entry = entries.find(e => e.timestamp === timestamp);

        if (entry && fs.existsSync(entry.filePath)) {
            // Show loading notification
            this.notify('📜 Applying from History', 'Restoring wallpaper from history...', null, 'low');

            try {
                execSync(`swww img \"${entry.filePath}\" --transition-type wipe --transition-duration 1`, { stdio: 'inherit' });
                this.notify('✅ History Applied', 'Wallpaper restored from history!', entry.filePath, 'normal');

                // Add to history again (move to top)
                this.addToHistory(entry.filePath);

                console.log(`✅ Applied wallpaper from history: ${path.basename(entry.filePath)}`);
            } catch (error) {
                this.notify('❌ Failed to Apply', `Error: ${error.message}`, null, 'critical');
                console.error('Error applying wallpaper:', error.message);
            }
        } else {
            this.notify('❌ History Item Not Found', 'Selected wallpaper file not found', null, 'critical');
        }
    }

    clearHistory() {
        try {
            if (fs.existsSync(this.historyFile)) {
                fs.unlinkSync(this.historyFile);
            }
            this.notify('🗑️ History Cleared', 'Wallpaper history cleared');
            console.log('✅ History cleared');
        } catch (error) {
            this.notify('❌ Error', 'Failed to clear history');
            console.error('Error clearing history:', error.message);
        }
    }

    showHelp() {
        console.log('Usage: node waifu-history.js {add|list}');
        console.log('  add <path> - Add wallpaper to history');
        console.log('  list - Show and select from history');
    }
}

// Main execution
async function main() {
    const history = new WaifuHistory();
    const action = process.argv[2];
    const wallpaperPath = process.argv[3];

    switch (action) {
        case 'add':
            if (wallpaperPath) {
                history.addToHistory(wallpaperPath);
            } else {
                console.error('Error: wallpaper path required for add command');
                history.showHelp();
            }
            break;

        case 'list':
            await history.showHistoryList();
            break;

        default:
            history.showHelp();
            break;
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(error => {
        console.error(`❌ Unexpected error: ${error.message}`);
        process.exit(1);
    });
}

module.exports = WaifuHistory;