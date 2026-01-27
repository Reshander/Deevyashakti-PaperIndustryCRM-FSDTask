import React, { useState, useEffect } from 'react';
import { getQueries, createQuery, respondToQuery } from '../services/api';
import { toast } from 'react-toastify';
import { MessageSquare, Send, User, Clock, CheckCircle2 } from 'lucide-react';

const Queries = ({ user }) => {
    console.log('Queries component rendering with user:', user);
    const [queries, setQueries] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    });
    const [responseMsg, setResponseMsg] = useState('');
    const [selectedQuery, setSelectedQuery] = useState(null);

    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        try {
            const response = await getQueries();
            setQueries(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            toast.error('Failed to fetch queries');
            setQueries([]);
        }
    };

    const handleRaiseQuery = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createQuery({ ...formData, customer_id: user.id });
            toast.success('Query raised successfully');
            setShowModal(false);
            fetchQueries();
            setFormData({ subject: '', message: '' });
        } catch (error) {
            toast.error('Failed to raise query');
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await respondToQuery(selectedQuery.id, { response: responseMsg, query_status: 'Resolved' });
            toast.success('Response sent successfully');
            setSelectedQuery(null);
            setResponseMsg('');
            fetchQueries();
        } catch (error) {
            toast.error('Failed to send response');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="section-header">
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Customer Queries</h1>
                    <p style={{ color: '#64748b' }}>Support and communication portal</p>
                </div>
                {user.role === 'customer' && (
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <MessageSquare size={18} style={{ marginRight: '0.5rem' }} />
                        New Query
                    </button>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedQuery ? '1fr 1fr' : '1fr', gap: '2rem' }}>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Status</th>
                                <th>Raised By</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {queries.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                        No queries found.
                                    </td>
                                </tr>
                            ) : (
                                queries.map((q) => (
                                    <tr key={q.id} style={{ cursor: 'pointer', backgroundColor: selectedQuery?.id === q.id ? '#f8fafc' : 'transparent' }} onClick={() => setSelectedQuery(q)}>
                                        <td style={{ fontWeight: '500' }}>{q.subject}</td>
                                        <td>
                                            <span className={`badge badge-${q.query_status.toLowerCase().replace(' ', '-')}`}>
                                                {q.query_status}
                                            </span>
                                        </td>
                                        <td>{q.Customer?.name}</td>
                                        <td>{new Date(q.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <button className="btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', backgroundColor: '#f1f5f9' }}>
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {selectedQuery && (
                    <div className="card" style={{ maxWidth: 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontWeight: 'bold' }}>Query Details</h3>
                            <button onClick={() => setSelectedQuery(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                        </div>

                        <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>Message from {selectedQuery.Customer?.name}:</p>
                            <p>{selectedQuery.message}</p>
                        </div>

                        {selectedQuery.response ? (
                            <div style={{ padding: '1rem', backgroundColor: '#dcfce7', borderRadius: '0.5rem' }}>
                                <p style={{ fontSize: '0.75rem', color: '#166534', marginBottom: '0.5rem' }}>Our Response:</p>
                                <p>{selectedQuery.response}</p>
                            </div>
                        ) : user.role === 'admin' ? (
                            <form onSubmit={handleRespond}>
                                <div className="input-group">
                                    <label>Your Response</label>
                                    <textarea
                                        required
                                        rows="4"
                                        placeholder="Type your reply here..."
                                        value={responseMsg}
                                        onChange={(e) => setResponseMsg(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                                    <Send size={16} style={{ marginRight: '0.5rem' }} />
                                    {loading ? 'Sending...' : 'Send Response'}
                                </button>
                            </form>
                        ) : (
                            <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '0.5rem', textAlign: 'center' }}>
                                <Clock size={20} style={{ color: '#64748b', marginBottom: '0.5rem' }} />
                                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Waiting for admin response...</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
                    <div className="card" style={{ maxWidth: '500px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Raise New Query</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>✕</button>
                        </div>

                        <form onSubmit={handleRaiseQuery}>
                            <div className="input-group">
                                <label>Subject</label>
                                <input required placeholder="e.g., Payment status, Delivery delay" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Message</label>
                                <textarea required rows="5" placeholder="Describe your issue in detail..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                            </div>
                            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                                    Submit Query
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

export default Queries;
