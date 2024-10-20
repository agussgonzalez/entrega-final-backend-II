// dao/db/ticket-manager-db.js
import TicketDAO from '../mongodb/ticket.dao.js';
import  TicketDTO  from '../../dtos/ticketDto.js'; // Asegúrate de tener el DTO para Ticket
import TicketModel from '../models/ticket.model.js';

export class TicketManager {
    async addTicket(ticketData) {
        const newTicket = await TicketDAO.create(ticketData);
        return new TicketDTO(newTicket); // Usando el DTO para Ticket
    }

    async getTickets() {
        const tickets = await TicketDAO.getAll();
        return tickets.map(ticket => new TicketDTO(ticket)); // Usando el DTO para Ticket
    }
        async addTicket(ticketData) {
            const newTicket = await TicketModel.create(ticketData);
            return newTicket;
        }
    
        async getTickets() {
            const tickets = await TicketModel.find().populate('userId').populate('products.productId');
            return tickets;
        }
    }

