#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PERSISTENT_WALLPAPER = path.join(process.env.HOME, '.config', 'current-wallpaper.txt');
const DEFAULT_WALLPAPER = path.join(process.env.HOME, '.cache', 'waifu-wallpapers', 'current.jpg');

function restoreWallpaper() {
    try {
        let wallpaperPath = null;

        // Try to read the persistent wallpaper path
        if (fs.existsSync(PERSISTENT_WALLPAPER)) {
            const savedPath = fs.readFileSync(PERSISTENT_WALLPAPER, 'utf8').trim();
            if (savedPath && fs.existsSync(savedPath)) {
                wallpaperPath = savedPath;
                console.log(`🔄 Restoring wallpaper: ${path.basename(wallpaperPath)}`);
            }
        }

        // Fallback to default current wallpaper
        if (!wallpaperPath && fs.existsSync(DEFAULT_WALLPAPER)) {
            wallpaperPath = DEFAULT_WALLPAPER;
            console.log(`🔄 Using default wallpaper: ${path.basename(wallpaperPath)}`);
        }

        if (wallpaperPath) {
            // Set wallpaper with swww
            execSync(`swww img "${wallpaperPath}" --transition-type fade --transition-duration 1`, { stdio: 'inherit' });
            console.log('✅ Wallpaper restored successfully');
            return true;
        } else {
            console.log('⚠️ No wallpaper found to restore');
            return false;
        }

    } catch (error) {
        console.error(`❌ Failed to restore wallpaper: ${error.message}`);
        return false;
    }
}

// Main execution
if (require.main === module) {
    // Wait a bit for the desktop environment to be ready
    setTimeout(() => {
        restoreWallpaper();
    }, 2000);
}

module.exports = { restoreWallpaper };