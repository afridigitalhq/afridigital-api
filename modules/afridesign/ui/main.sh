#!/bin/bash
# Main UI - AfriDesign Studio
# This file assembles all UI partials

# Source color definitions first
source "$(dirname "$0")/partials/colors.sh"

# Source all UI partials
source "$(dirname "$0")/partials/header.sh"
source "$(dirname "$0")/partials/hero.sh"
source "$(dirname "$0")/partials/left-panel.sh"
source "$(dirname "$0")/partials/center-panel.sh"
source "$(dirname "$0")/partials/right-panel.sh"
source "$(dirname "$0")/partials/footer.sh"

# Main render function - assembles all partials
render_ui() {
    clear
    render_header
    echo ""
    render_hero
    echo ""
    render_left_panel
    echo ""
    render_center_panel
    echo ""
    render_right_panel
    echo ""
    render_footer
    echo ""
    echo -e "${DIM}Press any key to refresh... (Ctrl+C to exit)${RESET}"
}

# Interactive loop - no business logic, just UI refresh
render_ui
while true; do
    read -t 1 -n 1 key 2>/dev/null
    if [ $? = 0 ]; then
        render_ui
    fi
done
