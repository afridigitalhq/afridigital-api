module.exports = async function get_time(){
  return {time: new Date().toISOString()};
};