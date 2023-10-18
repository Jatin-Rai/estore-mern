import asyncHandler from '../middleware/asyncHandler.js'

import Product from '../models/productModel.js'


//@desc Fetch all products
//@route GET /api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    // throw new Error("Some Error")
    res.json(products);
});

//@desc Create a product
//@route POST /api/products
//@access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = await Product({
        name: 'Sample Name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample Brand',
        category: 'Sample Category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample Description'
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

//@desc Update a product
//@route PUT /api/products/:id
//@access Private/admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updateProduct = await product.save();
        res.json(updateProduct);
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
});

//@desc Delete a product
//@route DELETE /api/products/:id
//@access Private/admin
const deleteProduct = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.status(200).json({ message: 'Product deleted' });
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
});


//@desc Fetch a product
//@route GET /api/products/:id
//@access Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        return res.json(product)
    }
    res.status(404);
    throw new Error('Resource not found');
});


//@desc Create a product review
//@route POST /api/products/:id/reviews
//@access Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);
    if (product) {
        const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString());

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

        await product.save();

        res.status(201).json({ message: 'Review added' })

    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
});


export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview
};