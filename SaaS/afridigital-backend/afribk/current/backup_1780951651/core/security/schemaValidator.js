const Ajv = require('ajv');
const ajv = new Ajv();
module.exports = {
  validate(schema,data){
    const validate = ajv.compile(schema);
    return {
      ok: validate(data),
      errors: validate.errors || []
    };
  }
};
