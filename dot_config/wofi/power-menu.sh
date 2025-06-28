#!/bin/bash

# Power menu using Wofi
# Define power options
options="⏻ Shutdown\n🔄 Reboot\n🔒 Lock\n😴 Suspend\n🚪 Logout\n❄️ Hibernate"

# Show menu and get selection
selected=$(echo -e "$options" | wofi --dmenu --prompt "Power Menu" --width 250 --height 220)

case "$selected" in
    "⏻ Shutdown")
        systemctl poweroff
        ;;
    "🔄 Reboot")
        systemctl reboot
        ;;
    "🔒 Lock")
        hyprlock
        ;;
    "😴 Suspend")
        systemctl suspend
        ;;
    "🚪 Logout")
        hyprctl dispatch exit
        ;;
    "❄️ Hibernate")
        systemctl hibernate
        ;;
    *)
        echo "No option selected"
        ;;
esac