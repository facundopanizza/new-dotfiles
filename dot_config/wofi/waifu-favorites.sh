#!/bin/bash

# Waifu Favorites Manager
FAVORITES_DIR="$HOME/.config/waifu-favorites"
CACHE_DIR="$HOME/.cache/waifu-wallpapers"

# Create favorites directory if it doesn't exist
mkdir -p "$FAVORITES_DIR"

action="$1"

case "$action" in
    "save")
        # Save current wallpaper to favorites
        current_wallpaper=$(swww query | grep -o '/[^"]*\.jpg\|/[^"]*\.png\|/[^"]*\.jpeg' | head -1)
        if [ -n "$current_wallpaper" ] && [ -f "$current_wallpaper" ]; then
            # Generate a unique name based on timestamp
            timestamp=$(date +%Y%m%d_%H%M%S)
            extension="${current_wallpaper##*.}"
            favorite_name="waifu_${timestamp}.${extension}"
            
            cp "$current_wallpaper" "$FAVORITES_DIR/$favorite_name"
            notify-send "💖 Favorite Saved" "Current wallpaper saved as $favorite_name"
        else
            notify-send "❌ Error" "No current wallpaper found"
        fi
        ;;
    
    "list")
        # List and select from favorites
        if [ ! -d "$FAVORITES_DIR" ] || [ -z "$(ls -A "$FAVORITES_DIR" 2>/dev/null)" ]; then
            notify-send "💖 Favorites" "No favorites saved yet"
            exit 0
        fi
        
        # Create menu of favorites with preview
        favorites_list=""
        for file in "$FAVORITES_DIR"/*; do
            if [ -f "$file" ]; then
                basename_file=$(basename "$file")
                # Extract date from filename for display
                if [[ "$basename_file" =~ waifu_([0-9]{8})_([0-9]{6}) ]]; then
                    date_part="${BASH_REMATCH[1]}"
                    time_part="${BASH_REMATCH[2]}"
                    formatted_date="${date_part:0:4}-${date_part:4:2}-${date_part:6:2}"
                    formatted_time="${time_part:0:2}:${time_part:2:2}:${time_part:4:2}"
                    display_name="💖 $formatted_date $formatted_time"
                else
                    display_name="💖 $basename_file"
                fi
                favorites_list="$favorites_list$display_name\n"
            fi
        done
        
        # Add management options
        favorites_list="$favorites_list━━━━━━━━━━━━━━━━\n🗑️ Clear All Favorites\n📁 Open Favorites Folder"
        
        selected=$(echo -e "$favorites_list" | wofi --dmenu --prompt "Select Favorite" --width 400 --height 300)
        
        case "$selected" in
            "🗑️ Clear All Favorites")
                rm -f "$FAVORITES_DIR"/*
                notify-send "🗑️ Favorites Cleared" "All favorite wallpapers removed"
                ;;
            "📁 Open Favorites Folder")
                xdg-open "$FAVORITES_DIR" 2>/dev/null || nautilus "$FAVORITES_DIR" 2>/dev/null || thunar "$FAVORITES_DIR" 2>/dev/null
                ;;
            "━━━━━━━━━━━━━━━━")
                # Separator - do nothing
                ;;
            *)
                if [[ "$selected" =~ 💖\ ([0-9]{4}-[0-9]{2}-[0-9]{2})\ ([0-9]{2}:[0-9]{2}:[0-9]{2}) ]]; then
                    # Extract date and time to find the file
                    date_part="${BASH_REMATCH[1]//-/}"
                    time_part="${BASH_REMATCH[2]//:}"
                    pattern="waifu_${date_part}_${time_part}.*"
                    
                    for file in "$FAVORITES_DIR"/$pattern; do
                        if [ -f "$file" ]; then
                            swww img "$file" --transition-type wipe --transition-duration 1
                            notify-send "💖 Favorite Applied" "Wallpaper set from favorites"
                            break
                        fi
                    done
                fi
                ;;
        esac
        ;;
    
    "menu")
        # Show favorites management menu
        options="💖 Save Current Wallpaper\n📋 Browse Favorites\n🗑️ Clear All Favorites\n📁 Open Favorites Folder"
        selected=$(echo -e "$options" | wofi --dmenu --prompt "Favorites Manager" --width 300 --height 200)
        
        case "$selected" in
            "💖 Save Current Wallpaper")
                bash "$0" save
                ;;
            "📋 Browse Favorites")
                bash "$0" list
                ;;
            "🗑️ Clear All Favorites")
                rm -f "$FAVORITES_DIR"/*
                notify-send "🗑️ Favorites Cleared" "All favorite wallpapers removed"
                ;;
            "📁 Open Favorites Folder")
                xdg-open "$FAVORITES_DIR" 2>/dev/null || nautilus "$FAVORITES_DIR" 2>/dev/null || thunar "$FAVORITES_DIR" 2>/dev/null
                ;;
        esac
        ;;
    
    *)
        echo "Usage: $0 {save|list|menu}"
        echo "  save - Save current wallpaper to favorites"
        echo "  list - List and select from favorites"
        echo "  menu - Show favorites management menu"
        ;;
esac