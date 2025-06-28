#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

// Configuration
const SCRIPT_DIR = __dirname;
const WAIFU_SCRIPT = path.join(SCRIPT_DIR, 'waifu-wallpaper.js');
const PID_FILE = path.join(process.env.HOME, '.cache', 'waifu-rotator.pid');

// Default settings
const DEFAULT_INTERVAL = 1800; // 30 minutes in seconds
const DEFAULT_SOURCE = 'random';

class WaifuRotator {
    constructor() {
        this.interval = DEFAULT_INTERVAL;
        this.source = DEFAULT_SOURCE;
    }

    notify(title, message, icon = null, urgency = 'normal') {
        try {
            let cmd = `notify-send "${title}" "${message}" --urgency=${urgency}`;
            if (icon) {
                cmd += ` --icon="${icon}"`;
            }
            execSync(cmd, { stdio: 'ignore' });
        } catch (error) {
            console.log(`${title}: ${message}`);
        }
    }

    async startRotation(interval = this.interval, source = this.source) {
        // Check if already running
        if (this.isRunning()) {
            const pid = fs.readFileSync(PID_FILE, 'utf8').trim();
            console.log(`🔄 Waifu rotator is already running (PID: ${pid})`);
            return false;
        }

        console.log(`🎌 Starting waifu wallpaper rotation every ${interval} seconds...`);
        console.log(`📡 Source: ${source}`);

        // Show notification
        const intervalMinutes = Math.round(interval / 60);
        this.notify('🔄 Rotation Started', `Auto-changing wallpaper every ${intervalMinutes} minutes from ${source}`, null, 'low');

        // Start rotation process
        const child = spawn('node', [WAIFU_SCRIPT, source], {
            detached: true,
            stdio: 'ignore'
        });

        // Save PID
        fs.writeFileSync(PID_FILE, child.pid.toString());
        
        // Schedule next wallpaper change
        this.scheduleNext(interval, source);
        
        child.unref();
        console.log(`✅ Waifu rotator started (PID: ${child.pid})`);
        return true;
    }

    scheduleNext(interval, source) {
        setTimeout(() => {
            if (this.isRunning()) {
                // Change wallpaper
                spawn('node', [WAIFU_SCRIPT, source], { stdio: 'ignore' });
                // Schedule next change
                this.scheduleNext(interval, source);
            }
        }, interval * 1000);
    }

    stopRotation() {
        if (!fs.existsSync(PID_FILE)) {
            console.log('❌ Waifu rotator is not running');
            return false;
        }

        try {
            const pid = fs.readFileSync(PID_FILE, 'utf8').trim();
            process.kill(pid, 'SIGTERM');
            fs.unlinkSync(PID_FILE);
            console.log('⏹️ Waifu rotator stopped');
            this.notify('⏹️ Rotation Stopped', 'Wallpaper auto-rotation has been stopped', null, 'low');
            return true;
        } catch (error) {
            fs.unlinkSync(PID_FILE);
            console.log('❌ Waifu rotator was not running');
            this.notify('❌ Not Running', 'Wallpaper rotator was not running', null, 'normal');
            return false;
        }
    }

    checkStatus() {
        if (this.isRunning()) {
            const pid = fs.readFileSync(PID_FILE, 'utf8').trim();
            console.log(`✅ Waifu rotator is running (PID: ${pid})`);
            return true;
        } else {
            console.log('❌ Waifu rotator is not running');
            if (fs.existsSync(PID_FILE)) {
                fs.unlinkSync(PID_FILE);
            }
            return false;
        }
    }

    isRunning() {
        if (!fs.existsSync(PID_FILE)) {
            return false;
        }

        try {
            const pid = fs.readFileSync(PID_FILE, 'utf8').trim();
            process.kill(pid, 0); // Check if process exists
            return true;
        } catch (error) {
            return false;
        }
    }

    async restartRotation(interval = this.interval, source = this.source) {
        this.stopRotation();
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.startRotation(interval, source);
    }

    changeNow(source = this.source) {
        console.log('🔄 Changing wallpaper now...');
        this.notify('🔄 Changing Now', 'Fetching new wallpaper immediately...', null, 'low');
        spawn('node', [WAIFU_SCRIPT, source], { stdio: 'inherit' });
    }

    showHelp() {
        console.log('🎌 Waifu Wallpaper Auto-Rotator');
        console.log('');
        console.log('Usage: node waifu-rotator.js [command] [options]');
        console.log('');
        console.log('Commands:');
        console.log('  start [interval] [source]  - Start auto-rotation');
        console.log('  stop                       - Stop auto-rotation');
        console.log('  restart [interval] [source] - Restart auto-rotation');
        console.log('  status                     - Check rotation status');
        console.log('  now [source]              - Change wallpaper immediately');
        console.log('');
        console.log('Options:');
        console.log('  interval  - Time between changes in seconds (default: 1800 = 30min)');
        console.log('  source    - Wallpaper source (default: random)');
        console.log('');
        console.log('Examples:');
        console.log('  node waifu-rotator.js start                   # Start with defaults (30min, random)');
        console.log('  node waifu-rotator.js start 600 waifu-im     # Start with 10min interval, HQ source');
        console.log('  node waifu-rotator.js now konachan           # Change wallpaper now from Konachan');
        console.log('  node waifu-rotator.js stop                   # Stop rotation');
        console.log('');
    }
}

// Main execution
async function main() {
    const rotator = new WaifuRotator();
    const args = process.argv.slice(2);
    const command = args[0] || 'help';

    switch (command) {
        case 'start':
            const interval = parseInt(args[1]) || DEFAULT_INTERVAL;
            const source = args[2] || DEFAULT_SOURCE;
            await rotator.startRotation(interval, source);
            break;

        case 'stop':
            rotator.stopRotation();
            break;

        case 'restart':
            const restartInterval = parseInt(args[1]) || DEFAULT_INTERVAL;
            const restartSource = args[2] || DEFAULT_SOURCE;
            await rotator.restartRotation(restartInterval, restartSource);
            break;

        case 'status':
            rotator.checkStatus();
            break;

        case 'now':
            const nowSource = args[1] || DEFAULT_SOURCE;
            rotator.changeNow(nowSource);
            break;

        case 'help':
        case '-h':
        case '--help':
        case '':
            rotator.showHelp();
            break;

        default:
            console.log(`❌ Unknown command: ${command}`);
            console.log("Use 'node waifu-rotator.js --help' for usage information");
            process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(error => {
        console.error(`❌ Unexpected error: ${error.message}`);
        process.exit(1);
    });
}

module.exports = WaifuRotator;