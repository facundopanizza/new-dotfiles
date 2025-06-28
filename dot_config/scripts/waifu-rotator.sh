#!/bin/bash

# Waifu Wallpaper Auto-Rotator
# Automatically changes wallpaper at specified intervals

SCRIPT_DIR="$(dirname "$0")"
WAIFU_SCRIPT="node $SCRIPT_DIR/waifu-wallpaper.js"
PID_FILE="$HOME/.cache/waifu-rotator.pid"

# Default settings
INTERVAL=1800  # 30 minutes in seconds
SOURCE="random"

# Function to start rotation
start_rotation() {
    local interval=${1:-$INTERVAL}
    local source=${2:-$SOURCE}
    
    # Check if already running
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
        echo "🔄 Waifu rotator is already running (PID: $(cat "$PID_FILE"))"
        return 1
    fi
    
    echo "🎌 Starting waifu wallpaper rotation every $interval seconds..."
    echo "📡 Source: $source"
    
    # Start rotation in background
    (
        while true; do
            $WAIFU_SCRIPT "$source"
            sleep "$interval"
        done
    ) &
    
    # Save PID
    echo $! > "$PID_FILE"
    echo "✅ Waifu rotator started (PID: $!)"
}

# Function to stop rotation
stop_rotation() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid"
            rm -f "$PID_FILE"
            echo "⏹️ Waifu rotator stopped"
        else
            rm -f "$PID_FILE"
            echo "❌ Waifu rotator was not running"
        fi
    else
        echo "❌ Waifu rotator is not running"
    fi
}

# Function to check status
check_status() {
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
        echo "✅ Waifu rotator is running (PID: $(cat "$PID_FILE"))"
    else
        echo "❌ Waifu rotator is not running"
        [ -f "$PID_FILE" ] && rm -f "$PID_FILE"
    fi
}

# Function to restart rotation
restart_rotation() {
    stop_rotation
    sleep 1
    start_rotation "$@"
}

# Function to change wallpaper now
change_now() {
    local source=${1:-$SOURCE}
    echo "🔄 Changing wallpaper now..."
    $WAIFU_SCRIPT "$source"
}

# Help function
show_help() {
    echo "🎌 Waifu Wallpaper Auto-Rotator"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  start [interval] [source]  - Start auto-rotation"
    echo "  stop                       - Stop auto-rotation"
    echo "  restart [interval] [source] - Restart auto-rotation"
    echo "  status                     - Check rotation status"
    echo "  now [source]              - Change wallpaper immediately"
    echo ""
    echo "Options:"
    echo "  interval  - Time between changes in seconds (default: 1800 = 30min)"
    echo "  source    - Wallpaper source (default: random)"
    echo ""
    echo "Examples:"
    echo "  $0 start                   # Start with defaults (30min, random)"
    echo "  $0 start 600 waifu-im     # Start with 10min interval, HQ source"
    echo "  $0 now konachan           # Change wallpaper now from Konachan"
    echo "  $0 stop                   # Stop rotation"
    echo ""
}

# Parse arguments
case "$1" in
    "start")
        start_rotation "$2" "$3"
        ;;
    "stop")
        stop_rotation
        ;;
    "restart")
        restart_rotation "$2" "$3"
        ;;
    "status")
        check_status
        ;;
    "now")
        change_now "$2"
        ;;
    "-h"|"--help"|"help"|"")
        show_help
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo "Use '$0 --help' for usage information"
        exit 1
        ;;
esac