#!/bin/bash

# Window switcher for fullscreen windows on current workspace
# Get current workspace
current_workspace=$(hyprctl activeworkspace -j | jq -r '.id')

# Get all windows on current workspace that are fullscreen
windows=$(hyprctl clients -j | jq -r --arg workspace "$current_workspace" '
    .[] | 
    select(.workspace.id == ($workspace | tonumber) and .fullscreen == true) |
    "\(.title) - \(.class) [\(.address)]"
')

if [ -z "$windows" ]; then
    notify-send "Window Switcher" "No fullscreen windows on current workspace"
    exit 0
fi

# Show window selection menu
selected=$(echo "$windows" | wofi --dmenu --prompt "Switch to Window" --width 600 --height 300)

if [ -n "$selected" ]; then
    # Extract window address from selection
    address=$(echo "$selected" | grep -o '\[0x[^]]*\]' | tr -d '[]')
    
    if [ -n "$address" ]; then
        # Focus the selected window
        hyprctl dispatch focuswindow "address:$address"
    fi
fi