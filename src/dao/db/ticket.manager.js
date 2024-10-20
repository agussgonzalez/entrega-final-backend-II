// dao/db/ticket-manager-db.js
import TicketDAO from '../mongodb/ticket.dao.js';

export class TicketManager {
    async createTicket(ticketData) {
        return await TicketDAO.create(ticketData);
    }

    // Puedes agregar más métodos según sea necesario
}
