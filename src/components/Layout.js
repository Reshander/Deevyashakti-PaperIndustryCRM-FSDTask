import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    ShoppingCart,
    LogOut,
    MessageSquare,
    CreditCard,
    Plus,
    X
} from 'lucide-react';

const Layout = ({ user, onLogout }) => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/po', label: 'Purchase Order', icon: FileText },
        { path: '/so', label: 'Sales Order', icon: ShoppingCart },
        { path: '/invoices', label: 'Invoices', icon: CreditCard },
        { path: '/queries', label: 'Queries', icon: MessageSquare },
    ];

    return (
        <div className="layout">
            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header" style={{ marginBottom: '2rem', padding: '0 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {!isCollapsed && (
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>Deeevyashakti</h2>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>{user.name}</p>
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.5rem' }}
                    >
                        {isCollapsed ? <Plus size={20} /> : <X size={20} />}
                    </button>
                </div>

                <nav style={{ flex: 1 }}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            title={isCollapsed ? item.label : ''}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <button
                    onClick={onLogout}
                    className="nav-link"
                    style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', marginTop: 'auto' }}
                    title={isCollapsed ? 'Logout' : ''}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
