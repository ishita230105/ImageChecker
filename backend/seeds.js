const mongoose = require("mongoose");
const Product = require("./model/product");
const { faker } = require("@faker-js/faker");

// Categories we will use for tags + Unsplash queries
const productCategories = [
  "shoe",
  "sneaker",
  "boot",
  "shirt",
  "t-shirt",
  "jeans",
  "pants",
  "jacket",
  "coat",
  "sweater",
  "hat",
  "bag",
  "backpack",
  "watch",
  "laptop",
  "computer",
  "phone",
  "keyboard",
  "mouse",
  "headphones",
  "camera",
  "television",
  "chair",
  "table",
  "sofa",
  "book",
  "car",
  "bicycle",
  "toy",
  "bottle",
  "cup",
];

mongoose
  .connect(
    "mongodb+srv://ishitamodi542_db_user:ishita2301@cluster542.novafqb.mongodb.net/products"
  )
  .then(async () => {
    console.log("MongoDB Connected");
    await Product.deleteMany();

    const products = [];
    for (let i = 0; i < 50; i++) {
      const category =
        productCategories[Math.floor(Math.random() * productCategories.length)];
      const productName = faker.commerce.productName();

      // ✅ Create realistic tags
      const tags = [category, faker.commerce.department().toLowerCase()];

      // ✅ Realistic product image from Unsplash (random each time)
      const imageUrl = `https://source.unsplash.com/400x400/?${category}`;

      products.push({
        name: `${productName} (${category})`,
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 100, max: 5000 }),
        image: imageUrl,
        tags: tags,
      });
    }

    await Product.insertMany(products);

    console.log("50 Products Seeded with Real Images");
    mongoose.connection.close();
  })
  .catch((err) => console.error("Error seeding DB:", err));
