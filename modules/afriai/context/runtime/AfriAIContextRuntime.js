import AfriAIContextIdentity from "../identity/AfriAIContextIdentity.js";
import AfriAITenantContext from "../tenant/AfriAITenantContext.js";
import AfriAIExecutionContext from "../execution/AfriAIExecutionContext.js";
import AfriAIChannelContext from "../channel/AfriAIChannelContext.js";

const AfriAIContextRuntime = {

  build(request={}){

    return {

      channel:
        AfriAIChannelContext.create
          ? AfriAIChannelContext.create(request)
          : request.channel,

      identity:
        AfriAIContextIdentity.create
          ? AfriAIContextIdentity.create(request)
          : {},

      tenant:
        AfriAITenantContext.create
          ? AfriAITenantContext.create(request)
          : {},

      execution:
        AfriAIExecutionContext.create
          ? AfriAIExecutionContext.create(request)
          : {},

      createdAt:
        new Date().toISOString()

    };

  }

};

export default AfriAIContextRuntime;
