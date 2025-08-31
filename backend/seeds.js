const mongoose = require("mongoose");
const Product = require("./model/product");
const { faker } = require("@faker-js/faker");

mongoose
  .connect(
    "mongodb+srv://ishitamodi542_db_user:ishita2301@cluster542.novafqb.mongodb.net/products"
  )
  .then(async () => {
    console.log("✅ MongoDB Connected");

    // Clear old products
    await Product.deleteMany();

    // Generate 50 fake products
    const products = [];
    for (let i = 0; i < 50; i++) {
      products.push({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 100, max: 5000 }),
        image: `https://via.placeholder.com/150?text=${faker.commerce.productName().split(" ").join("+")}`,
      });
    }

    await Product.insertMany(products);

    console.log("✅ 50 Products Seeded");
    mongoose.connection.close();
  })
  .catch((err) => console.error("❌ Error seeding DB:", err));
