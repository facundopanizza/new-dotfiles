#!/usr/bin/env bash

# Kill any existing swww processes first
pkill swww

# Initialize swww daemon
swww-daemon &

# Wait a moment for daemon to start
sleep 1

# Restore wallpaper
node ~/.config/scripts/restore-wallpaper.js

# Start other applications
nm-applet --indicator &

waybar &

mako &

hypridle &

hyprctl setcursor Bibata-Modern-Ice 24
