import React, { useState, useEffect } from 'react';

interface InstallPromptProps {
    onClose: () => void;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ onClose }) => {
    const [appUrl, setAppUrl] = useState('');

    useEffect(() => {
        // Use the specific AI Studio method to get the correct preview URL asynchronously.
        // This prevents the QR code from pointing to the editor's URL.
        // FIX: Cast window.aistudio to 'any' to resolve TypeScript error for getPreviewUrl.
        if (window.aistudio && typeof (window.aistudio as any).getPreviewUrl === 'function') {
            (window.aistudio as any).getPreviewUrl().then((url: string) => {
                setAppUrl(url);
            });
        } else {
            // Fallback for other environments, though less reliable here.
            setAppUrl(window.location.href);
        }
    }, []); // Empty dependency array ensures this runs only once on mount.

    const qrCodeUrl = appUrl 
        ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}`
        : '';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-canal-gray p-8 rounded-lg shadow-xl max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-2xl font-bold mb-4">Installer l'application</h3>
                <p className="text-canal-light-gray mb-6">Scannez ce code avec votre smartphone pour installer l'application.</p>
                
                <div className="bg-white p-4 inline-block rounded-md">
                   {qrCodeUrl ? (
                        <img src={qrCodeUrl} alt="QR Code pour installer l'application" width="200" height="200" />
                    ) : (
                        <div className="w-[200px] h-[200px] flex items-center justify-center text-gray-500">
                            Génération du code...
                        </div>
                    )}
                </div>
                
                <div className="mt-6 text-sm">
                    <p className="text-canal-light-gray mb-2">Si le QR code ne fonctionne pas, tapez cette URL dans le navigateur de votre téléphone :</p>
                    <input 
                        type="text"
                        value={appUrl || 'Chargement...'}
                        readOnly
                        className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white text-center font-mono"
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        <strong>Important :</strong> Pour que cela fonctionne, votre téléphone et votre ordinateur doivent être connectés au même réseau Wi-Fi.
                    </p>
                </div>

                <div className="mt-8">
                    <button onClick={onClose} className="bg-canal-red text-white py-2 px-6 rounded-md hover:bg-red-700 transition">
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};