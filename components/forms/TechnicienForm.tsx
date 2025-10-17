import React, { useState, useEffect } from 'react';
import type { OrderDetails } from '../../types';
import { TechnicienService } from '../../types';
import { TECHNICIEN_SERVICES, CONTACT_PATTERN, CONTACT_PATTERN_MESSAGE } from '../../constants';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';


interface TechnicienFormProps {
    userContact: string;
    onAddToCart: (details: Omit<OrderDetails, 'id' | 'status' | 'createdAt'>) => void;
    onBack: () => void;
}

export const TechnicienForm: React.FC<TechnicienFormProps> = ({ userContact, onAddToCart, onBack }) => {
    const [service, setService] = useState<TechnicienService | ''>('');
    const [secondaryContact, setSecondaryContact] = useState('');
    const [description, setDescription] = useState('');
    const [total, setTotal] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        const selectedService = TECHNICIEN_SERVICES.find(s => s.name === service);
        setTotal(selectedService ? selectedService.price : 0);
    }, [service]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!service) {
            setError("Veuillez sélectionner une prestation.");
            return;
        }
        if (secondaryContact && !CONTACT_PATTERN.test(secondaryContact)) {
            setError(`Format du contact secondaire invalide. ${CONTACT_PATTERN_MESSAGE}`);
            return;
        }
        if (!description) {
            setError("Veuillez fournir une description de votre requête.");
            return;
        }

        const details = {
            type: 'Demande de technicien' as const,
            clientInfo: {
                mainContact: userContact,
                secondaryContact: secondaryContact,
            },
            details: {
                service,
                description,
            },
            totalAmount: total,
        };
        onAddToCart(details);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-canal-gray p-8 rounded-lg shadow-2xl space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-4">Besoin d'un Technicien</h2>
            
            <div>
                <label htmlFor="service" className="block text-sm font-medium text-canal-light-gray">Prestation</label>
                <select id="service" value={service} onChange={e => setService(e.target.value as TechnicienService)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 mt-1 text-white focus:ring-canal-red focus:border-canal-red">
                    <option value="" disabled>-- Choisir une prestation --</option>
                    {TECHNICIEN_SERVICES.map(s => <option key={s.name} value={s.name}>{s.name} - {s.price}F</option>)}
                </select>
            </div>
            
            <div>
                <label htmlFor="secondaryContact" className="block text-sm font-medium text-canal-light-gray">Contact secondaire (optionnel)</label>
                <input id="secondaryContact" type="tel" value={secondaryContact} onChange={e => setSecondaryContact(e.target.value)} placeholder="+225XXXXXXXXXX" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 mt-1 text-white focus:ring-canal-red focus:border-canal-red"/>
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-canal-light-gray">Description de la requête</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} required className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 mt-1 text-white focus:ring-canal-red focus:border-canal-red"/>
            </div>
            
            <div className="text-center text-2xl font-bold pt-4">
                Total: <span className="text-canal-red">{total.toLocaleString('fr-FR')} F CFA</span>
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