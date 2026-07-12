function assertKernel(file) {
  if (!file || typeof file !== 'string') {
    throw new Error('KERNEL VIOLATION: invalid path');
  }
  if (!file.includes('dist/')) {
    throw new Error('KERNEL VIOLATION: only dist allowed');
  }
}

module.exports = { assertKernel };
