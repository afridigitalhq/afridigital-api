import { configureStore, createSlice } from "@reduxjs/toolkit";

const dagSlice = createSlice({
  name: "dag",
  initialState: {
    nodes: {},
    edges: [],
    timeline: [],
    replayIndex: 0
  },
  reducers: {
    applyEvent: (state, action) => {
      const e = action.payload;

      state.timeline.push(e);

      if (e.type === "NODE_UPDATE") {
        state.nodes[e.node] = e;
      }

      if (e.type === "EDGE_UPDATE") {
        state.edges.push(e);
      }
    },
    setReplayIndex: (state, action) => {
      state.replayIndex = action.payload;
    },
    reset: (state) => {
      state.nodes = {};
      state.edges = [];
    }
  }
});

export const { applyEvent, setReplayIndex, reset } = dagSlice.actions;

export const store = configureStore({
  reducer: {
    dag: dagSlice.reducer
  }
});
