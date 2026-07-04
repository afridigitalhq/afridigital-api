const cameras = new Map();

export function registerCamera(camera) {
  cameras.set(camera.id, {
    ...camera,
    createdAt: Date.now()
  });

  return cameras.get(camera.id);
}

export function unregisterCamera(id) {
  return cameras.delete(id);
}

export function getCamera(id) {
  return cameras.get(id) || null;
}

export function getAllCameras() {
  return Array.from(cameras.values());
}

export function getCamerasByZone(zone) {
  return Array.from(cameras.values()).filter(
    (camera) => camera.zone === zone
  );
}
