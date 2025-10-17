const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const db = require("./db");
const path = require("path");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "grocery_secret",
    resave: false,
    saveUninitialized: false,
  })
);

function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/");
  }
  next();
}

app.get("/", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username=?", [username], (err, user) => {
    if (!user) return res.render("login", { error: "Invalid username" });
    if (!bcrypt.compareSync(password, user.password))
      return res.render("login", { error: "Incorrect password" });

    req.session.userId = user.id;
    res.redirect("/dashboard");
  });
});

app.get("/dashboard", requireLogin, (req, res) => {
  db.all("SELECT * FROM groceries", (err, groceries) => {
    res.render("dashboard", { groceries });
  });
});

app.get("/add-to-cart/:id", requireLogin, (req, res) => {
  const itemId = req.params.id;
  db.get("SELECT * FROM groceries WHERE id=?", [itemId], (err, item) => {
    if (!item) return res.send("Item not found");
    if (!req.session.cart) req.session.cart = [];
    req.session.cart.push(item);
    res.redirect("/cart");
  });
});

app.get("/cart", requireLogin, (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, i) => sum + i.price, 0);
  res.render("cart", { cart, total });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));