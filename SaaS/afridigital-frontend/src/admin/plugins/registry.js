import GraphPage from "../pages/GraphPage";

export const plugins = [
  {
    id: "graph",
    label: "Live Graph",
    route: "/admin/graph",
    component: GraphPage
  },

  {
    id: "traces",
    label: "Traces",
    route: "/admin/traces",
    component: () => null
  },

  {
    id: "metrics",
    label: "Metrics",
    route: "/admin/metrics",
    component: () => null
  },

  {
    id: "store",
    label: "Afri Store",
    route: "/admin/store",
    component: () => null
  }
];
