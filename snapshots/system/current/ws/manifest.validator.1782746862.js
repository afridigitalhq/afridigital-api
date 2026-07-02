const REQUIRED = [
  "id",
  "name",
  "version",
  "type",
  "entry"
];

function validate(manifest) {
  const errors = [];

  for (const field of REQUIRED) {
    if (
      manifest[field] === undefined ||
      manifest[field] === null ||
      manifest[field] === ""
    ) {
      errors.push(`Missing field: ${field}`);
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    manifestId: manifest.id || null
  };
}

module.exports = {
  validate,
  REQUIRED
};
