const express = require("express");
const Sequelize = require("sequelize");
const parseUrl = require("parse-url");
const { createHash } = require("crypto");
const _ = require("lodash");

const access_token = process.env.ACCESS_TOKEN;
const app = express();
const sequelize = new Sequelize("database", "username", "password", {
  dialect: "sqlite",
  storage: "data/juiceshop.sqlite",
});

app.post("/login", function (req, res) {
  sequelize.query("SELECT * FROM Products WHERE name LIKE ?", {
    replacements: [req.body.username],
  });
});

app.get("/test", function (req, res) {
  const test = null;
  const dog = test?.dog;
  console.log(dog);
});

app.get("/check", function (req, res) {
  const passwordHash = createHash("sha256")
    .update(argv._[0] || "test")
    .digest("hex");

  if (passwordHash !== "deadbeefbabe") {
    console.log(parseUrl(req.url));
  }
});

app.get("/check-redos", function (req, res) {
  new RegExp(`${_.escapeRegExp(req.param("pattern"))}`).test("value");
});

app.get("/some/path", function (req, res) {
  const target = req.param("target");
  if (/^\/test$/.test(target)) {
    res.redirect(target);
  }
});

window.addEventListener("message", (event) => {
  if (event.origin !== "http://localhost:8080") return;

  console.log(event.data);
});
