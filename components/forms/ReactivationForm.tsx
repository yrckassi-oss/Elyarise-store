import React, { useState } from 'react';
import type { OrderDetails } from '../../types';
import { SUBSCRIBER_NUMBER_PATTERN, SUBSCRIBER_NUMBER_PATTERN_MESSAGE } from '../../constants';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';

interface ReactivationFormProps {
    userContact: string;
    onAddToCart: (details: Omit<OrderDetails, 'id' | 'status' | 'createdAt'>) => void;
    onBack: () => void;
}

export const ReactivationForm: React.FC<ReactivationFormProps> = ({ userContact, onAddToCart, onBack }) => {
    const [subscriptionInfo, setSubscriptionInfo] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!SUBSCRIBER_NUMBER_PATTERN.test(subscriptionInfo)) {
            setError(SUBSCRIBER_NUMBER_PATTERN_MESSAGE);
            return;
        }

        const details = {
            type: 'Réactivation des chaînes' as const,
            clientInfo: {
                mainContact: userContact,
                subscriberNumber: subscriptionInfo,
            },
            details: {
                request: "Demande de réactivation des chaînes."
            },
            totalAmount: 0,
        };
        onAddToCart(details);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-canal-gray p-8 rounded-lg shadow-2xl space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-4">Réactivation des Chaînes</h2>
            <p className="text-center text-canal-light-gray -mt-4 mb-4">Ce service est gratuit.</p>
            
            <div>
                <label htmlFor="subscriptionInfo" className="block text-sm font-medium text-canal-light-gray">Numéro d’abonné</label>
                <input id="subscriptionInfo" type="text" value={subscriptionInfo} onChange={e => setSubscriptionInfo(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 mt-1 text-white focus:ring-canal-red focus:border-canal-red"/>
            </div>

            {error && <p className="text-canal-red text-sm text-center">{error}</p>}
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
                 <button type="button" onClick={onBack} className="flex items-center justify-center space-x-2 bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition duration-300 font-semibold">
                    <ArrowLeftIcon className="h-5 w-5"/>
                    <span>Précédent</span>
                </button>
                <button type="submit" className="flex items-center justify-center space-x-2 bg-canal-red text-white py-3 px-4 rounded-md hover:bg-red-700 transition duration-300 font-semibold">
                    <span>Ajouter la demande</span>
                    <ArrowRightIcon className="h-5 w-5"/>
                </button>
            </div>
        </form>
    );
};