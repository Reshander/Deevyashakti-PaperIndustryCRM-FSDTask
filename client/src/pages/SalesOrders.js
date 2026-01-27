import React, { useState, useEffect } from 'react';
import { getSOs, createSO, verifySO, getPOs } from '../services/api';
import { toast } from 'react-toastify';
import { Plus, CheckCircle2, AlertCircle, ShoppingCart, RefreshCw } from 'lucide-react';

const SalesOrders = ({ user }) => {
    const [sos, setSos] = useState([]);
    const [pos, setPos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        so_number: '',
        po_number: '',
        product: 'DIVPAK',
        gsm: 250,
        size_a: '',
        size_b: '',
        packing_type: 'Bundle',
        quantity: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const soRes = await getSOs();
            setSos(soRes.data);
        } catch (error) {
            toast.error('Failed to fetch data');
        }
    };

    const fetchPurchaseOrders = async () => {
        try {
            const poRes = await getPOs();
            setPos(poRes.data);
        } catch (error) {
            toast.error('Failed to fetch Purchase Orders');
        }
    };

    const handleOpenModal = () => {
        fetchPurchaseOrders();
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createSO(formData);
            toast.success('Sales Order created successfully');
            setShowModal(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create Sales Order');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id) => {
        try {
            const response = await verifySO(id);
            if (response.data.status === 'Matched') {
                toast.success('Sales Order Matched with Purchase Order successfully!');
            } else {
                toast.warning(`Mismatch detected: ${response.data.remarks}`);
            }
            fetchData();
        } catch (error) {
            toast.error('Verification failed');
        }
    };

    return (
        <div>
            <div className="section-header">
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Sales Orders</h1>
                    <p style={{ color: '#64748b' }}>Internal order management and verification</p>
                </div>
                {user.role === 'admin' && (
                    <button className="btn btn-primary" onClick={handleOpenModal}>
                        <Plus size={18} style={{ marginRight: '0.5rem' }} />
                        New Sales Order
                    </button>
                )}
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Sales Order Number</th>
                            <th>Purchase Order Reference</th>
                            <th>Product / GSM</th>
                            <th>Qty</th>
                            <th>Verification</th>
                            <th>Invoice Status</th>
                            <th>Payment Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sos.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                    No sales orders found.
                                </td>
                            </tr>
                        ) : (
                            sos.map((so) => (
                                <tr key={so.id}>
                                    <td style={{ fontWeight: '600' }}>{so.so_number}</td>
                                    <td>{so.po_number}</td>
                                    <td>
                                        <div style={{ fontWeight: '500' }}>{so.product}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{so.gsm} GSM | {so.size_a}x{so.size_b}</div>
                                    </td>
                                    <td>{so.quantity} MT</td>
                                    <td>
                                        <span className={`badge badge-${so.verification_status.toLowerCase()}`}>
                                            {so.verification_status}
                                        </span>
                                        {so.verification_remarks && (
                                            <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.25rem', maxWidth: '150px' }}>
                                                {so.verification_remarks}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`badge badge-${(so.Invoice?.status || 'Pending').toLowerCase()}`}>
                                            {so.Invoice?.status || (so.so_status === 'Verified' ? 'Ready' : 'Pending')}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${(so.Invoice?.payment_status || 'N/A').toLowerCase().replace(' ', '-')}`}>
                                            {so.Invoice?.payment_status || 'N/A'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', backgroundColor: '#f1f5f9' }}
                                                onClick={() => handleVerify(so.id)}
                                            >
                                                <RefreshCw size={14} style={{ marginRight: '0.4rem' }} />
                                                Verify
                                            </button>
                                            {so.so_status === 'Verified' && !so.Invoice && user.role === 'admin' && (
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                                    onClick={() => window.location.href = `/invoices?so_id=${so.id}`}
                                                >
                                                    Generate Invoice
                                                </button>
                                            )}
                                        </div>
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
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Create New Sales Order</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="input-group">
                                    <label>Sales Order Number</label>
                                    <input required value={formData.so_number} onChange={(e) => setFormData({ ...formData, so_number: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Purchase Order Reference</label>
                                    <select required value={formData.po_number} onChange={(e) => setFormData({ ...formData, po_number: e.target.value })}>
                                        <option value="">Select Purchase Order</option>
                                        {pos.map(po => (
                                            <option key={po.id} value={po.po_number}>{po.po_number} ({po.company_name})</option>
                                        ))}
                                    </select>
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
                            </div>
                            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                                    {loading ? 'Creating...' : 'Create Sales Order'}
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

export default SalesOrders;
