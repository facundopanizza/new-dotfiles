#!/bin/bash

# Waifu Wallpaper History Manager
HISTORY_FILE="$HOME/.config/waifu-history.txt"
CACHE_DIR="$HOME/.cache/waifu-wallpapers"

action="$1"

case "$action" in
    "add")
        # Add current wallpaper to history
        wallpaper_path="$2"
        if [ -n "$wallpaper_path" ] && [ -f "$wallpaper_path" ]; then
            timestamp=$(date '+%Y-%m-%d %H:%M:%S')
            echo "$timestamp|$wallpaper_path" >> "$HISTORY_FILE"
            
            # Keep only last 50 entries
            tail -n 50 "$HISTORY_FILE" > "${HISTORY_FILE}.tmp" && mv "${HISTORY_FILE}.tmp" "$HISTORY_FILE"
        fi
        ;;
    
    "list")
        # Show history menu
        if [ ! -f "$HISTORY_FILE" ]; then
            notify-send "📜 History" "No wallpaper history found"
            exit 0
        fi
        
        # Create menu from history (newest first)
        history_menu=""
        while IFS='|' read -r timestamp path; do
            if [ -f "$path" ]; then
                basename_file=$(basename "$path")
                # Truncate long filenames
                if [ ${#basename_file} -gt 30 ]; then
                    display_name="${basename_file:0:27}..."
                else
                    display_name="$basename_file"
                fi
                history_menu="📜 $timestamp - $display_name\n$history_menu"
            fi
        done < <(tac "$HISTORY_FILE")
        
        # Add management options
        history_menu="$history_menu━━━━━━━━━━━━━━━━\n🗑️ Clear History"
        
        selected=$(echo -e "$history_menu" | wofi --dmenu --prompt "Wallpaper History" --width 500 --height 400)
        
        case "$selected" in
            "🗑️ Clear History")
                rm -f "$HISTORY_FILE"
                notify-send "🗑️ History Cleared" "Wallpaper history cleared"
                ;;
            "━━━━━━━━━━━━━━━━")
                # Separator - do nothing
                ;;
            *)
                if [[ "$selected" =~ 📜\ ([0-9]{4}-[0-9]{2}-[0-9]{2}\ [0-9]{2}:[0-9]{2}:[0-9]{2})\ -\ (.+) ]]; then
                    timestamp="${BASH_REMATCH[1]}"
                    # Find the full path from history file
                    while IFS='|' read -r hist_timestamp hist_path; do
                        if [ "$hist_timestamp" = "$timestamp" ] && [ -f "$hist_path" ]; then
                            swww img "$hist_path" --transition-type wipe --transition-duration 1
                            notify-send "📜 History Applied" "Wallpaper restored from history"
                            # Add to history again (move to top)
                            bash "$0" add "$hist_path"
                            break
                        fi
                    done < "$HISTORY_FILE"
                fi
                ;;
        esac
        ;;
    
    *)
        echo "Usage: $0 {add|list}"
        echo "  add <path> - Add wallpaper to history"
        echo "  list - Show and select from history"
        ;;
esac