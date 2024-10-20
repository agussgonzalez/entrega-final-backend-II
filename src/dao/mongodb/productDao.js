import Product from '../models/product.model.js';

class ProductDao {
    async getProducts(limit, page, sort, query) {
        const filter = query ? { category: query } : {};
        const options = {
            limit: limit || 10,
            page: page || 1,
            sort: { price: sort === 'asc' ? 1 : -1 },
        };

        return await Product.paginate(filter, options);
    }

    async getProductById(productId) {
        return await Product.findById(productId);
    }

    async createProduct(productData) {
        const newProduct = new Product(productData);
        return await newProduct.save();
    }

    async updateProduct(productId, productData) {
        return await Product.findByIdAndUpdate(productId, productData, { new: true });
    }

    async deleteProduct(productId) {
        return await Product.findByIdAndDelete(productId);
    }

    async updateProductStock(productId, quantity) {
        return await Product.findByIdAndUpdate(productId, { $inc: { stock: -quantity } });
    }
}

export default new ProductDao();
