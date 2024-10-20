// routes/tickets.router.js
import { Router } from 'express';
import { TicketManager } from '../dao/db/ticket-manager-db.js';

const router = Router();
const ticketManager = new TicketManager();

// Endpoint para crear un nuevo Ticket
router.post('/', async (req, res) => {
    try {
        const ticketData = req.body;
        const newTicket = await ticketManager.addTicket(ticketData);
        return res.status(201).json(newTicket);
    } catch (error) {
        console.error('Error al crear el Ticket:', error);
        return res.status(500).json({ error: 'Error al crear el Ticket' });
    }
});

// Endpoint para obtener todos los Tickets
router.get('/', async (req, res) => {
    try {
        const tickets = await ticketManager.getTickets();
        return res.status(200).json(tickets);
    } catch (error) {
        console.error('Error al obtener Tickets:', error);
        return res.status(500).json({ error: 'Error al obtener Tickets' });
    }
});

export default router;
