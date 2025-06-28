#!/bin/bash

# DuckDuckGo search menu using Wofi
# Get search query from user via Wofi
query=$(echo "" | wofi --dmenu --prompt "Search DuckDuckGo" --width 500 --height 200)

# If a query was entered, search DuckDuckGo using default browser
if [ -n "$query" ]; then
    # URL encode the query and construct the DuckDuckGo search URL
    encoded_query=$(echo "$query" | sed 's/ /+/g')
    xdg-open "https://duckduckgo.com/?q=$encoded_query"
else
    echo "No search query entered"
fi