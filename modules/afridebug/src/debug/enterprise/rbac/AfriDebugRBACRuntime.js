const roles=[];

const AfriDebugRBACRuntime={

  assign(input={}){

    const role={
      id:`ROLE-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      userId:input.userId||null,
      role:input.role||"Developer",
      assignedAt:Date.now()
    };

    roles.push(role);

    return role;

  },

  list(){ return roles; },

  stats(){ return { roles:roles.length }; }

};

export default AfriDebugRBACRuntime;
