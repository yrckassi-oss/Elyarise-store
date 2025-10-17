import React, { useState, useMemo } from 'react';
import type { OrderDetails } from '../../types';
import { FormuleName } from '../../types';
import { FORMULES, SUBSCRIBER_NUMBER_PATTERN, SUBSCRIBER_NUMBER_PATTERN_MESSAGE } from '../../constants';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';

interface ModificationFormProps {
    userContact: string;
    onAddToCart: (details: Omit<OrderDetails, 'id' | 'status' | 'createdAt'>) => void;
    onBack: () => void;
}

export const ModificationForm: React.FC<ModificationFormProps> = ({ userContact, onAddToCart, onBack }) => {
    const [currentFormule, setCurrentFormule] = useState<FormuleName | ''>('');
    const [desiredFormule, setDesiredFormule] = useState<FormuleName | ''>('');
    const [subscriptionInfo, setSubscriptionInfo] = useState('');
    const [error, setError] = useState('');

    const currentPrice = useMemo(() => FORMULES.find(f => f.name === currentFormule)?.price || 0, [currentFormule]);
    const desiredPrice = useMemo(() => FORMULES.find(f => f.name === desiredFormule)?.price || 0, [desiredFormule]);
    const amountToPay = useMemo(() => Math.max(0, desiredPrice - currentPrice), [currentPrice, desiredPrice]);

    const availableDesiredFormules = useMemo(() => {
        if (!currentFormule) return [];
        return FORMULES.filter(f => f.price > currentPrice);
    }, [currentFormule, currentPrice]);

    const handleCurrentFormuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCurrent = e.target.value as FormuleName;
        setCurrentFormule(newCurrent);
        setDesiredFormule('');
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!currentFormule || !desiredFormule) {
            setError('Veuillez sélectionner les deux formules.');
            return;
        }
        if (!SUBSCRIBER_NUMBER_PATTERN.test(subscriptionInfo)) {
             setError(SUBSCRIBER_NUMBER_PATTERN_MESSAGE);
            return;
        }
        const details = {
            type: 'Modification de formule' as const,
            clientInfo: { mainContact: userContact, subscriberNumber: subscriptionInfo },
            details: { from: currentFormule, to: desiredFormule, currentPrice, desiredPrice },
            totalAmount: amountToPay,
        };
        onAddToCart(details);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-canal-gray p-8 rounded-lg shadow-2xl space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-4">Modification de Formule</h2>

            <div>
                <label htmlFor="currentFormule" className="block text-sm font-medium text-canal-light-gray">Formule actuelle</label>
                <select id="currentFormule" value={currentFormule} onChange={handleCurrentFormuleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 mt-1 text-white focus:ring-canal-red focus:border-canal-red">
                    <option value="" disabled>-- Choisir --</option>
                    {FORMULES.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                </select>
            </div>

            <div>
                <label htmlFor="desiredFormule" className="block text-sm font-medium text-canal-light-gray">Formule souhaitée</label>
                <select id="desiredFormule" value={desiredFormule} onChange={e => setDesiredFormule(e.target.value as FormuleName)} disabled={!currentFormule} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 mt-1 text-white focus:ring-canal-red focus:border-canal-red disabled:opacity-50">
                    <option value="" disabled>-- Choisir --</option>
                    {availableDesiredFormules.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                </select>
            </div>
            
            <div>
                <label htmlFor="subscriptionInfo" className="block text-sm font-medium text-canal-light-gray">Numéro d’abonné</label>
                <input id="subscriptionInfo" type="text" value={subscriptionInfo} onChange={e => setSubscriptionInfo(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 mt-1 text-white focus:ring-canal-red focus:border-canal-red"/>
            </div>

            <div className="border-t border-gray-600 pt-4 space-y-2 text-center">
                <p>Montant à payer: <span className="text-2xl font-bold text-canal-red">{amountToPay.toLocaleString('fr-FR')} F CFA</span></p>
            </div>
            
             {error && <p className="text-canal-red text-sm text-center">{error}</p>}

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
                <button type="button" onClick={onBack} className="flex items-center justify-center space-x-2 bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition duration-300 font-semibold">
                    <ArrowLeftIcon className="h-5 w-5"/>
                    <span>Précédent</span>
                </button>
                <button type="submit" className="flex items-center justify-center space-x-2 bg-canal-red text-white py-3 px-4 rounded-md hover:bg-red-700 transition duration-300 font-semibold">
                    <span>Ajouter au Panier</span>
                    <ArrowRightIcon className="h-5 w-5"/>
                </button>
            </div>
        </form>
    );
};