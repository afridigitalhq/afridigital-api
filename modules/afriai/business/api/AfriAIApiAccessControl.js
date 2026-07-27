import AfriAIApiKeyRegistry from "./AfriAIApiKeyRegistry.js";

const AfriAIApiAccessControl = {

  authorize({
    key = "",
    permission = ""
  } = {}){

    const apiKey =
      AfriAIApiKeyRegistry.get(
        key
      );


    if(!apiKey){

      return {
        allowed:false,
        reason:"API_KEY_NOT_FOUND"
      };

    }


    if(apiKey.status !== "ACTIVE"){

      return {
        allowed:false,
        reason:"API_KEY_INACTIVE"
      };

    }


    const allowed =
      apiKey.permissions.includes(
        permission
      );


    return {

      allowed,

      reason: allowed
        ? "ACCESS_GRANTED"
        : "PERMISSION_DENIED",

      tenantId:apiKey.tenantId

    };

  }

};


export default AfriAIApiAccessControl;
