#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const https = require('https');
const http = require('http');

// Configuration
const WALLPAPER_DIR = path.join(process.env.HOME, '.cache', 'waifu-wallpapers');
const CURRENT_WALLPAPER = path.join(WALLPAPER_DIR, 'current.jpg');
const PERSISTENT_WALLPAPER = path.join(process.env.HOME, '.config', 'current-wallpaper.txt');
const MAX_CACHE_SIZE = 50;

// Ensure wallpaper directory exists
if (!fs.existsSync(WALLPAPER_DIR)) {
    fs.mkdirSync(WALLPAPER_DIR, { recursive: true });
}

// Utility function for notifications
function notify(title, message, icon = null, urgency = 'normal') {
    try {
        let cmd = `notify-send "${title}" "${message}" --urgency=${urgency}`;
        if (icon) {
            cmd += ` --icon="${icon}"`;
        }
        execSync(cmd, { stdio: 'ignore' });
    } catch (error) {
        // Notification failed, but that's not critical
        console.log(`${title}: ${message}`);
    }
}

// Utility function to make HTTP requests
function makeRequest(url, timeout = 30000) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const timeoutId = setTimeout(() => {
            reject(new Error(`Request timeout after ${timeout}ms`));
        }, timeout);

        const req = client.get(url, (res) => {
            clearTimeout(timeoutId);
            let data = '';

            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(data);
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                }
            });
        });

        req.on('error', (err) => {
            clearTimeout(timeoutId);
            reject(err);
        });

        req.setTimeout(timeout, () => {
            req.destroy();
            reject(new Error(`Request timeout after ${timeout}ms`));
        });
    });
}

