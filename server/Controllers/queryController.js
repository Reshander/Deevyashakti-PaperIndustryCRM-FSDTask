import Query from '../models/Query.js';
import Customer from '../models/Customer.js';

export const getQueries = async (req, res) => {
    try {
        const rows = await Query.findAll({
            include: [Customer],
            order: [['created_at', 'DESC']]
        });
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Database error', error: error.message });
    }
};

export const createQuery = async (req, res) => {
    try {
        const query = await Query.create(req.body);
        res.status(201).json({ message: 'Query raised successfully', query });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error: error.message });
    }
};

export const respondToQuery = async (req, res) => {
    const { id } = req.params;
    const { response, query_status } = req.body;

    try {
        const query = await Query.findByPk(id);
        if (!query) return res.status(404).json({ message: 'Query not found' });

        await query.update({
            response,
            query_status: query_status || 'Resolved'
        });
        res.json({ message: 'Response sent successfully', query });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error: error.message });
    }
};
