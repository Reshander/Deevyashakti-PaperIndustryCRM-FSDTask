import React, { useState, useEffect } from 'react';
import { getInvoices, updatePaymentStatus, getSOs, createInvoice } from '../services/api';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';

const Invoices = ({ user }) => {
    console.log('Invoices component rendering');
    const [invoices, setInvoices] = useState([]);
    const [sos, setSos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [loading, setLoading] = useState(false);

    // Check for so_id in URL
    const queryParams = new URLSearchParams(window.location.search);
    const preselectedSoId = queryParams.get('so_id');

    const [formData, setFormData] = useState({
        so_id: preselectedSoId || '',
        amount: '',
        due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default 15 days due
    });

    const [paymentData, setPaymentData] = useState({
        amount_paid: '',
        payment_remarks: '',
        last_follow_up_date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchData();
        if (preselectedSoId) {
            handleOpenModal();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [preselectedSoId]);

    const fetchData = async () => {
        try {
            const customerId = user?.role === 'customer' ? user.id : null;
            const invRes = await getInvoices(customerId);
            setInvoices(Array.isArray(invRes.data) ? invRes.data : []);
        } catch (error) {
            toast.error('Failed to fetch Invoices');
        }
    };

    const fetchSalesOrders = async () => {
        try {
            const soRes = await getSOs();
            if (user?.role === 'admin') {
                const allSos = Array.isArray(soRes.data) ? soRes.data : [];
                setSos(allSos.filter(so => so.so_status === 'Verified'));
            }
        } catch (error) {
            toast.error('Failed to fetch verified Sales Orders');
        }
    };

    const handleOpenModal = () => {
        fetchSalesOrders();
        setShowModal(true);
    };

    const handleCreateInvoice = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createInvoice(formData);
            toast.success('Invoice generated successfully');
            setShowModal(false);
            window.history.replaceState({}, document.title, window.location.pathname);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate invoice');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenPaymentModal = (inv) => {
        setSelectedInvoice(inv);
        setPaymentData({
            amount_paid: inv.amount_paid || '',
            payment_remarks: inv.payment_remarks || '',
            last_follow_up_date: inv.last_follow_up_date ? new Date(inv.last_follow_up_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
        setShowPaymentModal(true);
    };

    const handleUpdatePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updatePaymentStatus(selectedInvoice.id, paymentData);
            toast.success('Payment details updated');
            setShowPaymentModal(false);
            fetchData();
        } catch (error) {
            toast.error('Failed to update payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="section-header">
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Billing & Invoices</h1>
                    <p style={{ color: '#64748b' }}>Track payments and generate billing documents</p>
                </div>
                {user?.role === 'admin' && (
                    <button className="btn btn-primary" onClick={handleOpenModal}>
                        <Plus size={18} style={{ marginRight: '0.5rem' }} />
                        Generate Invoice
                    </button>
                )}
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Invoice #</th>
                            <th>Sales Order #</th>
                            <th>Amount (Paid/Total)</th>
                            <th>Status</th>
                            <th>Payment</th>
                            <th>Follow-up</th>
                            {user?.role === 'admin' && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.length === 0 ? (
                            <tr>
                                <td colSpan={user?.role === 'admin' ? "7" : "6"} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                    No invoices generated yet.
                                </td>
                            </tr>
                        ) : (
                            invoices.map((inv) => (
                                <tr key={inv.id}>
                                    <td style={{ fontWeight: '600' }}>{inv.invoice_number}</td>
                                    <td>{inv.SalesOrder?.so_number || 'N/A'}</td>
                                    <td>
                                        <div style={{ fontWeight: 'bold' }}>₹{Number(inv.amount_paid || 0).toLocaleString()} / ₹{Number(inv.amount || 0).toLocaleString()}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Due: {new Date(inv.due_date).toLocaleDateString()}</div>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${(inv.status || 'generated').toLowerCase()}`}>
                                            {inv.status || 'Generated'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${(inv.payment_status || 'pending').toLowerCase()}`}>
                                            {inv.payment_status || 'Pending'}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.85rem' }}>
                                        {inv.last_follow_up_date ? new Date(inv.last_follow_up_date).toLocaleDateString() : 'No follow-up yet'}
                                    </td>
                                    {user?.role === 'admin' && (
                                        <td>
                                            <button
                                                className="btn"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', backgroundColor: '#f1f5f9' }}
                                                onClick={() => handleOpenPaymentModal(inv)}
                                            >
                                                Update Payment
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Invoice Generation Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
                    <div className="card" style={{ maxWidth: '500px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Generate New Invoice</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>✕</button>
                        </div>

                        <form onSubmit={handleCreateInvoice}>
                            <div className="input-group">
                                <label>Select Verified Sales Order</label>
                                <select required value={formData.so_id} onChange={(e) => setFormData({ ...formData, so_id: e.target.value })}>
                                    <option value="">Choose Sales Order</option>
                                    {sos.map(so => (
                                        <option key={so.id} value={so.id}>{so.so_number} ({so.product} - {so.quantity} MT)</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Total Amount (₹)</label>
                                <input type="number" required value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Due Date</label>
                                <input type="date" required value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} />
                            </div>
                            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                                    {loading ? 'Generating...' : 'Confirm Invoice'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn" style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#475569' }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Payment Update Modal */}
            {showPaymentModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
                    <div className="card" style={{ maxWidth: '500px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Update Payment - {selectedInvoice?.invoice_number}</h2>
                            <button onClick={() => setShowPaymentModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>✕</button>
                        </div>

                        <form onSubmit={handleUpdatePayment}>
                            <div className="input-group">
                                <label>Amount Paid (₹)</label>
                                <input type="number" required value={paymentData.amount_paid} onChange={(e) => setPaymentData({ ...paymentData, amount_paid: e.target.value })} />
                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Total Invoice Amount: ₹{selectedInvoice?.amount}</div>
                            </div>
                            <div className="input-group">
                                <label>Follow-up Date</label>
                                <input type="date" value={paymentData.last_follow_up_date} onChange={(e) => setPaymentData({ ...paymentData, last_follow_up_date: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Remarks</label>
                                <textarea value={paymentData.payment_remarks} onChange={(e) => setPaymentData({ ...paymentData, payment_remarks: e.target.value })} />
                            </div>
                            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                                    {loading ? 'Updating...' : 'Save Payment'}
                                </button>
                                <button type="button" onClick={() => setShowPaymentModal(false)} className="btn" style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#475569' }}>
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

export default Invoices;
