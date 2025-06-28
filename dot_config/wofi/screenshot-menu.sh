#!/bin/bash

# Screenshot menu using Wofi - Fixed to use hyprshot like original
# Define screenshot options (keeping it simple like the original)
options="Screen\nWindow\nRegion"

# Show menu and get selection
selected=$(echo -e "$options" | wofi --dmenu --prompt "Choose the type of Screenshot:" --width 400 --height 200)

# Execute command based on selection (using original hyprshot commands)
case "$selected" in
    "Screen")
        hyprshot -m output
        ;;
    "Window")
        hyprshot -m window
        ;;
    "Region")
        hyprshot -m region
        ;;
    *)
        echo "No valid option chosen"
        ;;
esac