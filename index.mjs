import { createHash } from "crypto";
import express from "express";
import parseUrl from "parse-url";
import Sequelize, { DataTypes } from "sequelize";

const access_token = "AKIASECRET";

const sequelize = new Sequelize("sqlite::memory:");

const Products = sequelize.define("Products", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// express

const app = express();
app.use(express.json());

app.post("/product", async (req, res) => {
  const { name, url } = req.body;

  const urlParts = parseUrl(url);

  if (urlParts.resource === "localhost") {
    return res.status(400).send();
  }

  await Products.create({ name, url }).then((model) => res.json(model));
});

app.get("/product", (req, res) => {
  Products.findAll().then((products) => res.json(products));
});

app.get("/product/:name", function (req, res) {
  res.json(
    sequelize.query(`SELECT * FROM Products WHERE name LIKE ${req.params.name}`)
  );
});

app.get("/product/_exists/:name", async (req, res) => {
  const condition = new RegExp(`^${req.params.name}$`);
  const exists = (await Products.findAll()).some((product) =>
    condition.test(product.name)
  );

  res.json({ condition: `^${req.params.name}$`, exists });
});

app.get("/token", (req, res) => {
  res.json({
    secret: createHash("md5").update(access_token).digest("hex"),
  });
});

app.get("/redirect/:target", (req, res) => {
  res.redirect(`${req.baseUrl}/${req.params.target}`);
});

await sequelize.authenticate();
await sequelize.sync({ force: true }).then(() => {
  return Products.create({
    name: "test",
    url: "test",
  });
});

app.listen(18080, () => {});
