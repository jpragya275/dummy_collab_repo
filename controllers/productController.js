const Product = require("../model/productSchema");
const APIfeatures = require("../utils/apiFeatures");

// Controller to get the products
exports.getAllProducts = async (req, res) => {
  try {
    // const products = await Products.find({});
    const features = new APIfeatures(Product.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const products = await features.query;
    res.status(200).json({
      status: "success",
      result: products.length,
      data: products,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",

      message: error,
    });
    console.log(error);
  }
};

// Controller to add a new product
exports.addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const response = await newProduct.save();
    res.status(201).json({
      status: "success",
      data: {
        product: newProduct,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};


// Get Cart Items
exports.getCartItems = async (req, res) => {
  try {
    const IDs = req.query.id.split(",");
    const cartItems = await Product.find({ _id: { $in: IDs } });
    res.status(200).send({
      status: "success",
      result: cartItems.length,
      data:cartItems
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};


// Get single item
exports.getSingleProduct = async(req, res) =>{
  try {
    const product = await Product.findById(req.params.id);
    
    res.status(200).send({ 
      status: 'success',
      result: product.length,
      data: product
    })
    // const product = await Product.findById()
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error
    })
  }
}

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body,{
      new:true,
      runValidators: true
    })

    res.status(202).json({
      status: 'success',
      data: product,
    })
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error
    })
  }
}

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(204).send({
      status: "success",
    })
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error
    })
  }
}
