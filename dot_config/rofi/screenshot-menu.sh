#!/bin/bash

# Define the options
options="Screen\nWindow\nRegion"

# Display the Rofi menu and get the chosen option
chosen=$(echo -e "$options" | rofi -dmenu -i -p "Choose the type of Screenshot:")

# Execute a command based on the chosen option
case $chosen in
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
        # In case of an invalid option or canceling
        echo "No valid option chosen"
        ;;
esac

