#!/bin/bash

# AfriDesign Studio - Terminal UI
# Dark theme design tool interface

# Colors - Dark theme (no blue, neutral dark)
BLACK='\033[0;30m'
DARK_GRAY='\033[1;30m'
GRAY='\033[0;37m'
WHITE='\033[1;37m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
LIGHT_GRAY='\033[0;37m'
DARK_BG='\033[48;5;235m'
RESET='\033[0m'
BOLD='\033[1m'
DIM='\033[2m'

# Clear screen
clear

# Header with time
echo -e "${DARK_BG}${WHITE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${DARK_BG}${GRAY}  ⏰ 6:28  ${WHITE}RECENT  ${DIM}▶${RESET} ${WHITE}AfriDigital Landing  ${DIM}●${RESET} ${WHITE}E-commerce App  ${DIM}●${RESET} ${WHITE}Brand Identity Design${RESET}"
echo -e "${DARK_BG}${GRAY}  ASSETS  ${WHITE}🖼️ Images  ${WHITE}🎨 Icons${RESET}"
echo -e "${DARK_BG}${GRAY}  QUICK TOOLS  ${WHITE}🎯 Color Picker  ${WHITE}🌈 Gradient  ${WHITE}⊞ Grid System  ${WHITE}⇔ Breakpoints  ${WHITE}⬡ Spacing  ${WHITE}✨ Effects${RESET}"
echo -e "${DARK_BG}${CYAN}  🤖 AfriAI  ${WHITE}👋 Hello! How can I help?  🚀 Create landing  🎨 Generate UI  ✨ Improve design${RESET}"
echo -e "${DARK_BG}${WHITE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

# Main 3-column layout
echo -e "${DARK_BG}${WHITE}┌─────────────────────────────────────────────────────────────────────────────────┐${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${BOLD}☰ MENU${RESET}${DARK_BG}${GRAY}                                                              ${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${GRAY}📁 AfriDigital Landing                                                    ${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${GRAY}🛒 E-commerce App                                                        ${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${GRAY}✒️ Brand Identity Design                                                 ${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${DIM}─────────────────────────────────────────────────────────────────────${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${DIM}ASSETS                                                                  ${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${GRAY}🖼️ Images                                                               ${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${GRAY}🎨 Icons                                                               ${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${DIM}─────────────────────────────────────────────────────────────────────${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${DIM}QUICK TOOLS                                                            ${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${GRAY}🎯 Color Picker                                                       ${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${GRAY}🌈 Gradient                                                           ${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${GRAY}⊞ Grid System                                                         ${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${GRAY}⇔ Breakpoints                                                         ${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${GRAY}⬡ Spacing                                                            ${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${GRAY}✨ Effects                                                            ${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}└─────────────────────────────────────────────────────────────────────────────────┘${RESET}"

echo ""

# Center panel - Canvas area
echo -e "${DARK_BG}${WHITE}┌─────────────────────────────────────────────────────────────────────────────────┐${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${DIM}📁 AfriDesign Studio v2.0  ⚡ LOCALHOST:5173                              ${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${DIM}─────────────────────────────────────────────────────────────────────${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│                                                                                 │${RESET}"
echo -e "${DARK_BG}${WHITE}│                          ${DIM}⛔ canvas · bored${WHITE}                             │${RESET}"
echo -e "${DARK_BG}${WHITE}│                                                                                 │${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${DIM}─────────────────────────────────────────────────────────────────────${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${DIM}QUICK TOOLS  🎯 Color Picker  🌈 Gradient  ⊞ Grid  ⇔ Breakpoints  ⬡ Spacing  ✨ Effects${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}└─────────────────────────────────────────────────────────────────────────────────┘${RESET}"

echo ""

# Right panel
echo -e "${DARK_BG}${WHITE}┌─────────────────────────────────────────────────────────────────────────────────┐${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${BOLD}☀️ Light${RESET}${DARK_BG}${GRAY}  🌙 Dark  💻 System                                        ${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${DIM}─────────────────────────────────────────────────────────────────────${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${GRAY}🌐 Web Studio     📱 App Studio     🎨 Graphics Studio     🎬 Video Studio${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${DIM}─────────────────────────────────────────────────────────────────────${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${DIM}QUICK TOOLS  🎯 Color Picker  🌈 Gradient  ⊞ Grid System  ⇔ Breakpoints  ⬡ Spacing  ✨ Effects${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${DIM}─────────────────────────────────────────────────────────────────────${WHITE}│${RESET}"
echo -e "${DARK_BG}${CYAN}│  🤖 AfriAI · Hello! How can I help?                                          ${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}│  ${GRAY}🚀 Create landing  🎨 Generate UI  ✨ Improve design                   ${WHITE}│${RESET}"
echo -e "${DARK_BG}${WHITE}└─────────────────────────────────────────────────────────────────────────────────┘${RESET}"

echo ""

# Bottom bar
echo -e "${DARK_BG}${WHITE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${DARK_BG}${YELLOW}  👑 AfriAI PRO${RESET}${DARK_BG}${GRAY}  QUICK TOOLS  🎯 Color Picker  🌈 Gradient  ⊞ Grid System  ⇔ Breakpoints  ⬡ Spacing  ✨ Effects${RESET}"
echo -e "${DARK_BG}${CYAN}  🤖 AfriAI${RESET}${DARK_BG}${WHITE}  👋 Hello! How can I help?  🚀 Create landing  🎨 Generate UI  ✨ Improve design${RESET}"
echo -e "${DARK_BG}${WHITE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"

