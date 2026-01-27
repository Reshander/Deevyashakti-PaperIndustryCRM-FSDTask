import React, { useState, useEffect } from 'react';
import { getPOs, getSOs } from '../services/api';
import { FileText, ShoppingCart, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalPOs: 0,
        totalSOs: 0,
        verifiedSOs: 0,
        pendingSOs: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [poRes, soRes] = await Promise.all([getPOs(), getSOs()]);
                const sos = soRes.data;
                setStats({
                    totalPOs: poRes.data.length,
                    totalSOs: sos.length,
                    verifiedSOs: sos.filter(s => s.verification_status === 'Matched').length,
                    pendingSOs: sos.filter(s => s.verification_status === 'Pending').length
                });
            } catch (error) {
                console.error('Failed to fetch stats');
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Purchase Orders', value: stats.totalPOs, icon: FileText, color: '#3b82f6' },
        { label: 'Total Sales Orders', value: stats.totalSOs, icon: ShoppingCart, color: '#8b5cf6' },
        { label: 'Verified Orders', value: stats.verifiedSOs, icon: CheckCircle, color: '#10b981' },
        { label: 'Pending Verification', value: stats.pendingSOs, icon: Clock, color: '#f59e0b' },
    ];

    return (
        <div>
            <div className="section-header">
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Dashboard Overview</h1>
                    <p style={{ color: '#64748b' }}>Quick summary of business activity</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {statCards.map((card, index) => (
                    <div key={index} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', maxWidth: 'none' }}>
                        <div style={{ backgroundColor: `${card.color}10`, color: card.color, padding: '1rem', borderRadius: '1rem', marginRight: '1.25rem' }}>
                            <card.icon size={24} />
                        </div>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '500' }}>{card.label}</p>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.25rem' }}>{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <div className="card" style={{ maxWidth: 'none', padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>System Status</h3>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <div style={{ flex: 1, padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem' }}>
                            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Verification Logic</p>
                            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Active and monitoring all SO against PO. Mismatches are flagged for manual review.</p>
                        </div>
                        <div style={{ flex: 1, padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem' }}>
                            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>OTP Authentication</p>
                            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Secure login enabled for all registered customer emails.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
