import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        phonenumber: '',
        email: '',
        count: '',
        idproof: '',
    });

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

        try {
            const response = await fetch(`${backendUrl}/api/y_reg/regusers/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus({
                    type: 'success',
                    message: 'Registration successful! Check your email for QR code.'
                });
                setFormData({
                    name: '',
                    phonenumber: '',
                    email: '',
                    count: '',
                    idproof: ''
                });
            } else {
                const data = await response.json();
                setStatus({
                    type: 'error',
                    message: JSON.stringify(data) || 'Registration failed.'
                });
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'Network error. Please try again.'
            });
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Event Registration</h2>

            {/* ✅ FIXED: React Router navigation */}
            <div className="admin-toggle">
                <button
                    type="button"
                    className="admin-btn"
                    onClick={() => navigate('/admin')}
                >
                    Admin Login
                </button>
            </div>

            {status.message && (
                <div className={`message ${status.type}`}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="register-form">
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

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Register Now'}
                </button>
            </form>
        </div>
    );
};

export default Register;
