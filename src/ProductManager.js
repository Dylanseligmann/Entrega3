import fs from 'fs';

export default class ProductManager {

    constructor(path) {
        // Initialize products array
        this.products = [];
        // Set path for data persistence
        this.path = path;
        // Max Code Counter
        this.maxCode = -1;
        // Attempt to load products
        try {
            this.initialize();
        }
        catch (error) {
            console.error('Failed to initialize ProductManager');
            console.error(error);
        }
    }

    initialize() {
        // Create example products if there is no existing file
        if (fs.existsSync(this.path)) {
            this.loadProducts();
        } else {
            this.addProduct('Nesquik', 'cacao powder', 5, 'Cocoa powder for them kids.jpg', 100);
            this.addProduct('Banana', 'Banana Smoothie', 8, 'ExtraLarge.jpg', 20);
            this.addProduct('Caramel', 'Caramel', 8, 'ExtraLarge.jpg', 20);
            this.addProduct('Pineapple', 'Pineapple Smoothie', 8, 'ExtraLarge.jpg', 20);
            this.addProduct('Popcorn', 'Banana Smoothie', 8, 'ExtraLarge.jpg', 20);
        }
    }

    // Load products from file
    loadProducts() {
        const data = fs.readFileSync(this.path, 'utf8');
        this.products = JSON.parse(data);
        // Find maximum code value
        this.maxCode = this.products.reduce((max, product) => Math.max(max, product.code), 0);
    }

    // Save products to file
    saveProducts() {
        try {
            const data = JSON.stringify(this.products, null, 2);
            fs.writeFileSync(this.path, data);
        } catch (err) {
            console.error("Error saving products:", err);
        }
    }

    // Add a new product
    addProduct(title, description, price, thumbnail, stock) {
        const product = {
            title,
            description,
            price,
            thumbnail,
            code: ++this.maxCode, // Increment the maximum code by 1 to ensure uniqueness
            stock
        };
        this.products.push(product);
        this.saveProducts();
        return product;
    }


    // Get all products
    getProducts() {
        return this.products;
    }

    // Get a product by code
    getProductByCode(code) {
        return this.products.find(product => product.code === code);
    }

    // Update a product by code
    updateProductByCode(code, newData) {
        const product = this.getProductByCode(code);
        if (product) {
            Object.assign(product, newData); // Update product data
            this.saveProducts();
            return true;
        }
        return false;
    }

    // Delete a product by code
    deleteProductByCode(code) {
        const index = this.products.findIndex(product => product.code === code);
        if (index !== -1) {
            this.products.splice(index, 1); // Remove product from array
            this.saveProducts();
            return true;
        }
        return false;
    }
}

// Example usage
// const productManager = new ProductManager("products.json");

// Add products
// productManager.addProduct('Nesquik', 'cacao powder', 5, 'Cocoa powder for them kids.jpg', 100);
// productManager.addProduct('Banana', 'Banana Smoothie', 8, 'ExtraLarge.jpg', 20);
// productManager.addProduct('Caramel', 'Caramel', 8, 'ExtraLarge.jpg', 20);
// productManager.addProduct('Pineapple', 'Pineapple Smoothie', 8, 'ExtraLarge.jpg', 20);
// productManager.addProduct('Popcorn', 'Banana Smoothie', 8, 'ExtraLarge.jpg', 20);

// // Get all products
// const allProducts = productManager.getProducts();
// console.log("All Products:", allProducts);

// Get product by code
// const productByCode = productManager.getProductByCode(6);
// console.log("Product by Code:", productByCode);


// Update product by code
// productManager.updateProductByCode(6, { price: 1000 });
// console.log("Product updated:", productManager.getProductByCode(6));

// // Delete product by code
// productManager.deleteProductByCode(0);

// module.exports = ProductManager;