echo ""
echo -e "${DIM}Press any key to interact... (Ctrl+C to exit)${RESET}"

# Interactive loop
while true; do
    read -t 1 -n 1 key 2>/dev/null
    if [ $? = 0 ]; then
        clear
        # Re-display the interface (refresh)
        echo -e "${DARK_BG}${WHITE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
        echo -e "${DARK_BG}${GRAY}  ⏰ $(date +%H:%M)  ${WHITE}RECENT  ${DIM}▶${RESET} ${WHITE}AfriDigital Landing  ${DIM}●${RESET} ${WHITE}E-commerce App  ${DIM}●${RESET} ${WHITE}Brand Identity Design${RESET}"
        echo -e "${DARK_BG}${GRAY}  ASSETS  ${WHITE}🖼️ Images  ${WHITE}🎨 Icons${RESET}"
        echo -e "${DARK_BG}${GRAY}  QUICK TOOLS  ${WHITE}🎯 Color Picker  ${WHITE}🌈 Gradient  ${WHITE}⊞ Grid System  ${WHITE}⇔ Breakpoints  ${WHITE}⬡ Spacing  ${WHITE}✨ Effects${RESET}"
        echo -e "${DARK_BG}${CYAN}  🤖 AfriAI  ${WHITE}👋 Hello! How can I help?  🚀 Create landing  🎨 Generate UI  ✨ Improve design${RESET}"
        echo -e "${DARK_BG}${WHITE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
        echo ""
        echo -e "${DARK_BG}${WHITE}┌─────────────────────────────────────────────────────────────────────────────────┐${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${BOLD}☰ MENU${RESET}${DARK_BG}${GRAY}                                                              ${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${GRAY}📁 AfriDigital Landing                                                    ${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${GRAY}🛒 E-commerce App                                                        ${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${GRAY}✒️ Brand Identity Design                                                 ${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${DIM}─────────────────────────────────────────────────────────────────────${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${DIM}ASSETS                                                                  ${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${GRAY}🖼️ Images                                                               ${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${GRAY}🎨 Icons                                                               ${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${DIM}─────────────────────────────────────────────────────────────────────${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${DIM}QUICK TOOLS                                                            ${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${GRAY}🎯 Color Picker                                                       ${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${GRAY}🌈 Gradient                                                           ${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${GRAY}⊞ Grid System                                                         ${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${GRAY}⇔ Breakpoints                                                         ${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${GRAY}⬡ Spacing                                                            ${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${GRAY}✨ Effects                                                            ${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}└─────────────────────────────────────────────────────────────────────────────────┘${RESET}"
        echo ""
        echo -e "${DARK_BG}${WHITE}┌─────────────────────────────────────────────────────────────────────────────────┐${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${DIM}📁 AfriDesign Studio v2.0  ⚡ LOCALHOST:5173                              ${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${DIM}─────────────────────────────────────────────────────────────────────${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│                                                                                 │${RESET}"
        echo -e "${DARK_BG}${WHITE}│                          ${DIM}⛔ canvas · bored${WHITE}                             │${RESET}"
        echo -e "${DARK_BG}${WHITE}│                                                                                 │${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${DIM}─────────────────────────────────────────────────────────────────────${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${DIM}QUICK TOOLS  🎯 Color Picker  🌈 Gradient  ⊞ Grid  ⇔ Breakpoints  ⬡ Spacing  ✨ Effects${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}└─────────────────────────────────────────────────────────────────────────────────┘${RESET}"
        echo ""
        echo -e "${DARK_BG}${WHITE}┌─────────────────────────────────────────────────────────────────────────────────┐${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${BOLD}☀️ Light${RESET}${DARK_BG}${GRAY}  🌙 Dark  💻 System                                        ${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${DIM}─────────────────────────────────────────────────────────────────────${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${GRAY}🌐 Web Studio     📱 App Studio     🎨 Graphics Studio     🎬 Video Studio${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${DIM}─────────────────────────────────────────────────────────────────────${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${DIM}QUICK TOOLS  🎯 Color Picker  🌈 Gradient  ⊞ Grid System  ⇔ Breakpoints  ⬡ Spacing  ✨ Effects${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${DIM}─────────────────────────────────────────────────────────────────────${WHITE}│${RESET}"
        echo -e "${DARK_BG}${CYAN}│  🤖 AfriAI · Hello! How can I help?                                          ${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}│  ${GRAY}🚀 Create landing  🎨 Generate UI  ✨ Improve design                   ${WHITE}│${RESET}"
        echo -e "${DARK_BG}${WHITE}└─────────────────────────────────────────────────────────────────────────────────┘${RESET}"
        echo ""
        echo -e "${DARK_BG}${WHITE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
        echo -e "${DARK_BG}${YELLOW}  👑 AfriAI PRO${RESET}${DARK_BG}${GRAY}  QUICK TOOLS  🎯 Color Picker  🌈 Gradient  ⊞ Grid System  ⇔ Breakpoints  ⬡ Spacing  ✨ Effects${RESET}"
        echo -e "${DARK_BG}${CYAN}  🤖 AfriAI${RESET}${DARK_BG}${WHITE}  👋 Hello! How can I help?  🚀 Create landing  🎨 Generate UI  ✨ Improve design${RESET}"
        echo -e "${DARK_BG}${WHITE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
        echo ""
        echo -e "${DIM}Press any key to refresh... (Ctrl+C to exit)${RESET}"
    fi
done
