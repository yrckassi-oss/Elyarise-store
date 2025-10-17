import React, { useState, useEffect, useCallback } from 'react';
import type { OrderDetails } from '../../types';
import { FormuleName } from '../../types';
import { FORMULES, MONTH_OPTIONS, CHARME_PRICE, DSTV_PRICES, NETFLIX_PRICES, SUBSCRIBER_NUMBER_PATTERN, SUBSCRIBER_NUMBER_PATTERN_MESSAGE } from '../../constants';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';

interface ReabonnementFormProps {
    userContact: string;
    onAddToCart: (details: Omit<OrderDetails, 'id' | 'status' | 'createdAt'>) => void;
    onBack: () => void;
}

export const ReabonnementForm: React.FC<ReabonnementFormProps> = ({ userContact, onAddToCart, onBack }) => {
    const [formule, setFormule] = useState<FormuleName>(FormuleName.ACCESS);
    const [months, setMonths] = useState(1);
    const [subscriberNumber, setSubscriberNumber] = useState('');
    const [addCharme, setAddCharme] = useState(false);
    const [addDstv, setAddDstv] = useState(false);
    const [netflixScreens, setNetflixScreens] = useState(0); // 0 means no Netflix
    const [total, setTotal] = useState(0);
    const [error, setError] = useState('');

    const isDstvAvailable = formule !== FormuleName.ACCESS;
    const isToutCanal = formule === FormuleName.TOUT_CANAL;

    const handleFormuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFormule = e.target.value as FormuleName;
        setFormule(newFormule);
        setAddCharme(false);
        setNetflixScreens(0);
        if (newFormule === FormuleName.TOUT_CANAL) {
            setAddDstv(true);
            setNetflixScreens(1);
        } else {
            setAddDstv(false);
        }
    };

    const calculateTotal = useCallback(() => {
        const selectedFormule = FORMULES.find(f => f.name === formule);
        if (!selectedFormule) return 0;
        let currentTotal = selectedFormule.price * months;
        if (addCharme) currentTotal += CHARME_PRICE * months;
        if (addDstv && isDstvAvailable && !isToutCanal) {
            currentTotal += DSTV_PRICES[formule as keyof typeof DSTV_PRICES] * months;
        }
        if (netflixScreens > 0) {
            const netflixOption = NETFLIX_PRICES[formule].find(o => o.screens === netflixScreens);
            if (netflixOption) currentTotal += netflixOption.price * months;
        }
        setTotal(currentTotal);
    }, [formule, months, addCharme, addDstv, netflixScreens, isDstvAvailable, isToutCanal]);

    useEffect(() => {
        calculateTotal();
    }, [calculateTotal]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!SUBSCRIBER_NUMBER_PATTERN.test(subscriberNumber)) {
            setError(SUBSCRIBER_NUMBER_PATTERN_MESSAGE);
            return;
        }
        const details = {
            type: 'Réabonnement' as const,
            clientInfo: { mainContact: userContact, subscriberNumber },
            details: { formule, months, options: { charme: addCharme, dstv: addDstv, netflixScreens: netflixScreens > 0 ? `${netflixScreens} écran(s)`: 'Non' } },
            totalAmount: total,
        };
        onAddToCart(details);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-canal-gray p-8 rounded-lg shadow-2xl space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-4">Réabonnement</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="formule" className="block text-sm font-medium text-canal-light-gray">Formule</label>
                    <select id="formule" value={formule} onChange={handleFormuleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 mt-1 text-white focus:ring-canal-red focus:border-canal-red">
                        {FORMULES.map(f => <option key={f.name} value={f.name}>{f.name} - {f.price}F</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="months" className="block text-sm font-medium text-canal-light-gray">Nombre de mois</label>
                    <select id="months" value={months} onChange={e => setMonths(Number(e.target.value))} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 mt-1 text-white focus:ring-canal-red focus:border-canal-red">
                        {MONTH_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="subscriberNumber" className="block text-sm font-medium text-canal-light-gray">Numéro d’abonné ou de réabonnement</label>
                <input id="subscriberNumber" type="text" value={subscriberNumber} onChange={e => setSubscriberNumber(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 mt-1 text-white focus:ring-canal-red focus:border-canal-red"/>
            </div>

            <fieldset className="border border-gray-600 p-4 rounded-md">
                <legend className="text-lg font-medium px-2 text-canal-light-gray">Options</legend>
                <div className="space-y-4 pt-2">
                    <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" checked={addCharme} onChange={e => setAddCharme(e.target.checked)} className="h-5 w-5 rounded bg-gray-700 border-gray-500 text-canal-red focus:ring-canal-red"/><span>CHARME ({CHARME_PRICE}F/mois)</span></label>
                    <label className={`flex items-center space-x-3 ${!isDstvAvailable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}><input type="checkbox" checked={addDstv} onChange={e => setAddDstv(e.target.checked)} disabled={!isDstvAvailable || isToutCanal} className="h-5 w-5 rounded bg-gray-700 border-gray-500 text-canal-red focus:ring-canal-red disabled:opacity-70"/><span>DStv English Plus ({isToutCanal ? 'Offert' : `${DSTV_PRICES[formule as keyof typeof DSTV_PRICES] || 'N/A'}F/mois`})</span></label>
                    <div>
                        <label htmlFor="netflix" className="block text-sm font-medium text-canal-light-gray mb-1">Netflix</label>
                        <select id="netflix" value={netflixScreens} onChange={e => setNetflixScreens(Number(e.target.value))} disabled={isToutCanal && netflixScreens === 1} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 text-white focus:ring-canal-red focus:border-canal-red disabled:opacity-70">
                            <option value="0">Aucun</option>
                            {NETFLIX_PRICES[formule].map(opt => (
                                <option key={opt.screens} value={opt.screens}>
                                    {opt.screens} écran(s) - {opt.price}F {isToutCanal && opt.screens === 1 ? '(Offert)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </fieldset>

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
