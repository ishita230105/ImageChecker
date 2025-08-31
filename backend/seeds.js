const mongoose = require("mongoose");
const Product = require("./model/product");
const { faker } = require("@faker-js/faker");

const productCategories = [
  'shoe', 'sneaker', 'boot', 'shirt', 't-shirt', 'jeans', 'pants',
  'jacket', 'coat', 'sweater', 'hat', 'bag', 'backpack',
  'watch', 'laptop', 'computer', 'phone', 'keyboard', 'mouse',
  'headphones', 'camera', 'television', 'chair', 'table', 'sofa',
  'book', 'car', 'bicycle', 'toy', 'bottle', 'cup'
];

mongoose
  .connect(
    "mongodb+srv://ishitamodi542_db_user:ishita2301@cluster542.novafqb.mongodb.net/products"
  )
  .then(async () => {
    console.log("✅ MongoDB Connected");
    await Product.deleteMany();

    const products = [];
    for (let i = 0; i < 50; i++) {
      const category = productCategories[Math.floor(Math.random() * productCategories.length)];
      const productName = faker.commerce.productName();
      
      // ✅ CREATE TAGS that are guaranteed to match the Python script
      const tags = [
        category,
        faker.commerce.department().toLowerCase()
      ];

      products.push({
        name: `${productName} (${category})`,
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 100, max: 5000 }),
        image: `https://via.placeholder.com/150?text=${productName.split(" ").join("+")}`,
        tags: tags
      });
    }

    await Product.insertMany(products);

    console.log("✅ 50 Products Seeded with NEW Tags");
    mongoose.connection.close();
  })
  .catch((err) => console.error("❌ Error seeding DB:", err));