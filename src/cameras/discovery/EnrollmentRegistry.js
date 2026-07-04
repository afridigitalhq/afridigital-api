const enrollments = new Map();

export function registerEnrollment(camera) {
  enrollments.set(camera.id, camera);
  return camera;
}

export function getEnrollment(id) {
  return enrollments.get(id) || null;
}

export function getAllEnrollments() {
  return Array.from(enrollments.values());
}

export function removeEnrollment(id) {
  return enrollments.delete(id);
}
