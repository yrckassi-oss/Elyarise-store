import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-canal-gray p-6 rounded-lg shadow-xl max-w-sm w-full">
                <h3 className="text-lg font-bold mb-4">{title}</h3>
                <p className="text-canal-light-gray mb-6">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition">
                        Annuler
                    </button>
                    <button onClick={onConfirm} className="bg-canal-red text-white py-2 px-4 rounded-md hover:bg-red-700 transition">
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
};
