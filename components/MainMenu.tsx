
import React from 'react';
import type { Page } from '../types';

interface MainMenuProps {
    navigateTo: (page: Page) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ navigateTo }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const page = e.target.value as Page;
        if (page) {
            navigateTo(page);
        }
    };

    return (
        <div className="bg-canal-gray p-8 rounded-lg shadow-2xl animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-6">Menu Principal</h2>
            <div className="space-y-4">
                <label htmlFor="operation" className="block text-lg font-medium text-center text-canal-light-gray">Quelle opération souhaitez-vous effectuer ?</label>
                <select
                    id="operation"
                    onChange={handleChange}
                    defaultValue=""
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 mt-1 text-white focus:ring-canal-red focus:border-canal-red transition"
                >
                    <option value="" disabled>-- Choisir une opération --</option>
                    <option value="reabonnement">Réabonnement</option>
                    <option value="modification">Modification de formule</option>
                    <option value="reactivation">Réactivation des chaînes</option>
                    <option value="technicien">Besoin d’un technicien</option>
                </select>
            </div>
        </div>
    );
};
