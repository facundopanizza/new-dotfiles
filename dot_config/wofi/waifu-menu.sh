#!/bin/bash

# Waifu Wallpaper Menu using Wofi
SCRIPT_DIR="$(dirname "$0")/../scripts"
WAIFU_SCRIPT="$SCRIPT_DIR/waifu-wallpaper.sh"
ROTATOR_SCRIPT="$SCRIPT_DIR/waifu-rotator.sh"

# Define menu options
options="🎌 Quick Random\n📂 Anime Categories\n🎨 Style Categories\n🎯 Quality Options\n💝 Special Categories\n━━━━━━━━━━━━━━━━\n💖 Favorites Manager\n💖 Save Current\n📋 Browse Favorites\n📜 Browse History\n━━━━━━━━━━━━━━━━\n🔄 Start Auto-Rotation (30min)\n🔄 Start Auto-Rotation (1hr)\n⏹️ Stop Auto-Rotation\n🔄 Change Now\n📊 Rotation Status\n━━━━━━━━━━━━━━━━\n📁 Open Cache Folder\n🗑️ Clear Cache"

# Show menu and get selection
selected=$(echo -e "$options" | wofi --dmenu --prompt "Waifu Wallpapers" --width 350 --height 400)

case "$selected" in
    "🎌 Quick Random")
        notify-send "🎌 Waifu Wallpaper" "Fetching random waifu..."
        "$WAIFU_SCRIPT" random
        ;;
    "📂 Anime Categories")
        bash "$(dirname "$0")/waifu-categories.sh" anime
        ;;
    "🎨 Style Categories")
        bash "$(dirname "$0")/waifu-categories.sh" style
        ;;
    "🎯 Quality Options")
        bash "$(dirname "$0")/waifu-categories.sh" quality
        ;;
    "💝 Special Categories")
        bash "$(dirname "$0")/waifu-categories.sh" special
        ;;
    "💖 Favorites Manager")
        bash "$(dirname "$0")/waifu-favorites.sh" menu
        ;;
    "💖 Save Current")
        bash "$(dirname "$0")/waifu-favorites.sh" save
        ;;
    "📋 Browse Favorites")
        bash "$(dirname "$0")/waifu-favorites.sh" list
        ;;
    "📜 Browse History")
        bash "$(dirname "$0")/waifu-history.sh" list
        ;;
    "━━━━━━━━━━━━━━━━")
        # Separator - do nothing
        ;;
    "🔄 Start Auto-Rotation (30min)")
        "$ROTATOR_SCRIPT" start 1800 random
        ;;
    "🔄 Start Auto-Rotation (1hr)")
        "$ROTATOR_SCRIPT" start 3600 random
        ;;
    "⏹️ Stop Auto-Rotation")
        "$ROTATOR_SCRIPT" stop
        ;;
    "🔄 Change Now")
        "$ROTATOR_SCRIPT" now
        ;;
    "📊 Rotation Status")
        status=$("$ROTATOR_SCRIPT" status)
        notify-send "📊 Rotation Status" "$status"
        ;;
    "📁 Open Cache Folder")
        cache_dir="$HOME/.cache/waifu-wallpapers"
        if [ -d "$cache_dir" ]; then
            xdg-open "$cache_dir" 2>/dev/null || nautilus "$cache_dir" 2>/dev/null || thunar "$cache_dir" 2>/dev/null
            notify-send "📁 Cache Folder" "Opening wallpaper cache folder"
        else
            notify-send "📁 Cache Folder" "Cache folder not found"
        fi
        ;;
    "🗑️ Clear Cache")
        cache_dir="$HOME/.cache/waifu-wallpapers"
        if [ -d "$cache_dir" ]; then
            rm -rf "$cache_dir"/*
            notify-send "🗑️ Cache Cleared" "Wallpaper cache has been cleared"
        else
            notify-send "🗑️ Cache" "No cache to clear"
        fi
        ;;
    *)
        echo "No option selected"
        ;;
esac