import React, { useState } from 'react';
import { login as loginApi, verifyOtp } from '../services/api';
import { toast } from 'react-toastify';
import { Mail, ShieldCheck } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await loginApi(email);
            toast.success('OTP sent to your email (simulated)');
            // In a real app, we wouldn't get the OTP back in the response
            // But for this assignment, I'm logging it to the console and filling it if needed
            console.log('OTP received:', response.data.otp);
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await verifyOtp(email, otp);
            onLogin(response.data.user);
            toast.success('Welcome back!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ backgroundColor: '#2563eb', width: '3rem', height: '3rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <ShieldCheck color="white" size={24} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Deeevyashakti CRM</h1>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Secure Portal Access</p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSendOtp}>
                        <div className="input-group">
                            <label>Registered Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    style={{ paddingLeft: '2.5rem' }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="input-group">
                            <label>Verification Code</label>
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                maxLength="6"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                                A code has been sent to {email}
                            </p>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Verifying...' : 'Login'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            style={{ width: '100%', background: 'none', border: 'none', color: '#64748b', marginTop: '1rem', cursor: 'pointer', fontSize: '0.875rem' }}
                        >
                            Change Email
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
