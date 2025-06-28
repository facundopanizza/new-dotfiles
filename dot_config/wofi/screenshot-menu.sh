#!/bin/bash

# Screenshot menu using Wofi
# Define screenshot options
options="󰹑 Fullscreen\n󰩭 Select Area\n󰖯 Current Window\n󰍹 Select Window\n⏱️ Fullscreen (5s delay)\n📱 Select Area (5s delay)"

# Show menu and get selection
selected=$(echo -e "$options" | wofi --dmenu --prompt "Screenshot" --width 300 --height 250)

# Create screenshots directory if it doesn't exist
mkdir -p ~/Pictures/Screenshots

# Get timestamp for filename
timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
filename="$HOME/Pictures/Screenshots/screenshot_$timestamp.png"

case "$selected" in
    "󰹑 Fullscreen")
        grimblast --notify copy output
        grimblast --notify save output "$filename"
        ;;
    "󰩭 Select Area")
        grimblast --notify copy area
        grimblast --notify save area "$filename"
        ;;
    "󰖯 Current Window")
        grimblast --notify copy active
        grimblast --notify save active "$filename"
        ;;
    "󰍹 Select Window")
        grimblast --notify copy window
        grimblast --notify save window "$filename"
        ;;
    "⏱️ Fullscreen (5s delay)")
        sleep 5
        grimblast --notify copy output
        grimblast --notify save output "$filename"
        ;;
    "📱 Select Area (5s delay)")
        sleep 5
        grimblast --notify copy area
        grimblast --notify save area "$filename"
        ;;
    *)
        echo "No option selected"
        ;;
esac