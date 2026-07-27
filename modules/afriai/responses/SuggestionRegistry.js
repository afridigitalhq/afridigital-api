export const SuggestionRegistry = {

  products: [

    {
      id: "AfriCommerce",
      type: "product",
      title: "AfriCommerce",
      description: "Marketplace for buying and selling across Africa.",
      status: "Beta",
      availability: "showcase",
      action: "preview_product",
      route: "/commerce"
    },

    {
      id: "AfriDesign Studio",
      type: "studio",
      title: "AfriDesign Studio",
      description: "Creative development platform with AI-powered studios.",
      status: "Active Development",
      availability: "preview",
      action: "request_access",
      route: "/design-studio"
    },

    {
      id: "AfriCCTV",
      type: "product",
      title: "AfriCCTV",
      description: "AI-powered surveillance and security platform.",
      status: "Active Development",
      availability: "showcase",
      action: "preview_product",
      route: "/cctv"
    },

    {
      id: "AfriBoost",
      type: "product",
      title: "AfriBoost",
      description: "Advertising and business promotion platform.",
      status: "Under Development",
      availability: "coming_soon",
      action: "notify_launch",
      route: "/boost"
    },

    {
      id: "AfriWork",
      type: "product",
      title: "AfriWork",
      description: "Jobs, hiring and freelance opportunities.",
      status: "Under Development",
      availability: "coming_soon",
      action: "notify_launch",
      route: "/work"
    }

  ]

};

export default SuggestionRegistry;
