import express from 'express';
import ProductManager from './ProductManager.js';

function initialize() {
    const productManger = new ProductManager('./products.json');

    const app = express();

    app.get('/', (req, res) => {
        res.send(`Hi! There currently are ${productManger.getProducts().length} products`);
    });

    app.get('/products', (req, res) => {
        // Fetch all products
        let products = productManger.getProducts();
        // Get the desired limit the user sent in the query params
        const limit = parseInt(req.query.limit, 10);

        console.log(limit)
        // If the limit is indeed a number (not NaN), then we limit the products
        if (!isNaN(limit)) {
            products = products.slice(0, limit); 
        }

        // Return the products

        res.send({
            products
        });
    });

    app.get('/products/:id', (req, res) => {
        const id = parseInt(req.params.id, 10);
        const product = productManger.getProductByCode(id);

        res.send(product)
    });

    app.listen(8080, () => {
        console.log('Server is running on port 8080');
    });
}


initialize();
