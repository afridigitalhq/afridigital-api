#!/bin/bash
# Header partial - contains top bar with time, recent, assets, tools

render_header() {
    echo -e "${DARK_BG}${WHITE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo -e "${DARK_BG}${GRAY}  ⏰ $(date +%H:%M)  ${WHITE}RECENT  ${DIM}▶${RESET} ${WHITE}AfriDigital Landing  ${DIM}●${RESET} ${WHITE}E-commerce App  ${DIM}●${RESET} ${WHITE}Brand Identity Design${RESET}"
    echo -e "${DARK_BG}${GRAY}  ASSETS  ${WHITE}🖼️ Images  ${WHITE}🎨 Icons${RESET}"
    echo -e "${DARK_BG}${GRAY}  QUICK TOOLS  ${WHITE}🎯 Color Picker  ${WHITE}🌈 Gradient  ${WHITE}⊞ Grid System  ${WHITE}⇔ Breakpoints  ${WHITE}⬡ Spacing  ${WHITE}✨ Effects${RESET}"
    echo -e "${DARK_BG}${WHITE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
}
