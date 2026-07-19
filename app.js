const express = require("express");
const session = require("express-session");
const products = require("./data/products");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
    session({
        secret: "shop-secret",
        resave: false,
        saveUninitialized: true
    })
);

// initialise basket
app.use((req, res, next) => {
    if (!req.session.basket) {
        req.session.basket = [];
    }
    next();
});

// Homepage
app.get("/", (req, res) => {
    res.render("index", {
        products,
        basketSize: req.session.basket.length
    });
});

// Product page
app.get("/product/:id", (req, res) => {

    const product = products.find(p => p.id == req.params.id);

    if (!product)
        return res.send("Product not found");

    res.render("product", {
        product,
        basketSize: req.session.basket.length
    });

});

// Add to basket
app.post("/basket/add/:id", (req, res) => {

    const product = products.find(p => p.id == req.params.id);

    req.session.basket.push(product);

    res.redirect("/basket");

});

// Basket
app.get("/basket", (req, res) => {

    let total = 0;

    req.session.basket.forEach(item => {
        total += item.price;
    });

    res.render("basket", {
        basket: req.session.basket,
        total,
        basketSize: req.session.basket.length
    });

});

// Remove item
app.post("/basket/remove/:index", (req, res) => {

    req.session.basket.splice(req.params.index, 1);

    res.redirect("/basket");

});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});