#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// Configuration
const FAVORITES_DIR = path.join(process.env.HOME, '.config', 'waifu-favorites');
const CACHE_DIR = path.join(process.env.HOME, '.cache', 'waifu-wallpapers');

// Ensure favorites directory exists
if (!fs.existsSync(FAVORITES_DIR)) {
    fs.mkdirSync(FAVORITES_DIR, { recursive: true });
}

class WaifuFavorites {
    constructor() {
        this.favoritesDir = FAVORITES_DIR;
        this.cacheDir = CACHE_DIR;
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

    getCurrentWallpaper() {
        try {
            const swwwOutput = execSync('swww query', { encoding: 'utf8' });
            const match = swwwOutput.match(/image: (.+)/);
            return match ? match[1].trim() : null;
        } catch (error) {
            return null;
        }
    }

    saveCurrentToFavorites() {
        const currentWallpaper = this.getCurrentWallpaper();

        if (!currentWallpaper || !fs.existsSync(currentWallpaper)) {
            this.notify('❌ Error', 'No current wallpaper found');
            return false;
        }

        // Generate unique name based on timestamp
        const timestamp = new Date().toISOString()
            .replace(/[:.]/g, '-')
            .replace('T', '_')
            .split('.')[0];
        const extension = path.extname(currentWallpaper);
        const favoriteName = `waifu_${timestamp}${extension}`;
        const favoritePath = path.join(this.favoritesDir, favoriteName);

        try {
            fs.copyFileSync(currentWallpaper, favoritePath);
            // Save metadata (for now, only filename; future: add link if available)
            const meta = {
                name: favoriteName,
                original: currentWallpaper,
                savedAt: new Date().toISOString()
            };
            const metaPath = favoritePath + '.json';
            fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
            this.notify('💖 Favorite Saved', `Current wallpaper saved as ${favoriteName}`);
            console.log(`✅ Saved to favorites: ${favoritePath}`);
            return true;
        } catch (error) {
            this.notify('❌ Error', 'Failed to save favorite');
            console.error('Error saving favorite:', error.message);
            return false;
        }
    }

    getFavoritesList() {
        try {
            const files = fs.readdirSync(this.favoritesDir)
                .filter(file => fs.statSync(path.join(this.favoritesDir, file)).isFile())
                .map(file => {
                    const filePath = path.join(this.favoritesDir, file);
                    const stats = fs.statSync(filePath);
                    return {
                        name: file,
                        path: filePath,
                        mtime: stats.mtime
                    };
                })
                .sort((a, b) => b.mtime - a.mtime); // Newest first

            return files;
        } catch (error) {
            console.error('Error reading favorites:', error.message);
            return [];
        }
    }

    formatDisplayName(filename) {
        // Extract date from filename for display
        const match = filename.match(/waifu_(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})/);
        if (match) {
            const datePart = match[1];
            const timePart = match[2].replace(/-/g, ':');
            return `💖 ${datePart} ${timePart}`;
        }
        return `💖 ${filename}`;
    }

