#!/bin/bash

# Get search query from user via Rofi
query=$(rofi -dmenu -i -p "Search DuckDuckGo")

# If a query was entered, search DuckDuckGo using Brave
if [ -n "$query" ]; then
    # URL encode the query and construct the DuckDuckGo search URL
    encoded_query=$(echo "$query" | sed 's/ /+/g')
    brave "https://duckduckgo.com/?q=$encoded_query"
else
    echo "No search query entered"
fi
