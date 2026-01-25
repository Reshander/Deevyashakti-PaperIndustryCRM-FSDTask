import express from 'express';
import { getInvoices, createInvoice, updatePaymentStatus } from '../Controllers/invoiceController.js';

const router = express.Router();

router.get('/', getInvoices);
router.post('/', createInvoice);
router.patch('/:id/payment', updatePaymentStatus);

export default router;
