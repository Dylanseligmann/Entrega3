import express from 'express';
import ProductManager from './ProductManager.js';
import CartManager from './CartManager.js';

function initialize() {
    const productManger = new ProductManager('./products.json');
    const cartManager = new CartManager('./carts.json');

    const app = express();
    app.use(express.json());


    app.get('/api/products', (req, res) => {
        // Fetch all products
        let products = productManger.getProducts();
        // Get the desired limit the user sent in the query params
        const limit = parseInt(req.query.limit, 10);

        // If the limit is indeed a number (not NaN), then we limit the products
        if (!isNaN(limit)) {
            products = products.slice(0, limit);
        }

        // Return the products

        res.send(
            products
        );
    });

    //Return products by ID
    app.get('/api/products/:id', (req, res) => {

        const id = parseInt(req.params.id, 10);
        const product = productManger.getProductByCode(id);

        res.send(product)
    });

    //Add new product 
    app.post('/api/products', (req, res) => {

        const { title, description, price, thumbnail, stock, status = true } = req.body;


        const product = productManger.addProduct(title, description, price, thumbnail, stock, status);
        res.send(product);


    })
    //Update product by ID
    app.put('/api/products/:id', (req, res) => {

        const id = parseInt(req.params.id, 10);


        const updatedProduct = productManger.updateProductByCode(id, req.body);


        if (updatedProduct) {

            res.status(200).end('El producto se ha actualizado')

        } else {

            res.status(400).end('El producto no existe')
        }
    });

    //Delete product by ID
    app.delete('/api/products/:id', (req, res) => {

        const id = parseInt(req.params.id, 10);

        const deletedProduct = productManger.deleteProductByCode(id);

        if (deletedProduct) {

            res.status(200).end('El producto se ha eliminado')

        } else {

            res.status(400).end('El producto no existe')
        }


    });

    //Create Cart
    app.post('/api/carts/', (req, res)  => {

        const cartId = cartManager.addCart(req.body.products);
        res.status(200).send({cartId});
    })

    //Return Cart by ID
    app.get('/api/carts/:id', (req, res) => {

        const id = parseInt(req.params.id, 10);

        const cart = cartManager.getCartById(id);

        res.status(200).send(cart.products);


    });
    // Add product ID to cart by ID
    app.post('/api/carts/:cid/products/:pid', (req, res) => {

        const cartId = parseInt(req.params.cid, 10);
        const productId = parseInt(req.params.pid, 10);

        cartManager.addProductToCart(cartId,productId);
        res.status(200).end('El producto se ha agregado al carrito');
    })

    app.listen(8080, () => {
        console.log('Server is running on port 8080');
    });
}


initialize();
