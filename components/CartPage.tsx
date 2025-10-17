import React from 'react';
import type { OrderDetails } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { TrashIcon } from './icons/TrashIcon';
import { CartIcon } from './icons/CartIcon';

// The cart items here have a temporary string id for key purposes
type CartItemForDisplay = Omit<OrderDetails, 'id' | 'status' | 'createdAt'> & { id: string };

interface CartPageProps {
    cart: CartItemForDisplay[];
    onRemoveItem: (id: string) => void;
    onBack: () => void;
    onCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ cart, onRemoveItem, onBack, onCheckout }) => {
    const totalAmount = cart.reduce((sum, item) => sum + item.totalAmount, 0);

    return (
        <div className="bg-canal-gray p-8 rounded-lg shadow-2xl animate-fade-in w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center space-x-2"><CartIcon /> <span>Votre Panier</span></h2>
            
            {cart.length === 0 ? (
                <div className="text-center text-canal-light-gray py-8">
                    <p>Votre panier est vide.</p>
                </div>
            ) : (
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                    {cart.map(item => (
                        <div key={item.id} className="bg-gray-800 p-4 rounded-md flex justify-between items-start">
                            <div className="flex-grow">
                                <p className="font-bold text-white">{item.type}</p>
                                <p className="text-sm text-canal-light-gray">{item.clientInfo.subscriberNumber || item.clientInfo.mainContact}</p>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                                <p className="font-semibold text-white">{item.totalAmount.toLocaleString('fr-FR')} F</p>
                                <button onClick={() => onRemoveItem(item.id)} className="text-canal-red hover:text-red-400 transition text-sm mt-1">
                                    <TrashIcon className="h-5 w-5 inline"/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {cart.length > 0 && (
                <div className="border-t border-gray-600 pt-4 mt-6">
                    <div className="text-right text-2xl font-bold">
                        Total: <span className="text-canal-red">{totalAmount.toLocaleString('fr-FR')} F CFA</span>
                    </div>
                </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
                <button 
                    onClick={onBack} 
                    className="flex items-center justify-center space-x-2 bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition duration-300 font-semibold"
                >
                    <ArrowLeftIcon className="h-5 w-5"/>
                    <span>Continuer les achats</span>
                </button>
                {cart.length > 0 && (
                    <button 
                        onClick={onCheckout} 
                        className="flex items-center justify-center space-x-2 bg-canal-red text-white py-3 px-4 rounded-md hover:bg-red-700 transition duration-300 font-semibold"
                    >
                        <span>Valider et Payer</span>
                        <ArrowRightIcon className="h-5 w-5"/>
                    </button>
                )}
            </div>
        </div>
    );
};
