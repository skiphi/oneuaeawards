import React, { useState } from 'react';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        phonenumber: '',
        email: '',
        count: '',
        idproof: '',
        idproof: '',
    });
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

        // Simple logic for admin login vs registration (just checking fields for now)
        // Since usertype isn't needed, we are basically just registering users or "logging in" admin
        // But for this requirement "provide an option for admin login", I will just show a placeholder or different form
        if (isAdminLogin) {
            // Placeholder for admin login logic
            setStatus({ type: 'error', message: 'Admin login not yet implemented.' });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/y_reg/regusers/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus({ type: 'success', message: 'Registration successful! Check your email for QR code.' });
                setFormData({ name: '', phonenumber: '', email: '', count: '', idproof: '' });
            } else {
                const data = await response.json();
                setStatus({ type: 'error', message: JSON.stringify(data) || 'Registration failed.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Network error. Please try again.' });
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Event Registration</h2>

            <div className="admin-toggle">
                <a href="/admin" className="admin-btn">
                    Admin Login
                </a>
            </div>

            {status.message && (
                <div className={`message ${status.type}`}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="register-form">
                {!isAdminLogin ? (
                    <>
                        <div className="form-group">
                            <label htmlFor="name">Full Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phonenumber">Phone Number *</label>
                            <input
                                type="tel"
                                id="phonenumber"
                                name="phonenumber"
                                className="form-input"
                                value={formData.phonenumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="count">Count</label>
                            <input
                                type="number"
                                id="count"
                                name="count"
                                className="form-input"
                                value={formData.count}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="idproof">ID Proof (Optional)</label>
                            <input
                                type="text"
                                id="idproof"
                                name="idproof"
                                className="form-input"
                                value={formData.idproof}
                                onChange={handleChange}
                            />
                        </div>

                        {/* ID Number field removed as per Royal update */}


                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Register Now'}
                        </button>
                    </>
                ) : (
                    <>
                        {/* Placeholder Admin Inputs */}
                        <div className="form-group">
                            <label htmlFor="adminUser">Username</label>
                            <input type="text" id="adminUser" className="form-input" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="adminPass">Password</label>
                            <input type="password" id="adminPass" className="form-input" />
                        </div>
                        <button type="submit" className="submit-btn" disabled={loading}>Login</button>
                    </>
                )}
            </form>
        </div>
    );
};

export default Register;
