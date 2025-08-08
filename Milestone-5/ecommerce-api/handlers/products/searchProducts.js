const connectToDatabase = require('../../db');
const Product = require('../../entities/product');

exports.handler = async (event) => {
  try {
    const { keywords, category, subcategory, minPrice, maxPrice } = event.queryStringParameters || {};
    await connectToDatabase(process.env.MONGODB_URI);

    let query = {};
    if (keywords) query.keywords = { $regex: keywords, $options: 'i' };
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const products = await Product.find(query);
    return { statusCode: 200, body: JSON.stringify(products) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};
