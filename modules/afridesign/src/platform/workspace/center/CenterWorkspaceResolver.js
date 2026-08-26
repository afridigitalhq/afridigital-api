const WORKSPACES = {
  design: { id: "design", type: "design" },
  code: { id: "code", type: "code" },
  preview: { id: "preview", type: "preview" },
  mobile: { id: "mobile", type: "mobile" },
  terminal: { id: "terminal", type: "terminal" }
};

const CenterWorkspaceResolver = {
  resolve(mode = "design") {
    return WORKSPACES[mode] || WORKSPACES.design;
  }
};

export default CenterWorkspaceResolver;
