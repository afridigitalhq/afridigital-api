import PreviewStateManager from "./PreviewStateManager";

const PreviewGalleryController = {
  open(project) {
    return PreviewStateManager.open(project);
  },

  selectDevice(device) {
    return PreviewStateManager.focus(device);
  },

  current() {
    return PreviewStateManager.current();
  }
};

export default PreviewGalleryController;
