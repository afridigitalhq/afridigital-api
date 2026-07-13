import ProductRepository from "../products/ProductRepository.js";

export function registerCommerceProductRoutes(app){

  app.get("/commerce/products",(req,res)=>{

    res.json({
      success:true,
      source:"AFRICOMMERCE",
      data:ProductRepository.list()
    });

  });


  app.get("/commerce/products/:id",(req,res)=>{

    const product = ProductRepository.find(req.params.id);

    if(!product){
      return res.status(404).json({
        success:false,
        message:"Product not found"
      });
    }

    res.json({
      success:true,
      data:product
    });

  });

}
