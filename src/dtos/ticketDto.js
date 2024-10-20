class TicketDTO {
    constructor(ticket) {
        this.id = ticket._id;
        this.code = ticket.code;
        this.purchase_datetime = ticket.purchase_datetime;
        this.amount = ticket.amount;
        this.purchaser = ticket.purchaser;
        this.status = ticket.status;
        this.paymentMethod = ticket.paymentMethod;
        this.products = ticket.products;
        this.shippingDetails = ticket.shippingDetails;
        this.discount = ticket.discount;
        this.taxes = ticket.taxes;
        this.order_id = ticket.order_id;
        this.notes = ticket.notes;
    }
}

export default TicketDTO;
