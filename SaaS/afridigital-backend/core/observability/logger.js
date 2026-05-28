module.exports = {
  info(data){
    console.log(JSON.stringify({ level:'info', ...data }));
  },
  error(data){
    console.error(JSON.stringify({ level:'error', ...data }));
  }
};
