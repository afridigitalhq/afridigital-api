const CoreChangeTracker={
 track(change){
  return {
   change,
   status:"TRACKED",
   timestamp:new Date().toISOString()
  };
 }
};

export default CoreChangeTracker;
