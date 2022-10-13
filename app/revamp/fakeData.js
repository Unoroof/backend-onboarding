var dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: 12345,
    database: "backend_onboarding",
    dialect: "postgres",
  },
});

const { faker } = require("@faker-js/faker");

const numberOfCategories = 7;
const numberOfProductsPerCategory = 300;

const createCategories = async (n) => {
  const categories = [];

  for (let i = 0; i < n; i++) {
    let obj = {
      uuid: faker.datatype.uuid(),
      name: `${faker.helpers.arrayElement([
        "Pharma",
        "Rubber",
        "Automobiles",
        "Chemicals and dyes",
        "Textiles",
        "others",
        "Plastics and PVC Polymers",
      ])}_${Math.ceil(Math.random() * 100)}`,
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    };
    categories.push(obj);
    await knex("gm_categories").insert(obj);
  }
  return categories;
};

const createProducts = async (n) => {
  const products = [];

  for (let j = 0; j < n; j++) {
    const product_name = faker.commerce.product();
    const brand_name = faker.name.fullName();

    let productObj = {
      uuid: faker.datatype.uuid(),
      profile_uuid: "2432b36c-5f9a-4849-990a-cca03a7f9816",
      name: product_name,
      brand_name: brand_name,
      price: {
        unit: "",
        amount: "",
        currency: "",
      },
      discount: {},
      data: {
        unit: {
          label: "",
          value: "",
        },
        category: {},
        logistics: {
          india: {
            delivery: true,
            exceptions: [],
          },
          international: {
            delivery: true,
            exceptions: [],
          },
          logistic_support_from_buyer: true,
        },
        prefer_lc: "",
        brand_name: brand_name,
        exceptions: [],
        negotiable: "",
        input_price: "",
        product_name: product_name,
        cd_seven_days: "",
        currency_type: {
          label: "",
          value: "",
        },
        sd_ninty_days: "",
        sd_sixty_days: "",
        cd_thirty_days: "",
        payment_period: [
          {
            label: "",
            value: "",
          },
        ],
        sd_thirty_days: "",
        cd_fifteen_days: "",
        country_of_origin: {
          label: "India", // hard coded
          value: "IN",
        },
        delivery_in_india: "yes",
        prefers_open_credit: "",
        opt_for_cash_discount: "",
        international_delivery: "yes",
        additional_product_info: {
          size: "",
          color: "",
          length: "",
          purity: "",
          breadth: "",
          density: "",
          k_value: "",
          pattern: "",
          material: "",
          ph_value: "",
          finishing: "",
          no_of_ply: "",
          viscosity: "",
          fibre_type: "",
          molar_mass: "",
          ash_content: "",
          oil_content: "",
          vehicle_use: "",
          antioxidants: "",
          bulk_density: "",
          product_form: {
            type: "",
            label: "",
            value: "",
          },
          product_type: {
            type: "",
            label: "",
            value: "",
          },
          thread_count: "",
          melting_point: "",
          product_grade: {
            type: "",
            label: "",
            value: "",
          },
          packaging_size: "",
          packaging_type: {
            type: "",
            label: "",
            value: "",
          },
          moisture_content: "",
          tensile_strength: "",
          active_ingredients: "",
          min_order_quantity: "",
          partitioning_agent: "",
          product_application: {
            type: "",
            label: "",
            value: "",
          },
          product_description: "",
        },
        international_exceptions: [],
        supplier_discount_facility: "yes",
        logistic_support_from_buyer: "yes",
      },
      status: "saved",
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    };
    products.push(productObj);
    await knex("gm_products").insert(productObj);
  }

  return products;
};

const createProductCategories = async (categories, products) => {
  let product_categories = [];
  let productsChunkStartIndex = 0;
  let productsChunkEndIndex = numberOfProductsPerCategory;

  for (let i = 0; i < categories.length; i++) {
    for (let j = productsChunkStartIndex; j < productsChunkEndIndex; j++) {
      let singleProductCategory = {};
      singleProductCategory["product_uuid"] = products[j].uuid;
      singleProductCategory["category_uuid"] = categories[i].uuid;
      singleProductCategory["createdAt"] = faker.date.recent();
      singleProductCategory["updatedAt"] = faker.date.recent();

      product_categories.push(singleProductCategory);
      await knex("gm_products_categories").insert(singleProductCategory);
    }
    productsChunkStartIndex =
      productsChunkStartIndex + numberOfProductsPerCategory;
    productsChunkEndIndex = productsChunkEndIndex + numberOfProductsPerCategory;
  }
  await knex.destroy();
  return product_categories;
};

const createFakeProducts = async () => {
  const categories = await createCategories(numberOfCategories);
  //   console.log("categories", categories);

  const products = await createProducts(
    categories.length * numberOfProductsPerCategory
  );
  //   console.log("products", products);

  const productCategories = await createProductCategories(categories, products);
  //   console.log("productCategories", productCategories);
};

createFakeProducts();
