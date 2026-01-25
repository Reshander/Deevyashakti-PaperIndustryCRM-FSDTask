import express from 'express';
import {
    getPurchaseOrders,
    createPurchaseOrder,
    getSalesOrders,
    createSalesOrder,
    verifySalesOrder
} from '../Controllers/orderController.js';

const router = express.Router();

router.get('/po', getPurchaseOrders);
router.post('/po', createPurchaseOrder);

router.get('/so', getSalesOrders);
router.post('/so', createSalesOrder);
router.post('/so/:id/verify', verifySalesOrder);

export default router;
