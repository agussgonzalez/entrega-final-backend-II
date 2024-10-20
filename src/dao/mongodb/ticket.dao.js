// dao/ticket.dao.js
import TicketModel from '../models/ticket.model.js';

class TicketDAO {
    async getAll() {
        return await TicketModel.find().populate('productId'); // Populate para obtener detalles del producto
    }

    async getById(id) {
        return await TicketModel.findById(id).populate('productId');
    }

    async create(ticket) {
        const newTicket = new TicketModel(ticket);
        return await newTicket.save();
    }

    async update(id, ticketData) {
        return await TicketModel.findByIdAndUpdate(id, ticketData, { new: true });
    }

    async delete(id) {
        return await TicketModel.findByIdAndDelete(id);
    }
    async create(ticketData) {
        const ticket = new TicketModel(ticketData);
        await ticket.save();
        return ticket; // Retornar el Ticket creado
    }

    async getAll() {
        return await TicketModel.find().lean(); // Obtener todos los Tickets
    }
}

export default new TicketDAO();
