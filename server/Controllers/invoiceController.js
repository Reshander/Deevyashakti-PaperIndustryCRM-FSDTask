import Invoice from '../models/Invoice.js';
import SalesOrder from '../models/SalesOrder.js';

export const getInvoices = async (req, res) => {
    const { customer_id } = req.query;

    try {
        const whereClause = {};

        // If customer_id is provided, filter invoices through SalesOrder -> PurchaseOrder link
        // Note: This assumes we want to filter by the customer who placed the PO
        const queryOptions = {
            include: [{
                model: SalesOrder,
                required: true,
                include: [{
                    model: PurchaseOrder,
                    required: true,
                    where: customer_id ? { customer_id } : {}
                }]
            }],
            order: [['created_at', 'DESC']]
        };

        const rows = await Invoice.findAll(queryOptions);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Database error', error: error.message });
    }
};

export const createInvoice = async (req, res) => {
    const { so_id, amount, due_date } = req.body;

    try {
        const so = await SalesOrder.findByPk(so_id);
        if (!so) return res.status(404).json({ message: 'Sales Order not found' });

        // Enforce rule: Invoice allowed only after successful PO vs SO verification
        if (so.verification_status !== 'Matched' || so.so_status !== 'Verified') {
            return res.status(400).json({ message: 'Invoice can only be generated for VERIFIED Sales Orders' });
        }

        const invoice_number = `INV-${Date.now()}`;
        const invoice = await Invoice.create({
            so_id,
            invoice_number,
            invoice_date: new Date(),
            amount,
            due_date,
            status: 'Generated',
            payment_status: 'Pending'
        });

        await so.update({ so_status: 'Invoiced' });

        res.status(201).json({ message: 'Invoice generated successfully', invoice });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error: error.message });
    }
};

export const updatePaymentStatus = async (req, res) => {
    const { id } = req.params;
    const { amount_paid, payment_remarks, last_follow_up_date } = req.body;

    try {
        const invoice = await Invoice.findByPk(id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

        const totalAmount = Number(invoice.amount);
        const newAmountPaid = Number(amount_paid || invoice.amount_paid);

        // Payment Status Logic
        let payment_status = 'Pending';
        if (newAmountPaid >= totalAmount) {
            payment_status = 'Paid';
        } else if (newAmountPaid > 0) {
            payment_status = 'Partial';
        }

        await invoice.update({
            amount_paid: newAmountPaid,
            payment_status,
            payment_remarks,
            last_follow_up_date,
            status: payment_status === 'Paid' ? 'Paid' : invoice.status
        });

        res.json({ message: 'Payment status updated', invoice });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error: error.message });
    }
};
