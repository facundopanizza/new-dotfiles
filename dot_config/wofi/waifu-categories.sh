#!/bin/bash

# Waifu Categories Submenu
SCRIPT_DIR="$(dirname "$0")/../scripts"
WAIFU_SCRIPT="node $SCRIPT_DIR/waifu-wallpaper.js"

# Get category from argument
category="$1"

case "$category" in
    "anime")
        options="🎌 Random Anime Girl\n🌸 School Girl\n💫 Magical Girl\n🗡️ Sword Girl\n🎭 Cosplay\n🌙 Night Scene\n🌺 Spring Theme\n❄️ Winter Theme"
        ;;
    "style")
        options="🎨 Minimalist\n🌈 Colorful\n🖤 Dark/Gothic\n🌸 Pastel\n✨ Glowing Effects\n🎯 High Contrast\n🌊 Blue Theme\n🔥 Red Theme"
        ;;
    "quality")
        options="🎯 Ultra HQ (Konachan)\n🎨 HQ Illustrations\n📱 Mobile Optimized\n🖥️ Desktop 4K\n🎪 Artistic Style\n📸 Photo-realistic"
        ;;
    "special")
        options="💝 Maid Outfits\n📱 Neko Girls\n🦊 Fox Girls\n👑 Princess Style\n🏫 School Uniform\n🌙 Pajama/Sleepwear"
        ;;
    *)
        echo "Invalid category"
        exit 1
        ;;
esac

# Show submenu
selected=$(echo -e "$options" | wofi --dmenu --prompt "Select $category" --width 300 --height 350)

case "$selected" in
    # Anime category
    "🎌 Random Anime Girl")
        "$WAIFU_SCRIPT" random
        ;;
    "🌸 School Girl")
        "$WAIFU_SCRIPT" safebooru "1girl school_uniform highres"
        ;;
    "💫 Magical Girl")
        "$WAIFU_SCRIPT" safebooru "1girl magical_girl staff highres"
        ;;
    "🗡️ Sword Girl")
        "$WAIFU_SCRIPT" konachan "rating:safe sword weapon 1girl"
        ;;
    "🎭 Cosplay")
        "$WAIFU_SCRIPT" safebooru "1girl cosplay highres"
        ;;
    "🌙 Night Scene")
        "$WAIFU_SCRIPT" konachan "rating:safe night moon 1girl"
        ;;
    "🌺 Spring Theme")
        "$WAIFU_SCRIPT" konachan "rating:safe cherry_blossoms spring 1girl"
        ;;
    "❄️ Winter Theme")
        "$WAIFU_SCRIPT" konachan "rating:safe snow winter 1girl"
        ;;
    
    # Style category
    "🎨 Minimalist")
        "$WAIFU_SCRIPT" konachan "rating:safe simple_background 1girl"
        ;;
    "🌈 Colorful")
        "$WAIFU_SCRIPT" safebooru "1girl colorful vibrant highres"
        ;;
    "🖤 Dark/Gothic")
        "$WAIFU_SCRIPT" safebooru "1girl dark gothic black highres"
        ;;
    "🌸 Pastel")
        "$WAIFU_SCRIPT" konachan "rating:safe pastel soft_colors 1girl"
        ;;
    "✨ Glowing Effects")
        "$WAIFU_SCRIPT" konachan "rating:safe glowing light_effects 1girl"
        ;;
    "🎯 High Contrast")
        "$WAIFU_SCRIPT" safebooru "1girl high_contrast dramatic_lighting highres"
        ;;
    "🌊 Blue Theme")
        "$WAIFU_SCRIPT" konachan "rating:safe blue blue_hair blue_eyes 1girl"
        ;;
    "🔥 Red Theme")
        "$WAIFU_SCRIPT" konachan "rating:safe red red_hair red_eyes 1girl"
        ;;
    
    # Quality category
    "🎯 Ultra HQ (Konachan)")
        "$WAIFU_SCRIPT" konachan "rating:safe width:>=1920 height:>=1080"
        ;;
    "🎨 HQ Illustrations")
        "$WAIFU_SCRIPT" waifu-im
        ;;
    "📱 Mobile Optimized")
        "$WAIFU_SCRIPT" safebooru "1girl portrait vertical highres"
        ;;
    "🖥️ Desktop 4K")
        "$WAIFU_SCRIPT" konachan "rating:safe width:>=3840"
        ;;
    "🎪 Artistic Style")
        "$WAIFU_SCRIPT" safebooru "1girl artistic painting_style highres"
        ;;
    "📸 Photo-realistic")
        "$WAIFU_SCRIPT" safebooru "1girl realistic photorealistic highres"
        ;;
    
    # Special category
    "💝 Maid Outfits")
        "$WAIFU_SCRIPT" waifu-im maid
        ;;
    "📱 Neko Girls")
        "$WAIFU_SCRIPT" waifu-pics neko
        ;;
    "🦊 Fox Girls")
        "$WAIFU_SCRIPT" safebooru "1girl fox_ears fox_tail highres"
        ;;
    "👑 Princess Style")
        "$WAIFU_SCRIPT" safebooru "1girl princess dress crown highres"
        ;;
    "🏫 School Uniform")
        "$WAIFU_SCRIPT" safebooru "1girl school_uniform serafuku highres"
        ;;
    "🌙 Pajama/Sleepwear")
        "$WAIFU_SCRIPT" safebooru "1girl pajamas sleepwear nightgown highres"
        ;;
    
    *)
        echo "No option selected"
        ;;
esac