
import React, { useState, useEffect, useCallback } from 'react';
import type { OrderDetails, Page, User } from './types';
import { AuthPage } from './components/AuthPage.tsx';
import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { ReabonnementForm } from './components/forms/ReabonnementForm';
import { ModificationForm } from './components/forms/ModificationForm';
import { ReactivationForm } from './components/forms/ReactivationForm';
import { TechnicienForm } from './components/forms/TechnicienForm';
import { CartPage } from './components/CartPage';
import { PaymentPage } from './components/PaymentPage.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
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

    const handleRegister = useCallback((contact: string, password: string) => {
        if (users.some(u => u.contact === contact)) {
            // In a real app, you'd show an error, but for this flow we log them in.
            handleLogin(contact, false);
        } else {
            setUsers(prev => [...prev, { contact, password }]);
            handleLogin(contact, false);
        }
    }, [users]);
    
    const handleLogin = (identifier: string, admin: boolean) => {
        setIsLoggedIn(true);
        setUserContact(identifier);
        setIsAdmin(admin);
        setCurrentPage(admin ? 'adminDashboard' : 'main');
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
            return <AuthPage onRegister={handleRegister} onLogin={handleLogin} />;
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
        <div className="bg-canal-dark-gray text-white min-h-screen flex flex-col font-sans">
            <Header
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                cartItemCount={cart.length}
                onCartClick={() => !isAdmin && navigateTo('cart')}
                isAdmin={isAdmin}
            />
            <main className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8">
                <div className="w-full max-w-4xl">
                    {renderPage()}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default App;
