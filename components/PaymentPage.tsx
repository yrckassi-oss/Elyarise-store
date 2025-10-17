import React, { useState } from 'react';
import type { OrderDetails } from '../types';
import { generateOrderEmailBody } from '../services/geminiService';
import { generateInvoicePDF } from '../utils/invoiceGenerator';
import { DownloadIcon } from './icons/DownloadIcon';

type CartItemForPayment = Omit<OrderDetails, 'id' | 'status' | 'createdAt'> & { id: string };

interface PaymentPageProps {
    cart: CartItemForPayment[];
    onBack: () => void;
    onOrderComplete: (cart: Omit<OrderDetails, 'id' | 'status' | 'createdAt'>[], paymentMethod: string) => void;
    onBackToCart: () => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ cart, onBack, onOrderComplete, onBackToCart }) => {
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [error, setError] = useState('');
    const [finalPaymentMethod, setFinalPaymentMethod] = useState<string>('');
    
    // Create a version of the cart without the temporary id for processing
    const cartForProcessing = cart.map(({ id, ...rest }) => rest);
    const totalAmount = cartForProcessing.reduce((sum, item) => sum + item.totalAmount, 0);

    const handlePayment = async (method: 'WAVE' | 'Orange Money' | 'Gratuit') => {
        setStatus('sending');
        setError('');
        setFinalPaymentMethod(method);
        
        try {
            // We need to pass the cart with all details for the email, even if we don't store the temp ID
            const tempOrderDetailsForEmail = cart.map(item => ({...item, status: 'En attente', createdAt: new Date().toISOString()}) as OrderDetails)
            await generateOrderEmailBody(tempOrderDetailsForEmail, method);
            setStatus('sent');
            onOrderComplete(cartForProcessing, method);
        } catch (e) {
            console.error(e);
            setError('Une erreur est survenue lors de l\'envoi de la notification. Votre commande est peut-être passée. Veuillez contacter le support.');
            setStatus('idle');
        }

        if (method === 'WAVE' && totalAmount > 0) {
            const waveUrl = `https://w.wave.com/send/2250787853061/?amount=${totalAmount}`;
            window.open(waveUrl, '_blank');
        }
    };

    if (status === 'sent') {
        const fullOrderDetailsForInvoice = cart.map(item => ({ ...item, status: 'En attente', createdAt: new Date().toISOString() }) as OrderDetails);
        return (
             <div className="bg-canal-gray p-8 rounded-lg shadow-2xl text-center animate-fade-in space-y-6 max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-green-500">Commande Validée !</h2>
                <p className="text-canal-light-gray">
                    Votre commande a été enregistrée.
                    Un email de confirmation a été envoyé à yrc.kassi@gmail.com.
                </p>

                <button 
                    onClick={() => generateInvoicePDF(fullOrderDetailsForInvoice, finalPaymentMethod)}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300 font-semibold"
                >
                    <DownloadIcon className="h-5 w-5" />
                    <span>Télécharger la facture</span>
                </button>

                {finalPaymentMethod === 'Orange Money' && (
                    <div className="bg-gray-800 p-4 rounded-md text-left">
                        <p className="font-semibold mb-2">Rappel pour votre paiement Orange Money :</p>
                        <p className="text-sm">Veuillez composer la syntaxe appropriée pour payer <span className="font-bold">{totalAmount.toLocaleString('fr-FR')} F CFA</span> au <span className="font-bold">+2250787853061</span>.</p>
                    </div>
                )}
                 <button onClick={onBack} className="mt-4 bg-canal-red text-white py-2 px-6 rounded-md hover:bg-red-700 transition duration-300 font-semibold">
                    Retour au menu
                </button>
            </div>
        );
    }
    
    if (totalAmount === 0 && status === 'idle') {
        handlePayment('Gratuit');
        return (
             <div className="bg-canal-gray p-8 rounded-lg shadow-2xl text-center animate-fade-in">
                <p className="text-canal-light-gray">Traitement de votre demande gratuite...</p>
            </div>
        )
    }

    return (
        <div className="bg-canal-gray p-8 rounded-lg shadow-2xl animate-fade-in max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center mb-2">Récapitulatif & Paiement</h2>
            <div className="bg-gray-800 p-4 rounded-md mb-6 text-sm max-h-48 overflow-y-auto">
                 {cart.map(item => (
                    <div key={item.id} className="pb-2 mb-2 border-b border-gray-700 last:border-b-0 last:pb-0 last:mb-0">
                        <p className="flex justify-between"><strong>{item.type}</strong> <span>{item.totalAmount > 0 ? `${item.totalAmount.toLocaleString('fr-FR')} F` : 'Gratuit'}</span></p>
                    </div>
                ))}
                <p className="mt-4 text-lg flex justify-between"><strong>Total à Payer:</strong> <span className="text-canal-red font-bold">{totalAmount.toLocaleString('fr-FR')} F CFA</span></p>
            </div>

            <div className="space-y-4">
                <p className="text-center font-medium">Choisissez votre moyen de paiement :</p>
                <button 
                    onClick={() => handlePayment('WAVE')} 
                    disabled={status === 'sending'}
                    className="w-full bg-cyan-500 text-white py-3 px-4 rounded-md hover:bg-cyan-600 transition duration-300 font-semibold disabled:opacity-50"
                >
                    {status === 'sending' ? 'Envoi...' : 'Payer avec WAVE CI'}
                </button>
                <button 
                    onClick={() => handlePayment('Orange Money')}
                    disabled={status === 'sending'}
                    className="w-full bg-orange-500 text-white py-3 px-4 rounded-md hover:bg-orange-600 transition duration-300 font-semibold disabled:opacity-50"
                >
                    {status === 'sending' ? 'Envoi...' : 'Payer avec Orange Money'}
                </button>
            </div>
             {error && <p className="text-canal-red text-sm text-center mt-4">{error}</p>}
             <div className="text-center mt-6">
                <button onClick={onBackToCart} className="text-sm text-canal-light-gray hover:text-white transition">
                    Retourner au panier
                </button>
            </div>
        </div>
    );
};
