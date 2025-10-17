import React from 'react';
import { CartIcon } from './icons/CartIcon';

interface HeaderProps {
    isLoggedIn: boolean;
    onLogout: () => void;
    cartItemCount: number;
    onCartClick: () => void;
    isAdmin: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout, cartItemCount, onCartClick, isAdmin }) => {
    return (
        <header className="bg-canal-gray p-4 shadow-lg flex justify-between items-center sticky top-0 z-50">
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-white">
                ELYARISE <span className="text-canal-red">CANAL+</span> STORE
            </h1>
            <div className="flex items-center space-x-4">
                {isLoggedIn && !isAdmin && (
                    <button onClick={onCartClick} className="relative text-white p-2 rounded-full hover:bg-gray-700 transition">
                        <CartIcon />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-1 block h-5 w-5 rounded-full bg-canal-red text-white text-xs flex items-center justify-center border-2 border-canal-gray">
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                )}
                {isLoggedIn && (
                    <button
                        onClick={onLogout}
                        className="bg-canal-red text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300 text-sm font-semibold"
                    >
                        Déconnexion
                    </button>
                )}
            </div>
        </header>
    );
};