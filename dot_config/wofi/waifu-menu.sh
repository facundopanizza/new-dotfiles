#!/bin/bash

# Waifu wallpaper menu for wofi

options="🎲 Random Waifu
🎌 Waifu.pics
🎨 Waifu.im (HQ)
🌸 Safebooru
🎯 Konachan
🎭 Danbooru
🌺 Gelbooru
🖼️ Picsum
📁 Cached
❤️ Favorites
📜 History"

selected=$(echo -e "$options" | wofi --dmenu --prompt "Waifu Wallpapers" --width 350 --height 400)

case "$selected" in
    "🎲 Random Waifu")
        node ~/.config/scripts/waifu-wallpaper.js random
        ;;
    "🎌 Waifu.pics")
        node ~/.config/scripts/waifu-wallpaper.js waifu-pics
        ;;
    "🎨 Waifu.im (HQ)")
        node ~/.config/scripts/waifu-wallpaper.js waifu-im
        ;;
    "🌸 Safebooru")
        node ~/.config/scripts/waifu-wallpaper.js safebooru
        ;;
    "🎯 Konachan")
        node ~/.config/scripts/waifu-wallpaper.js konachan
        ;;
    "🎭 Danbooru")
        node ~/.config/scripts/waifu-wallpaper.js danbooru
        ;;
    "🌺 Gelbooru")
        node ~/.config/scripts/waifu-wallpaper.js gelbooru
        ;;
    "🖼️ Picsum")
        node ~/.config/scripts/waifu-wallpaper.js picsum
        ;;
    "📁 Cached")
        node ~/.config/scripts/waifu-wallpaper.js cached
        ;;
    "❤️ Favorites")
        bash ~/.config/wofi/waifu-favorites.sh list
        ;;
    "📜 History")
        bash ~/.config/wofi/waifu-history.sh list
        ;;
esac