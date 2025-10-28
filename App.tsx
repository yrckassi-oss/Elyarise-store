import React, { useState, useEffect, useCallback } from 'react';
import type { OrderDetails, Page, User } from './types';
import { AuthPage } from './components/AuthPage';
import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { ReabonnementForm } from './components/forms/ReabonnementForm';
import { ModificationForm } from './components/forms/ModificationForm';
import { ReactivationForm } from './components/forms/ReactivationForm';
import { TechnicienForm } from './components/forms/TechnicienForm';
import { CartPage } from './components/CartPage';
import { PaymentPage } from './components/PaymentPage';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

function App() {
    // --- STATE MANAGEMENT ---
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userContact, setUserContact] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentPage, setCurrentPage] = useState<Page>('auth');
    const [cart, setCart] = useState<Omit<OrderDetails, 'id' | 'status' | 'createdAt'>[]>([]);

    // Persisted state for users and orders
    const [users, setUsers] = useState<User[]>(() => {
        try {
            const storedUsers = localStorage.getItem('elyrise-users');
            return storedUsers ? JSON.parse(storedUsers) : [];
        } catch (error) {
            return [];
        }
    });

    const [orders, setOrders] = useState<OrderDetails[]>(() => {
        try {
            const storedOrders = localStorage.getItem('elyrise-orders');
            return storedOrders ? JSON.parse(storedOrders) : [];
        } catch (error) {
            return [];
        }
    });

    // --- EFFECTS ---
    useEffect(() => {
        localStorage.setItem('elyrise-users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('elyrise-orders', JSON.stringify(orders));
    }, [orders]);


    // --- HANDLERS ---
    const navigateTo = (page: Page) => {
        setCurrentPage(page);
    };

    const setLoginState = (identifier: string, admin: boolean) => {
        setIsLoggedIn(true);
        setUserContact(identifier);
        setIsAdmin(admin);
        setCurrentPage(admin ? 'adminDashboard' : 'main');
    };

    const handleRegister = useCallback((contact: string, password: string): boolean => {
        if (users.some(u => u.contact === contact)) {
            return false; // User already exists
        }
        setUsers(prev => [...prev, { contact, password }]);
        return true; // Registration successful
    }, [users]);
    
    const handleUserLogin = (contact: string, password: string): boolean => {
        const user = users.find(u => u.contact === contact && u.password === password);
        if (user) {
            setLoginState(user.contact, false);
            return true;
        }
        return false; // Invalid credentials
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserContact('');
        setIsAdmin(false);
        setCurrentPage('auth');
        setCart([]);
    };

    const addToCart = (item: Omit<OrderDetails, 'id' | 'status' | 'createdAt'>) => {
        setCart(prevCart => [...prevCart, item]);
        setCurrentPage('cart');
    };

    const removeFromCart = (index: number) => {
        setCart(prevCart => prevCart.filter((_, i) => i !== index));
    };

    const handleOrderComplete = (finalCart: typeof cart, paymentMethod: string) => {
// Fix: Use a type assertion to fix discriminated union issue after spreading item.
        const newOrders: OrderDetails[] = finalCart.map(item => ({
            ...item,
            id: `${Date.now()}-${Math.random()}`,
            status: 'En attente',
            createdAt: new Date().toISOString(),
        } as OrderDetails));
        setOrders(prev => [...prev, ...newOrders]);
        setCart([]);
        // The PaymentPage component will handle navigation after this.
    };

    const handleDeleteUser = (contact: string) => {
        setUsers(prev => prev.filter(u => u.contact !== contact));
    };

    const handleUpdateOrderStatus = (orderId: string, status: 'Validée' | 'En attente') => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    };
    
    const handleDeleteOrder = (orderId: string) => {
        setOrders(prev => prev.filter(o => o.id !== orderId));
    };

    // --- RENDER LOGIC ---
    const renderPage = () => {
        if (!isLoggedIn) {
            return <AuthPage 
                onRegister={handleRegister} 
                onUserLogin={handleUserLogin}
                onAdminLogin={(identifier) => setLoginState(identifier, true)}
            />;
        }
        if (isAdmin) {
            return <AdminDashboard 
                adminId={userContact} 
                users={users}
                orders={orders}
                onDeleteUser={handleDeleteUser}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onDeleteOrder={handleDeleteOrder}
            />;
        }
        switch (currentPage) {
            case 'main':
                return <MainMenu navigateTo={navigateTo} />;
            case 'reabonnement':
                return <ReabonnementForm userContact={userContact} onAddToCart={addToCart} onBack={() => navigateTo('main')} />;
            case 'modification':
                return <ModificationForm userContact={userContact} onAddToCart={addToCart} onBack={() => navigateTo('main')} />;
            case 'reactivation':
                return <ReactivationForm userContact={userContact} onAddToCart={addToCart} onBack={() => navigateTo('main')} />;
            case 'technicien':
                return <TechnicienForm userContact={userContact} onAddToCart={addToCart} onBack={() => navigateTo('main')} />;
            case 'cart':
                 const cartWithTempIds = cart.map((item, index) => ({ ...item, id: index.toString() }));
                return <CartPage cart={cartWithTempIds} onRemoveItem={(id) => removeFromCart(parseInt(id, 10))} onBack={() => navigateTo('main')} onCheckout={() => navigateTo('payment')} />;
            case 'payment':
                 const paymentCartWithTempIds = cart.map((item, index) => ({ ...item, id: index.toString() }));
                return <PaymentPage cart={paymentCartWithTempIds} onBack={() => navigateTo('main')} onOrderComplete={handleOrderComplete} onBackToCart={() => navigateTo('cart')} />;
            default:
                return <MainMenu navigateTo={navigateTo} />;
        }
    };

    return (
        <div className="bg-canal-dark-gray text-white h-full flex flex-col font-sans">
            <Header
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                cartItemCount={cart.length}
                onCartClick={() => !isAdmin && navigateTo('cart')}
                isAdmin={isAdmin}
            />
            <main className="flex-grow p-4 sm:p-6 md:p-8 overflow-y-auto">
                <div className="w-full max-w-4xl mx-auto">
                    {renderPage()}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default App;