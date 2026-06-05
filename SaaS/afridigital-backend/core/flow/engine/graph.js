/**
 * FLOWGRAPH v1 - Graph Definition Layer
 */

const graph = {
  greetingFlow: {
    start: "greet",
    nodes: {
      greet: {
        run: async (ctx) => {
          return { message: "Hello from REAL FlowGraph 👋", next: "end" };
        }
      },
      end: {
        run: async (ctx) => {
          return { message: "Flow completed ✅", next: null };
        }
      }
    }
  },

  systemFlow: {
    start: "check",
    nodes: {
      check: {
        run: async (ctx) => {
          return { message: "System OK 🧠", next: "end" };
        }
      },
      end: {
        run: async () => {
          return { message: "Done", next: null };
        }
      }
    }
  }
};

module.exports = graph;