    async showFavoritesList() {
        const favorites = this.getFavoritesList();

        if (favorites.length === 0) {
            this.notify('💖 Favorites', 'No favorites saved yet');
            return;
        }

        // Create menu options
        let menuOptions = favorites.map(fav => this.formatDisplayName(fav.name));

        // Add management options
        menuOptions.push('━━━━━━━━━━━━━━━━');
        menuOptions.push('🗑️ Clear All Favorites');
        menuOptions.push('📁 Open Favorites Folder');

        const menuString = menuOptions.join('\n');

        try {
            const wofiProcess = spawn('wofi', [
                '--dmenu',
                '--prompt', 'Select Favorite',
                '--width', '400',
                '--height', '300'
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
                    this.handleFavoriteSelection(output.trim(), favorites);
                }
            });

        } catch (error) {
            console.error('Error showing favorites menu:', error.message);
        }
    }

    handleFavoriteSelection(selected, favorites) {
        switch (selected) {
            case '🗑️ Clear All Favorites':
                this.clearAllFavorites();
                break;

            case '📁 Open Favorites Folder':
                this.openFavoritesFolder();
                break;

            case '━━━━━━━━━━━━━━━━':
                // Separator - do nothing
                break;

            default:
                this.applyFavoriteWallpaper(selected, favorites);
                break;
        }
    }

    applyFavoriteWallpaper(selected, favorites) {
        // Extract timestamp from selection to find the file
        const match = selected.match(/💖 (\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/);
        if (!match) return;

        const datePart = match[1];
        const timePart = match[2].replace(/:/g, '-');
        const pattern = `waifu_${datePart}_${timePart}`;

        const favorite = favorites.find(fav => fav.name.includes(pattern));
        if (favorite && fs.existsSync(favorite.path)) {
            // Show loading notification
            this.notify('💖 Applying Favorite', 'Setting wallpaper from favorites...', null, 'low');

            try {
                execSync(`swww img \"${favorite.path}\" --transition-type wipe --transition-duration 1`, { stdio: 'inherit' });
                this.notify('✅ Favorite Applied', 'Wallpaper set from favorites!', favorite.path, 'normal');

                // Add to history with metadata
                const metaPath = favorite.path + '.json';
                let meta = null;
                if (fs.existsSync(metaPath)) {
                    try {
                        meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
                    } catch (err) {
                        meta = null;
                    }
                }
                const historyScript = path.join(process.env.HOME, '.config', 'wofi', 'waifu-history.js');
                if (fs.existsSync(historyScript)) {
                    if (meta && meta.name) {
                        // Pass as: node waifu-history.js add <image> <name> <original>
                        spawn('node', [historyScript, 'add', favorite.path, meta.name, meta.original || ''], { stdio: 'ignore' });
                    } else {
                        spawn('node', [historyScript, 'add', favorite.path], { stdio: 'ignore' });
                    }
                }
            } catch (error) {
                this.notify('❌ Failed to Apply', `Error: ${error.message}`, null, 'critical');
                console.error('Error applying wallpaper:', error.message);
            }
        } else {
            this.notify('❌ Favorite Not Found', 'Selected favorite wallpaper file not found', null, 'critical');
        }
    } catch(error) {
        this.notify('❌ Error', 'Failed to apply wallpaper');
        console.error('Error applying wallpaper:', error.message);
    }

    clearAllFavorites() {
        try {
            const files = fs.readdirSync(this.favoritesDir);
            files.forEach(file => {
                const filePath = path.join(this.favoritesDir, file);
                if (fs.statSync(filePath).isFile()) {
                    fs.unlinkSync(filePath);
                }
            });
            this.notify('🗑️ Favorites Cleared', 'All favorite wallpapers removed');
            console.log('✅ All favorites cleared');
        } catch (error) {
            this.notify('❌ Error', 'Failed to clear favorites');
            console.error('Error clearing favorites:', error.message);
        }
    }

    openFavoritesFolder() {
        try {
            // Try different file managers
            const fileManagers = ['xdg-open', 'nautilus', 'thunar', 'dolphin'];

            for (const manager of fileManagers) {
                try {
                    execSync(`which ${manager}`, { stdio: 'ignore' });
                    execSync(`${manager} "${this.favoritesDir}"`, { stdio: 'ignore' });
                    return;
                } catch (error) {
                    // Try next file manager
                }
            }

            this.notify('❌ Error', 'No file manager found');
        } catch (error) {
            this.notify('❌ Error', 'Failed to open favorites folder');
            console.error('Error opening folder:', error.message);
        }
    }

    async showManagementMenu() {
        const options = [
            '💖 Save Current Wallpaper',
            '📋 Browse Favorites',
            '🗑️ Clear All Favorites',
            '📁 Open Favorites Folder'
        ];

        const menuString = options.join('\n');

        try {
            const wofiProcess = spawn('wofi', [
                '--dmenu',
                '--prompt', 'Favorites Manager',
                '--width', '300',
                '--height', '200'
            ], {
                stdio: ['pipe', 'pipe', 'inherit']
            });

            wofiProcess.stdin.write(menuString);
            wofiProcess.stdin.end();

            let output = '';
            wofiProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            wofiProcess.on('close', async (code) => {
                if (code === 0 && output.trim()) {
                    await this.handleManagementSelection(output.trim());
                }
            });

        } catch (error) {
            console.error('Error showing management menu:', error.message);
        }
    }

    async handleManagementSelection(selected) {
        switch (selected) {
            case '💖 Save Current Wallpaper':
                this.saveCurrentToFavorites();
                break;

            case '📋 Browse Favorites':
                await this.showFavoritesList();
                break;

            case '🗑️ Clear All Favorites':
                this.clearAllFavorites();
                break;

            case '📁 Open Favorites Folder':
                this.openFavoritesFolder();
                break;
        }
    }

    showHelp() {
        console.log('Usage: node waifu-favorites.js {save|list|menu}');
        console.log('  save - Save current wallpaper to favorites');
        console.log('  list - List and select from favorites');
        console.log('  menu - Show favorites management menu');
    }
}

// Main execution
async function main() {
    const favorites = new WaifuFavorites();
    const action = process.argv[2] || 'menu';

    switch (action) {
        case 'save':
            favorites.saveCurrentToFavorites();
            break;

        case 'list':
            await favorites.showFavoritesList();
            break;

        case 'menu':
            await favorites.showManagementMenu();
            break;

        default:
            favorites.showHelp();
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

module.exports = WaifuFavorites;