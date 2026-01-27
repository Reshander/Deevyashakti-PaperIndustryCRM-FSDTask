import React, { useState, useEffect } from 'react';
import { getPOs, createPO } from '../services/api';
import { toast } from 'react-toastify';
import { Plus, FileText, Calendar, MapPin, Hash, Package, Layers } from 'lucide-react';

const PurchaseOrders = () => {
    const [pos, setPos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        company_name: '',
        company_address: '',
        delivery_address: '',
        product: 'DIVPAK',
        gsm: 250,
        size_a: '',
        size_b: '',
        packing_type: 'Bundle',
        po_number: '',
        po_date: new Date().toISOString().split('T')[0],
        quantity: ''
    });

    useEffect(() => {
        fetchPOs();
    }, []);

    const fetchPOs = async () => {
        try {
            const response = await getPOs();
            setPos(response.data);
        } catch (error) {
            toast.error('Failed to fetch Purchase Orders');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createPO({ ...formData, customer_id: 1 }); // Hardcoded customer_id for demo
            toast.success('Purchase Order created successfully');
            setShowModal(false);
            fetchPOs();
            setFormData({
                company_name: '', company_address: '', delivery_address: '',
                product: 'DIVPAK', gsm: 250, size_a: '', size_b: '',
                packing_type: 'Bundle', po_number: '', po_date: new Date().toISOString().split('T')[0], quantity: ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create Purchase Order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="section-header">
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Purchase Orders</h1>
                    <p style={{ color: '#64748b' }}>Manage incoming customer orders</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} style={{ marginRight: '0.5rem' }} />
                    New Purchase Order
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Purchase Order Number</th>
                            <th>Company</th>
                            <th>Product / GSM</th>
                            <th>Quantity</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pos.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                    No purchase orders found.
                                </td>
                            </tr>
                        ) : (
                            pos.map((po) => (
                                <tr key={po.id}>
                                    <td style={{ fontWeight: '600' }}>{po.po_number}</td>
                                    <td>{po.company_name}</td>
                                    <td>
                                        <div style={{ fontWeight: '500' }}>{po.product}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{po.gsm} GSM | {po.size_a}x{po.size_b}</div>
                                    </td>
                                    <td>{po.quantity} MT</td>
                                    <td>{new Date(po.po_date).toLocaleDateString()}</td>
                                    <td>
                                        <span className="badge badge-matched">Active</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
                    <div className="card" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Create New Purchase Order</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="input-group">
                                    <label>Company Name</label>
                                    <input required value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Purchase Order Number</label>
                                    <input required value={formData.po_number} onChange={(e) => setFormData({ ...formData, po_number: e.target.value })} />
                                </div>
                                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                    <label>Company Address</label>
                                    <textarea required value={formData.company_address} onChange={(e) => setFormData({ ...formData, company_address: e.target.value })} />
                                </div>
                                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                    <label>Delivery Address</label>
                                    <textarea required value={formData.delivery_address} onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Product</label>
                                    <select value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })}>
                                        <option value="DIVPAK">DIVPAK</option>
                                        <option value="DIVLITE">DIVLITE</option>
                                        <option value="DIVGLO">DIVGLO</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>GSM</label>
                                    <select value={formData.gsm} onChange={(e) => setFormData({ ...formData, gsm: e.target.value })}>
                                        <option value="250">250</option>
                                        <option value="300">300</option>
                                        <option value="350">350</option>
                                        <option value="400">400</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Size A (cm)</label>
                                    <input type="number" step="0.01" required value={formData.size_a} onChange={(e) => setFormData({ ...formData, size_a: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Size B (cm)</label>
                                    <input type="number" step="0.01" required value={formData.size_b} onChange={(e) => setFormData({ ...formData, size_b: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Packing Type</label>
                                    <select value={formData.packing_type} onChange={(e) => setFormData({ ...formData, packing_type: e.target.value })}>
                                        <option value="Bundle">Bundle</option>
                                        <option value="Reel">Reel</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Quantity (MT)</label>
                                    <input type="number" step="0.01" required value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Purchase Order Date</label>
                                    <input type="date" required value={formData.po_date} onChange={(e) => setFormData({ ...formData, po_date: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                                    {loading ? 'Creating...' : 'Create Purchase Order'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn" style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#475569' }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseOrders;
