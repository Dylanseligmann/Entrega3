import fs from 'node:fs'


export default class CartManager {

    constructor(path) {

        this.carts = [];
        this.path = path;

        //Check if the file exists
        try {
            this.carts = JSON.parse(fs.readFileSync(this.path, 'utf8'));
        } catch (err) {
            if (err.code === 'ENOENT') {

                this.saveManager();

            } else {
                throw err;
            }
        }
        //Look for the highest cart ID
        let lastId = this.carts.reduce((acc, cart) => Math.max(acc, cart.id), 0);

        if (lastId > 0) {

            lastId++

        }
        this.currentId = lastId;
    }

    //Create a new cart
    addCart(products) {

        const id = this.currentId++;
        const newCart = {
            id,
            products
        }
        this.carts.push(newCart);
        this.saveManager();
        return id;
    }

    //Add Product to cart by ID
    addProductToCart(cartId, productId) {

        const cart = this.getCartById(cartId)

        if (cart === undefined) {

            return false
        }
        const product = cart.products.find(p => p.id == productId);

        if (product === undefined) {

            cart.products.push({ id: productId, quantity: 1 })
        }
        else {

            product.quantity++;
        }

        this.saveManager();
        return true;
    }

    //Return Cart By ID
    getCartById(id) {

        const cart = this.carts.find(c => c.id == id);

        return cart

    }

    //Create Carts.json
    saveManager() {

        fs.writeFileSync(this.path, JSON.stringify(this.carts));
    }
}