import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Search, QrCode, LogOut, Edit2, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ total: 0, arrived: 0 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const [page, setPage] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);

    // Config
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    useEffect(() => {
        fetchUsers();
    }, [page, searchTerm, statusFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            let url = `${backendUrl}/api/y_reg/regusers/?page=${page}`;
            if (searchTerm) {
                url += `&search=${searchTerm}`;
            }
            if (statusFilter) {
                url += `&status=${statusFilter}`;
            }
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                let results = [];
                let total = 0;

                if (Array.isArray(data)) {
                    results = data;
                    total = data.length;
                    setNextPage(null);
                    setPrevPage(null);
                } else {
                    results = data.results || [];
                    total = data.count || 0;
                    setNextPage(data.next);
                    setPrevPage(data.previous);
                }

                setUsers(results);

                setStats(prev => ({
                    ...prev,
                    total: total,
                    arrived: results.filter(u => u.status === 'arrived').length
                }));
            } else {
                console.error("API Error:", data);
                setUsers([]);
            }

        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === 'registered' ? 'arrived' : 'registered';
        try {
            const response = await fetch(`${backendUrl}/api/y_reg/regusers/${id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleCountChange = async (id) => {
        const newCount = prompt("Enter new count:");
        if (newCount !== null) {
            try {
                const response = await fetch(`${backendUrl}/api/y_reg/regusers/${id}/`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ count: parseInt(newCount) })
                });
                if (response.ok) {
                    fetchUsers();
                }
            } catch (error) {
                console.error("Failed to update count", error);
            }
        }
    };

    const onScanSuccess = async (decodedText, decodedResult) => {
        // Stop scanning after success
        setShowScanner(false);

        // Parse ID from QR Text - expecting format like "Registration ID: <uuid>..."
        // Or if the QR just contains the UUID directly (simpler).
        // My utils.py generates: "Registration ID: <uuid>\nName..."

        let regId = decodedText;
        if (decodedText.startsWith("Registration ID:")) {
            const lines = decodedText.split('\n');
            const idLine = lines.find(line => line.startsWith("Registration ID:"));
            if (idLine) {
                regId = idLine.replace("Registration ID:", "").trim();
            }
        }

        try {
            const response = await fetch(`${backendUrl}/api/y_reg/regusers/scan-qr/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ registration_id: regId })
            });

            if (response.ok) {
                const user = await response.json();
                alert(`Success! ${user.name} marked as Arrived.`);
                fetchUsers();
            } else {
                alert("Error: User not found or invalid QR.");
            }
        } catch (error) {
            alert("Network error.");
        }
    };

    useEffect(() => {
        if (showScanner) {
            const scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );
            scanner.render(onScanSuccess, (error) => {
                // handle scan failure, usually ignore
            });

            return () => {
                scanner.clear().catch(error => console.error("Failed to clear scanner", error));
            };
        }
    }, [showScanner]);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1 className="dashboard-title">Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => {
                        let url = `${backendUrl}/api/y_reg/regusers/export-excel/?`;
                        if (searchTerm) url += `&search=${searchTerm}`;
                        if (statusFilter) url += `&status=${statusFilter}`;
                        window.location.href = url;
                    }} className="logout-btn" style={{ borderColor: '#4a90e2', color: '#4a90e2' }}>
                        Download Excel
                    </button>
                    <button onClick={onLogout} className="logout-btn"><LogOut size={18} /> Logout</button>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total Registered</div>
                </div>
                {/* For real stats we'd need a separate endpoint to get total arrived count across all pages */}
            </div>

            <div className="controls-bar">
                <div className="search-wrapper" style={{ flex: 1, position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Search by name, email, phone..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="search-icon" size={18} style={{ position: 'absolute', right: 15, top: 12, color: '#aaa' }} />
                </div>

                <div className="filter-wrapper">
                    <select
                        className="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="registered">Registered</option>
                        <option value="arrived">Arrived</option>
                    </select>
                </div>

                <button className="scan-btn" onClick={() => setShowScanner(true)}>
                    <QrCode size={20} /> Scan QR Code
                </button>
            </div>

            {showScanner && (
                <div className="qr-scanner-overlay">
                    <div className="scanner-box">
                        <div id="reader"></div>
                        <button className="close-scanner" onClick={() => setShowScanner(false)}>Close Scanner</button>
                    </div>
                </div>
            )}

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Count</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading...</td></tr>
                        ) : users.map(user => (
                            <tr key={user.id}>
                                <td data-label="Name">{user.name}</td>
                                <td data-label="Phone">{user.phonenumber}</td>
                                <td data-label="Count">{user.count || '-'}</td>
                                <td data-label="Status">
                                    <span className={`status-badge ${user.status}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td data-label="Actions">
                                    <button className="action-btn" onClick={() => handleCountChange(user.id)} title="Edit Count">
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="action-btn" onClick={() => handleStatusChange(user.id, user.status)} title="Toggle Status">
                                        <CheckCircle size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button
                    className="page-btn"
                    disabled={!prevPage}
                    onClick={() => setPage(p => p - 1)}
                >
                    <ChevronLeft size={20} />
                </button>
                <span style={{ alignSelf: 'center', opacity: 0.5 }}>Page {page}</span>
                <button
                    className="page-btn"
                    disabled={!nextPage}
                    onClick={() => setPage(p => p + 1)}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
