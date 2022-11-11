const express = require("express");
const Sequelize = require("sequelize");
const parseUrl = require("parse-url");
const { createHash } = require("crypto");

const access_token = "a_sample_token";
const app = express();
const sequelize = new Sequelize("database", "username", "password", {
  dialect: "sqlite",
  storage: "data/juiceshop.sqlite",
});

app.post("/login", function (req, res) {
  sequelize.query(
    "SELECT * FROM Products WHERE name LIKE " + req.body.username
  );
});

app.get("/test", function (req, res) {
  const test = null;
  const dog = test?.dog;
  console.log(dog);
});

app.get("/check", function (req, res) {
  const passwordHash = createHash("md5")
    .update(argv._[0] || "test")
    .digest("hex");

  if (passwordHash !== "deadbeefbabe") {
    console.log(parseUrl(req.url));
  }
});

app.get("/some/path", function (req, res) {
  res.redirect(req.param("target"));
});

window.addEventListener("message", (event) => {
  console.log(event.data);
});
