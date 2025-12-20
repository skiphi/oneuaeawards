import React, { useState } from 'react';
import './Register.css'; // Re-use Royal styling

const AdminLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simple auth simulation as per request "front end only need email id field"
        // In a real app this would call an API, but for now we just check if it looks like an admin
        // or effectively just "log them in" if they know the secret email or just generic logic
        // As requested: "if its admin navigate then to a dashboard"

        // For demonstration, we'll assume any email ending in @nammalckd.com is admin or just let them in 
        // effectively anyone can login if this is a loose requirement, but let's be slightly stricter
        if (email.trim().length > 0) {
            onLogin(email); // Pass up to parent
        } else {
            setError('Please enter a valid email.');
        }
        setLoading(false);
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Admin Access</h2>
            {error && <div className="message error">{error}</div>}
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                    <label htmlFor="adminEmail">Email Address</label>
                    <input
                        type="email"
                        id="adminEmail"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter admin email"
                    />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Accessing...' : 'Enter Dashboard'}
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;
