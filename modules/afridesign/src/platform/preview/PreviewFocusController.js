import PreviewStateManager from "./PreviewStateManager";

const PreviewFocusController = {
  current() {
    return PreviewStateManager.current();
  },

  back() {
    return PreviewStateManager.back();
  }
};

export default PreviewFocusController;
