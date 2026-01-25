import express from 'express';
import { getQueries, createQuery, respondToQuery } from '../Controllers/queryController.js';

const router = express.Router();

router.get('/', getQueries);
router.post('/', createQuery);
router.patch('/:id/respond', respondToQuery);

export default router;
