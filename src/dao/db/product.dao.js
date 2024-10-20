// dao/db/product.dao.js
import ProductModel from "../models/product.model.js";

class ProductDAO {
    async getAll() {
        return await ProductModel.find();
    }

    async getById(id) {
        return await ProductModel.findById(id);
    }

    async create(product) {
        return await ProductModel.create(product);
    }

    async update(id, productData) {
        return await ProductModel.findByIdAndUpdate(id, productData, { new: true });
    }

    async delete(id) {
        return await ProductModel.findByIdAndDelete(id);
    }
}

export default new ProductDAO();
