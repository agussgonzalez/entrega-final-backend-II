// dao/db/product-manager-db.js
import ProductRepository from './product.repository.js'; // Importa el repositorio
import { ProductDTO } from '../../dtos/product.dto.js';
import TicketDAO from '../mongodb/ticket.dao.js';
import ProductModel from '../models/product.model.js';


export class ProductManager {
    async getProducts() {
        const products = await ProductRepository.getAll(); // Usar ProductRepository
        return products.map(product => new ProductDTO(product)); // Usando el DTO
    }

    async getProductById(id) {
        const product = await ProductRepository.getById(id); // Usar ProductRepository
        return product ? new ProductDTO(product) : null; // Usando el DTO
    }

    async addProduct(product) {
        const newProduct = await ProductRepository.create(product); // Usar ProductRepository
        return new ProductDTO(newProduct); // Usando el DTO
    }

    async updateProduct(id, productData) {
        const updatedProduct = await ProductRepository.update(id, productData); // Usar ProductRepository
        return updatedProduct ? new ProductDTO(updatedProduct) : null; // Usando el DTO
    }

    async deleteProduct(id) {
        return await ProductRepository.delete(id); // Usar ProductRepository
    }

    async countProducts() {
        try {
            const count = await ProductModel.countDocuments(); // O usa una consulta adecuada
            return count;
        } catch (error) {
            throw new Error("Error al contar productos: " + error);
        }
    }

async createTicket(buyer, productId, quantity) {
    const ticket = {
        buyer,
        productId,
        quantity,
        purchaseDate: new Date(),
    };
    const newTicket = await TicketDAO.create(ticket);
    return newTicket; // Retornar el Ticket creado
}

async getTickets() {
    return await TicketDAO.getAll(); // Recuperar todos los Tickets
}
}
