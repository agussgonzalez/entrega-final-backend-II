// dao/db/product.repository.js

import ProductModel from '../models/product.model.js'; // Asegúrate de tener el modelo correcto

class ProductRepository {
    async getAll() {
        return await ProductModel.find(); // Devuelve todos los productos
    }

    async getById(id) {
        return await ProductModel.findById(id); // Devuelve un producto por ID
    }

    async create(productData) {
        const newProduct = new ProductModel(productData);
        return await newProduct.save(); // Crea y guarda un nuevo producto
    }

    async update(id, productData) {
        return await ProductModel.findByIdAndUpdate(id, productData, { new: true }); // Actualiza un producto
    }

    async delete(id) {
        return await ProductModel.findByIdAndDelete(id); // Elimina un producto
    }
}

export default new ProductRepository();
