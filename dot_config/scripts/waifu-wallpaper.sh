#!/bin/bash

# Waifu Wallpaper Fetcher & Rotator
# Fetches high-quality anime/waifu wallpapers from online APIs

# Configuration
WALLPAPER_DIR="$HOME/.cache/waifu-wallpapers"
CURRENT_WALLPAPER="$WALLPAPER_DIR/current.jpg"
MAX_CACHE_SIZE=50  # Maximum number of wallpapers to keep cached

# Create cache directory
mkdir -p "$WALLPAPER_DIR"

# Function to get screen resolution
get_resolution() {
    hyprctl monitors -j | jq -r '.[0] | "\(.width)x\(.height)"'
}

# Function to fetch waifu from waifu.pics API
fetch_waifu_pics() {
    local category=${1:-"waifu"}  # waifu, neko, shinobu, megumin, bully, cuddle, cry, hug, awoo, kiss, lick, pat, smug, bonk, yeet, blush, smile, wave, highfive, handhold, nom, bite, glomp, slap, kill, kick, happy, wink, poke, dance, cringe
    
    echo "🎌 Fetching waifu from waifu.pics..."
    local url=$(curl -s "https://api.waifu.pics/sfw/$category" | jq -r '.url')
    
    if [ "$url" != "null" ] && [ -n "$url" ]; then
        local filename="$WALLPAPER_DIR/waifu_$(date +%s).jpg"
        curl -s -o "$filename" "$url"
        echo "$filename"
    else
        echo ""
    fi
}

# Function to fetch from waifu.im API (higher quality)
fetch_waifu_im() {
    local tags=${1:-"waifu"}  # waifu, maid, uniform, selfies, etc.
    
    echo "🎨 Fetching HQ waifu from waifu.im..."
    local response=$(curl -s "https://api.waifu.im/search/?included_tags=$tags&height=>=1080")
    local url=$(echo "$response" | jq -r '.images[0].url // empty')
    
    if [ -n "$url" ]; then
        local filename="$WALLPAPER_DIR/hq_waifu_$(date +%s).jpg"
        curl -s -o "$filename" "$url"
        echo "$filename"
    else
        echo ""
    fi
}

# Function to fetch from Safebooru (anime image board)
fetch_safebooru() {
    local tags=${1:-"1girl solo highres"}
    
    echo "🌸 Fetching from Safebooru..."
    local response=$(curl -s "https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&limit=1&tags=$tags&pid=$(($RANDOM % 100))")
    local file_url=$(echo "$response" | jq -r '.[0].file_url // empty')
    
    if [ -n "$file_url" ]; then
        local filename="$WALLPAPER_DIR/safebooru_$(date +%s).jpg"
        curl -s -o "$filename" "https:$file_url"
        echo "$filename"
    else
        echo ""
    fi
}

# Function to fetch from Konachan (high quality anime wallpapers)
fetch_konachan() {
    local tags=${1:-"rating:safe"}
    
    echo "🎯 Fetching from Konachan..."
    local response=$(curl -s "https://konachan.com/post.json?limit=1&tags=$tags&page=$(($RANDOM % 100))")
    local file_url=$(echo "$response" | jq -r '.[0].file_url // empty')
    
    if [ -n "$file_url" ]; then
        local filename="$WALLPAPER_DIR/konachan_$(date +%s).jpg"
        curl -s -o "$filename" "$file_url"
        echo "$filename"
    else
        echo ""
    fi
}

# Function to clean old wallpapers
cleanup_cache() {
    local file_count=$(ls -1 "$WALLPAPER_DIR"/*.jpg 2>/dev/null | wc -l)
    
    if [ "$file_count" -gt "$MAX_CACHE_SIZE" ]; then
        echo "🧹 Cleaning old wallpapers..."
        ls -t "$WALLPAPER_DIR"/*.jpg | tail -n +$((MAX_CACHE_SIZE + 1)) | xargs rm -f
    fi
}

# Function to set wallpaper
set_wallpaper() {
    local wallpaper_file="$1"
    
    if [ -f "$wallpaper_file" ]; then
        # Copy to current wallpaper
        cp "$wallpaper_file" "$CURRENT_WALLPAPER"
        
        # Set with swww
        swww img "$CURRENT_WALLPAPER" --transition-type wipe --transition-duration 2
        
        # Add to history
        HISTORY_SCRIPT="$HOME/.config/wofi/waifu-history.sh"
        if [ -f "$HISTORY_SCRIPT" ]; then
            bash "$HISTORY_SCRIPT" add "$CURRENT_WALLPAPER"
        fi
        
        echo "✨ Wallpaper set: $(basename "$wallpaper_file")"
        
        # Send notification
        notify-send "🎌 Waifu Wallpaper" "New wallpaper applied!" --icon="$CURRENT_WALLPAPER"
    else
        echo "❌ Failed to set wallpaper"
    fi
}

# Function to get random wallpaper from cache
get_cached_wallpaper() {
    local cached_files=("$WALLPAPER_DIR"/*.jpg)
    
    if [ ${#cached_files[@]} -gt 0 ] && [ -f "${cached_files[0]}" ]; then
        local random_file=${cached_files[$RANDOM % ${#cached_files[@]}]}
        echo "$random_file"
    else
        echo ""
    fi
}

# Main function
main() {
    local source=${1:-"random"}
    local tags=${2:-""}
    
    case "$source" in
        "waifu-pics")
            wallpaper=$(fetch_waifu_pics "$tags")
            ;;
        "waifu-im")
            wallpaper=$(fetch_waifu_im "$tags")
            ;;
        "safebooru")
            wallpaper=$(fetch_safebooru "$tags")
            ;;
        "konachan")
            wallpaper=$(fetch_konachan "$tags")
            ;;
        "cached")
            wallpaper=$(get_cached_wallpaper)
            ;;
        "random"|*)
            # Try different sources randomly
            sources=("waifu-pics" "waifu-im" "safebooru" "konachan")
            random_source=${sources[$RANDOM % ${#sources[@]}]}
            wallpaper=$(fetch_$random_source "$tags")
            
            # Fallback to cached if online fetch fails
            if [ -z "$wallpaper" ] || [ ! -f "$wallpaper" ]; then
                echo "🔄 Online fetch failed, using cached wallpaper..."
                wallpaper=$(get_cached_wallpaper)
            fi
            ;;
    esac
    
    if [ -n "$wallpaper" ] && [ -f "$wallpaper" ]; then
        set_wallpaper "$wallpaper"
        cleanup_cache
    else
        echo "❌ Failed to fetch wallpaper"
        exit 1
    fi
}

# Help function
show_help() {
    echo "🎌 Waifu Wallpaper Fetcher"
    echo ""
    echo "Usage: $0 [source] [tags]"
    echo ""
    echo "Sources:"
    echo "  random      - Random source (default)"
    echo "  waifu-pics  - waifu.pics API"
    echo "  waifu-im    - waifu.im API (HQ)"
    echo "  safebooru   - Safebooru image board"
    echo "  konachan    - Konachan (HQ anime wallpapers)"
    echo "  cached      - Use cached wallpaper"
    echo ""
    echo "Examples:"
    echo "  $0                           # Random waifu"
    echo "  $0 waifu-im                  # HQ waifu from waifu.im"
    echo "  $0 safebooru \"1girl solo\"    # Specific tags from Safebooru"
    echo "  $0 konachan \"landscape\"      # Landscape from Konachan"
    echo ""
}

# Check arguments
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

# Run main function
main "$@"