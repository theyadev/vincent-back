const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const spawn = require("child_process").spawn;


require("dotenv").config()

const app = express();

app.use(helmet());
app.use(morgan("short"));
app.use(express.json())

function filterProducts(params) {
    let products = JSON.parse(fs.readFileSync('./items.json', {encoding: 'utf8'}));

    if (params?.price) {
        products = products.filter(product => product.prix == params.price)
    }

    if (params?.roundedPrice) {
        products = products.filter(product => Math.round(product.prix) == params.roundedPrice)
    }

    if(params?.search) {
        products = products.filter(product => product.nom.toLowerCase().includes(params.search.toLowerCase()))
    }

    return products
}

app.get('/items', (req, res) => {
    const params = req.query

    const products = filterProducts(params)

    res.json(products)
})

app.get('/items/random', (req, res) => {
    const params = req.query

    const products = filterProducts(params)

    const product = products[Math.floor(Math.random() * products.length)]

    res.json(product)
})

app.get('/categories', (req, res) => {
    res.json(["game", "amazon"])
})

app.post('/items/amazon', (req, res) => {
    if (req.body?.search && req.body?.password == "password") {
        const python = spawn("python", ["./amazon scrapping/script.py", req.body.search]);

        python.stdout.on("data", function (data) {
            res.status(200).send({
                "status": "OK"
            })
        });

        
        return
    }
    res.send("pasok")
})


PORT = process.env.PORT || 6969

console.log("Serveur démarré sur le port: " + PORT);
app.listen(PORT)