// Utility function to download file
function downloadFile(url, filepath, timeout = 60000) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(filepath);

        const timeoutId = setTimeout(() => {
            file.destroy();
            fs.unlink(filepath, () => { });
            reject(new Error(`Download timeout after ${timeout}ms`));
        }, timeout);

        const req = client.get(url, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                res.pipe(file);
                file.on('finish', () => {
                    clearTimeout(timeoutId);
                    file.close();
                    resolve(filepath);
                });
            } else {
                clearTimeout(timeoutId);
                file.destroy();
                fs.unlink(filepath, () => { });
                reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
            }
        });

        req.on('error', (err) => {
            clearTimeout(timeoutId);
            file.destroy();
            fs.unlink(filepath, () => { });
            reject(err);
        });

        file.on('error', (err) => {
            clearTimeout(timeoutId);
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
}

// Fetch from waifu.pics API
async function fetchWaifuPics(category = 'waifu') {
    category = category === '' || !category ? 'waifu' : category
    console.log('🎌 Fetching waifu from waifu.pics...');

    try {
        const response = await makeRequest(`https://api.waifu.pics/sfw/${category}`);
        const data = JSON.parse(response);

        if (!data.url) {
            throw new Error('No URL in response');
        }

        const filename = path.join(WALLPAPER_DIR, `waifu_${Date.now()}.jpg`);
        console.log(`📥 Downloading: ${data.url}`);

        await downloadFile(data.url, filename);
        return filename;

    } catch (error) {
        console.log(`❌ waifu.pics error: ${error.message}`);
        throw error;
    }
}

// Fetch from Picsum (fallback source)
async function fetchPicsum() {
    console.log('🖼️ Fetching from Picsum (fallback)...');

    try {
        const width = 1920;
        const height = 1080;
        const filename = path.join(WALLPAPER_DIR, `picsum_${Date.now()}.jpg`);
        const url = `https://picsum.photos/${width}/${height}`;

        console.log(`📥 Downloading: ${url}`);
        await downloadFile(url, filename);
        return filename;

    } catch (error) {
        console.log(`❌ Picsum error: ${error.message}`);
        throw error;
    }
}

// Fetch from waifu.im API
async function fetchWaifuIm(tags = 'waifu') {
    tags = tags === '' || !tags ? 'waifu' : tags
    console.log('🎨 Fetching HQ waifu from waifu.im...');

    try {
        // Use proper waifu.im API parameters for desktop wallpapers
        const params = new URLSearchParams({
            included_tags: tags,
            height: '>=1080',
            width: '>=1920',
            orientation: 'LANDSCAPE',
            is_nsfw: 'false'
        });

        console.log(`https://api.waifu.im/search?${params}`, params, { tags, type: typeof tags })
        const response = await makeRequest(`https://api.waifu.im/search?${params}`);
        const data = JSON.parse(response);

        if (!data.images || !data.images[0] || !data.images[0].url) {
            throw new Error('No images in response');
        }

        const filename = path.join(WALLPAPER_DIR, `hq_waifu_${Date.now()}.jpg`);
        console.log(`📥 Downloading: ${data.images[0].url}`);

        await downloadFile(data.images[0].url, filename);
        return filename;

    } catch (error) {
        console.log(`❌ waifu.im error: ${error.message}`);
        throw error;
    }
}

// Fetch from Safebooru
async function fetchSafebooru(tags) {
    tags = tags === '' || !tags ? '1girl solo highres width:>=1920 height:>=1080' : tags
    console.log('🌸 Fetching from Safebooru...');

    try {
        const pid = Math.floor(Math.random() * 100);
        const response = await makeRequest(`https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&limit=1&tags=${encodeURIComponent(tags)}&pid=${pid}`);
        const data = JSON.parse(response);

        if (!data[0] || !data[0].file_url) {
            throw new Error('No file_url in response');
        }

        const filename = path.join(WALLPAPER_DIR, `safebooru_${Date.now()}.jpg`);
        // Fix double https issue
        let fileUrl = data[0].file_url;
        if (fileUrl.startsWith('//')) {
            fileUrl = `https:${fileUrl}`;
        } else if (!fileUrl.startsWith('http')) {
            fileUrl = `https://safebooru.org${fileUrl}`;
        }

        console.log(`📥 Downloading: ${fileUrl}`);

        await downloadFile(fileUrl, filename);
        return filename;

    } catch (error) {
        console.log(`❌ Safebooru error: ${error.message}`);
        throw error;
    }
}

// Fetch from Konachan
async function fetchKonachan(tags = 'rating:safe width:>=1920 height:>=1080') {
    tags = tags === '' || !tags ? 'rating:safe width:>=1920 height:>=1080' : tags
    console.log('🎯 Fetching from Konachan...');

    try {
        const page = Math.floor(Math.random() * 100);
        const response = await makeRequest(`https://konachan.com/post.json?limit=1&tags=${encodeURIComponent(tags)}&page=${page}`);
        const data = JSON.parse(response);

        if (!data[0] || !data[0].file_url) {
            throw new Error('No file_url in response');
        }

        const filename = path.join(WALLPAPER_DIR, `konachan_${Date.now()}.jpg`);
        console.log(`📥 Downloading: ${data[0].file_url}`);

        await downloadFile(data[0].file_url, filename);
        return filename;

    } catch (error) {
        console.log(`❌ Konachan error: ${error.message}`);
        throw error;
    }
}

// Fetch from Danbooru
async function fetchDanbooru(tags = 'rating:general width:>=1920 height:>=1080') {
    tags = tags === '' || !tags ? 'rating:general width:>=1920 height:>=1080' : tags
    console.log('🎭 Fetching from Danbooru...');

    try {
        const response = await makeRequest(`https://danbooru.donmai.us/posts.json?limit=1&tags=${encodeURIComponent(tags)}&random=true`);
        const data = JSON.parse(response);

        if (!data[0] || !data[0].file_url) {
            throw new Error('No file_url in response');
        }

        const filename = path.join(WALLPAPER_DIR, `danbooru_${Date.now()}.jpg`);
        console.log(`📥 Downloading: ${data[0].file_url}`);

        await downloadFile(data[0].file_url, filename);
        return filename;

    } catch (error) {
        console.log(`❌ Danbooru error: ${error.message}`);
        throw error;
    }
}

// Fetch from Gelbooru
async function fetchGelbooru(tags = 'rating:safe width:>=1920 height:>=1080') {
    tags = tags === '' || !tags ? 'rating:safe width:>=1920 height:>=1080' : tags
    console.log('🌺 Fetching from Gelbooru...');

    try {
        const pid = Math.floor(Math.random() * 100);
        const response = await makeRequest(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&limit=1&tags=${encodeURIComponent(tags)}&pid=${pid}`);
        const data = JSON.parse(response);

        if (!data.post || !data.post[0] || !data.post[0].file_url) {
            throw new Error('No file_url in response');
        }

        const filename = path.join(WALLPAPER_DIR, `gelbooru_${Date.now()}.jpg`);
        console.log(`📥 Downloading: ${data.post[0].file_url}`);

        await downloadFile(data.post[0].file_url, filename);
        return filename;

    } catch (error) {
        console.log(`❌ Gelbooru error: ${error.message}`);
        throw error;
    }
}

// Get cached wallpaper
function getCachedWallpaper() {
    try {
        const files = fs.readdirSync(WALLPAPER_DIR)
            .filter(file => file.endsWith('.jpg') && file !== 'current.jpg')
            .map(file => path.join(WALLPAPER_DIR, file))
            .filter(file => fs.existsSync(file));

        if (files.length === 0) {
            return null;
        }

        // Return random cached file
        return files[Math.floor(Math.random() * files.length)];
    } catch (error) {
        console.log(`❌ Error getting cached wallpaper: ${error.message}`);
        return null;
    }
}

// Set wallpaper
function setWallpaper(wallpaperFile) {
    try {
        if (!fs.existsSync(wallpaperFile)) {
            throw new Error('Wallpaper file does not exist');
        }

        // Copy to current wallpaper
        fs.copyFileSync(wallpaperFile, CURRENT_WALLPAPER);

        // Set with swww
        execSync(`swww img "${CURRENT_WALLPAPER}" --transition-type wipe --transition-duration 2`, { stdio: 'inherit' });

        // Save wallpaper path for persistence
        try {
            fs.writeFileSync(PERSISTENT_WALLPAPER, CURRENT_WALLPAPER);
        } catch (error) {
            console.log('⚠️ Failed to save persistent wallpaper path');
        }

        // Add to history
        const historyScript = path.join(process.env.HOME, '.config', 'wofi', 'waifu-history.js');
        if (fs.existsSync(historyScript)) {
            try {
                execSync(`node "${historyScript}" add "${CURRENT_WALLPAPER}"`, { stdio: 'inherit' });
            } catch (error) {
                console.log('⚠️ Failed to add to history');
            }
        }

        console.log(`✨ Wallpaper set: ${path.basename(wallpaperFile)}`);

    } catch (error) {
        console.log(`❌ Failed to set wallpaper: ${error.message}`);
        throw error;
    }
}

// Clean up old wallpapers
function cleanupCache() {
    try {
        const files = fs.readdirSync(WALLPAPER_DIR)
            .filter(file => file.endsWith('.jpg') && file !== 'current.jpg')
            .map(file => ({
                name: file,
                path: path.join(WALLPAPER_DIR, file),
                mtime: fs.statSync(path.join(WALLPAPER_DIR, file)).mtime
            }))
            .sort((a, b) => b.mtime - a.mtime);

        if (files.length > MAX_CACHE_SIZE) {
            const filesToDelete = files.slice(MAX_CACHE_SIZE);
            console.log(`🧹 Cleaning ${filesToDelete.length} old wallpapers...`);

            filesToDelete.forEach(file => {
                try {
                    fs.unlinkSync(file.path);
                } catch (error) {
                    // Ignore errors when deleting
                }
            });
        }
    } catch (error) {
        console.log(`⚠️ Error during cleanup: ${error.message}`);
    }
}

// Main function
async function main() {
    const args = process.argv.slice(2);
    const source = args[0] || 'random';
    const tags = args[1] || '';

    // Show loading notification
    const sourceDisplayName = source === 'random' ? 'Random Source' : 
                             source === 'waifu-im' ? 'Waifu.im (HQ)' :
                             source === 'waifu-pics' ? 'Waifu.pics' :
                             source === 'cached' ? 'Cached' :
                             source.charAt(0).toUpperCase() + source.slice(1);
    
    notify('🎌 Loading Wallpaper', `Fetching from ${sourceDisplayName}...`, null, 'low');

    const sources = {
        'waifu-im': fetchWaifuIm,
        'konachan': fetchKonachan,
        'waifu-pics': fetchWaifuPics,
        'safebooru': fetchSafebooru,
        'danbooru': fetchDanbooru,
        'gelbooru': fetchGelbooru,
        'picsum': fetchPicsum
    };

    let wallpaper = null;
    let actualSource = source;

    try {
        if (source === 'cached') {
            wallpaper = getCachedWallpaper();
            if (!wallpaper) {
                throw new Error('No cached wallpapers available');
            }
        } else if (sources[source]) {
            wallpaper = await sources[source](tags);
        } else if (source === 'random') {
            const sourceNames = Object.keys(sources);

            // Try up to 5 different sources
            for (let attempt = 1; attempt <= 5; attempt++) {
                const randomSource = sourceNames[Math.floor(Math.random() * sourceNames.length)];
                console.log(`🎲 Trying source: ${randomSource} (attempt ${attempt})`);
                actualSource = randomSource;

                try {
                    wallpaper = await sources[randomSource](tags);
                    break;
                } catch (error) {
                    console.log(`⚠️ Source ${randomSource} failed, trying another...`);
                    if (attempt < 5) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }

            // Fallback to cached if all online sources fail
            if (!wallpaper) {
                console.log('🔄 All online sources failed, using cached wallpaper...');
                wallpaper = getCachedWallpaper();
                actualSource = 'cached';
                if (!wallpaper) {
                    throw new Error('All sources failed and no cached wallpapers available');
                }
            }
        } else {
            throw new Error(`Unknown source: ${source}`);
        }

        if (wallpaper && fs.existsSync(wallpaper)) {
            setWallpaper(wallpaper);
            cleanupCache();
            
            // Show success notification
            const finalSourceName = actualSource === 'waifu-im' ? 'Waifu.im (HQ)' :
                                   actualSource === 'waifu-pics' ? 'Waifu.pics' :
                                   actualSource === 'cached' ? 'Cache' :
                                   actualSource.charAt(0).toUpperCase() + actualSource.slice(1);
            
            notify('✨ Wallpaper Applied', `New wallpaper from ${finalSourceName}!`, CURRENT_WALLPAPER, 'normal');
        } else {
            throw new Error('Failed to fetch wallpaper');
        }

    } catch (error) {
        console.log(`❌ ${error.message}`);
        
        // Show failure notification
        notify('❌ Wallpaper Failed', `Failed to load wallpaper: ${error.message}`, null, 'critical');
        
        process.exit(1);
    }
}

// Help function
function showHelp() {
    console.log('🎌 Waifu Wallpaper Fetcher');
    console.log('');
    console.log('Usage: node waifu-wallpaper.js [source] [tags]');
    console.log('');
    console.log('Sources:');
    console.log('  random      - Random source (default)');
    console.log('  waifu-pics  - waifu.pics API');
    console.log('  waifu-im    - waifu.im API (HQ)');
    console.log('  safebooru   - Safebooru image board');
    console.log('  konachan    - Konachan (HQ anime wallpapers)');
    console.log('  danbooru    - Danbooru (HQ anime art)');
    console.log('  gelbooru    - Gelbooru image board');
    console.log('  picsum      - Picsum (fallback)');
    console.log('  cached      - Use cached wallpaper');
    console.log('');
    console.log('Examples:');
    console.log('  node waifu-wallpaper.js                    # Random waifu');
    console.log('  node waifu-wallpaper.js waifu-im           # HQ waifu from waifu.im');
    console.log('  node waifu-wallpaper.js safebooru "1girl"  # Specific tags from Safebooru');
    console.log('');
}

// Check for help
if (process.argv.includes('-h') || process.argv.includes('--help')) {
    showHelp();
    process.exit(0);
}

// Run main function
main().catch(error => {
    console.error(`❌ Unexpected error: ${error.message}`);
    process.exit(1);
});
