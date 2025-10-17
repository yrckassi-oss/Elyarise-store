import React, { useState, useMemo } from 'react';
import type { User } from '../../types';
import { ConfirmationModal } from './ConfirmationModal';
import { TrashIcon } from '../icons/TrashIcon';
import { exportUsersToXLSX } from '../../utils/exporter';
import { DownloadIcon } from '../icons/DownloadIcon';

interface UserManagementProps {
    users: User[];
    onDelete: (contact: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ users, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.contact.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            onDelete(userToDelete.contact);
            setUserToDelete(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <input
                    type="text"
                    placeholder="Rechercher par contact..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-72 bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:ring-canal-red focus:border-canal-red"
                />
                 <button
                    onClick={() => exportUsersToXLSX(users)}
                    className="flex items-center justify-center space-x-2 w-full sm:w-auto bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-semibold"
                >
                    <DownloadIcon className="h-5 w-5"/>
                    <span>Exporter (.xlsx)</span>
                </button>
            </div>

            <div className="overflow-x-auto bg-canal-dark-gray rounded-lg">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="p-3">Contact</th>
                            <th className="p-3">Mot de passe (pour démo)</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? filteredUsers.map(user => (
                            <tr key={user.contact} className="border-b border-gray-800 hover:bg-gray-800">
                                <td className="p-3 font-medium">{user.contact}</td>
                                <td className="p-3 text-canal-light-gray">{user.password}</td>
                                <td className="p-3 text-right">
                                    <button
                                        onClick={() => handleDeleteClick(user)}
                                        className="text-canal-red hover:text-red-400 transition"
                                        title="Supprimer l'utilisateur"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={3} className="text-center p-6 text-canal-light-gray">
                                    Aucun utilisateur trouvé.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <ConfirmationModal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={confirmDelete}
                title="Confirmer la Suppression"
                message={`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userToDelete?.contact} ? Cette action est irréversible.`}
            />
        </div>
    );
};
