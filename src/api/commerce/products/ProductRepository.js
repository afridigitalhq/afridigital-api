const products = [];

export default {

  add(product){
    products.push(product);
    return product;
  },

  list(){
    return products;
  },

  find(id){
    return products.find(product => product.id === id);
  }

};
