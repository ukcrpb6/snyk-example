import { createHash } from "crypto";
import express from "express";
import helmet from "helmet";
import { escapeRegExp } from "lodash";
import parseUrl from "parse-url";
import Sequelize, { DataTypes } from "sequelize";

const access_token = process.env.ACCESS_TOKEN;

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

// deepcode ignore UseCsurfForExpress: example, no need for CSRF here
const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(helmet());

app.post("/product", async (req, res) => {
  const { name, url } = req.body;

  const urlParts = parseUrl(url);

  if (urlParts.resource === "localhost") {
    return res.status(400).send();
  }

  const model = await Products.create({ name, url });

  res.json(model);
});

app.get("/product", async (req, res) => {
  const products = await Products.findAll();
  res.json(products);
});

app.get("/product/:name", function (req, res) {
  res.json(
    sequelize.query(`SELECT * FROM Products WHERE name LIKE ?`, {
      replacements: [req.params.name],
    })
  );
});

app.get("/product/_exists/:name", async (req, res) => {
  const name = escapeRegExp(req.params.name);
  const condition = new RegExp(`^${name}$`);
  const exists = (await Products.findAll()).some((product) =>
    condition.test(product.name)
  );

  res.json({ condition: `^${req.params.name}$`, exists });
});

app.get("/token", (req, res) => {
  res.json({
    secret: createHash("sha256").update(access_token).digest("hex"),
  });
});

app.get("/redirect/:target", (req, res) => {
  const target = res.params.target;
  if (target !== "product") {
    return res.status(404).send();
  }
  res.redirect(`${req.baseUrl}/${target}`);
});

await sequelize.authenticate();
await sequelize.sync({ force: true });
await Products.create({ name: "test", url: "test" });

app.listen(18080, () => {});
