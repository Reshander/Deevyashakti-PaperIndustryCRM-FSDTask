import PurchaseOrder from '../models/PurchaseOrder.js';
import SalesOrder from '../models/SalesOrder.js';

export const getPurchaseOrders = async (req, res) => {
    try {
        const rows = await PurchaseOrder.findAll({
            order: [['created_at', 'DESC']]
        });
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Database error', error: error.message });
    }
};

export const createPurchaseOrder = async (req, res) => {
    try {
        const po = await PurchaseOrder.create(req.body);
        res.status(201).json({ message: 'Purchase Order created successfully', id: po.id });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error: error.message });
    }
};

export const getSalesOrders = async (req, res) => {
    try {
        const rows = await SalesOrder.findAll({
            include: ['Invoice'], // Include the linked Invoice
            order: [['created_at', 'DESC']]
        });
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Database error', error: error.message });
    }
};

export const createSalesOrder = async (req, res) => {
    try {
        const so = await SalesOrder.create(req.body);

        // Auto-verify after creation
        const po = await PurchaseOrder.findOne({ where: { po_number: so.po_number } });
        if (po) {
            const mismatches = [];
            if (so.product !== po.product) mismatches.push(`Product mismatch: SO(${so.product}) vs PO(${po.product})`);
            if (Number(so.gsm) !== Number(po.gsm)) mismatches.push(`GSM mismatch: SO(${so.gsm}) vs PO(${po.gsm})`);
            if (Number(so.size_a) !== Number(po.size_a) || Number(so.size_b) !== Number(po.size_b)) {
                mismatches.push(`Size mismatch: SO(${so.size_a}x${so.size_b}) vs PO(${po.size_a}x${po.size_b})`);
            }
            if (so.packing_type !== po.packing_type) mismatches.push(`Packing type mismatch: SO(${so.packing_type}) vs PO(${po.packing_type})`);
            if (Number(so.quantity) !== Number(po.quantity)) mismatches.push(`Quantity mismatch: SO(${so.quantity}) vs PO(${po.quantity})`);

            const verification_status = mismatches.length === 0 ? 'Matched' : 'Mismatched';
            const remarks = mismatches.length === 0 ? 'All details match with PO' : mismatches.join(', ');

            await so.update({
                verification_status,
                verification_remarks: remarks,
                so_status: verification_status === 'Matched' ? 'Verified' : 'Draft'
            });
        } else {
            await so.update({
                verification_status: 'Mismatched',
                verification_remarks: 'Linked Purchase Order not found'
            });
        }

        res.status(201).json({ message: 'Sales Order created and verified', id: so.id, verification_status: so.verification_status });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error: error.message });
    }
};

export const verifySalesOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const so = await SalesOrder.findByPk(id);
        if (!so) return res.status(404).json({ message: 'Sales Order not found' });

        const po = await PurchaseOrder.findOne({ where: { po_number: so.po_number } });
        if (!po) return res.status(404).json({ message: 'Linked Purchase Order not found' });

        // Verification Logic
        const mismatches = [];
        if (so.product !== po.product) mismatches.push(`Product mismatch: SO(${so.product}) vs PO(${po.product})`);
        if (Number(so.gsm) !== Number(po.gsm)) mismatches.push(`GSM mismatch: SO(${so.gsm}) vs PO(${po.gsm})`);
        if (Number(so.size_a) !== Number(po.size_a) || Number(so.size_b) !== Number(po.size_b)) {
            mismatches.push(`Size mismatch: SO(${so.size_a}x${so.size_b}) vs PO(${po.size_a}x${po.size_b})`);
        }
        if (so.packing_type !== po.packing_type) mismatches.push(`Packing type mismatch: SO(${so.packing_type}) vs PO(${po.packing_type})`);
        if (Number(so.quantity) !== Number(po.quantity)) mismatches.push(`Quantity mismatch: SO(${so.quantity}) vs PO(${po.quantity})`);

        const verification_status = mismatches.length === 0 ? 'Matched' : 'Mismatched';
        const remarks = mismatches.length === 0 ? 'All details match with PO' : mismatches.join(', ');

        await so.update({
            verification_status,
            verification_remarks: remarks,
            so_status: verification_status === 'Matched' ? 'Verified' : 'Draft'
        });

        res.json({
            status: verification_status,
            remarks: remarks,
            mismatches: mismatches
        });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error: error.message });
    }
};
