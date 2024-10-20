import ticketDao from '../dao/mongodb/ticket.dao.js';
import TicketDTO from '../dtos/ticketDto.js'; // Asegúrate de tener un DTO para el ticket

class TicketService {
    async createTicket(ticketData) {
        const newTicket = await ticketDao.create(ticketData);
        return new TicketDTO(newTicket); // Usando el DTO
    }

    async getAllTickets() {
        const tickets = await ticketDao.getAll();
        return tickets.map(ticket => new TicketDTO(ticket)); // Usando el DTO
    }

    async getTicketById(id) {
        const ticket = await ticketDao.getById(id);
        return ticket ? new TicketDTO(ticket) : null; // Usando el DTO
    }
}

export default new TicketService();
