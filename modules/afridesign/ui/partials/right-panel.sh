#!/bin/bash
# Right panel partial - contains modes, studios, tools

render_right_panel() {
    echo -e "${DARK_BG}${WHITE}┌─────────────────────────────────────────────────────────────────────────────────┐${RESET}"
    echo -e "${DARK_BG}${WHITE}│  ${BOLD}☀️ Light${RESET}${DARK_BG}${GRAY}  🌙 Dark  💻 System                                        ${WHITE}│${RESET}"
    echo -e "${DARK_BG}${WHITE}│  ${DIM}─────────────────────────────────────────────────────────────────────${WHITE}│${RESET}"
    echo -e "${DARK_BG}${WHITE}│  ${GRAY}🌐 Web Studio     📱 App Studio     🎨 Graphics Studio     🎬 Video Studio${WHITE}│${RESET}"
    echo -e "${DARK_BG}${WHITE}│  ${DIM}─────────────────────────────────────────────────────────────────────${WHITE}│${RESET}"
    echo -e "${DARK_BG}${WHITE}│  ${DIM}QUICK TOOLS  🎯 Color Picker  🌈 Gradient  ⊞ Grid System  ⇔ Breakpoints  ⬡ Spacing  ✨ Effects${WHITE}│${RESET}"
    echo -e "${DARK_BG}${WHITE}└─────────────────────────────────────────────────────────────────────────────────┘${RESET}"
}
