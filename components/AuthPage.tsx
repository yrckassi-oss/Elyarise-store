import React, { useState } from 'react';
import { UserIcon } from './icons/UserIcon';
import { CONTACT_PATTERN, CONTACT_PATTERN_MESSAGE, ADMIN_USERNAME, ADMIN_PASSWORD } from '../constants';


interface AuthPageProps {
    onRegister: (contact: string, password: string) => void;
    onLogin: (identifier: string, isAdmin: boolean) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onRegister, onLogin }) => {
    // Common state
    const [error, setError] = useState('');
    const [isAdminLogin, setIsAdminLogin] = useState(false);

    // User registration state
    const [contact, setContact] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Admin login state
    const [adminUsername, setAdminUsername] = useState('');
    const [adminPassword, setAdminPassword] = useState('');

    const handleUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!CONTACT_PATTERN.test(contact)) {
            setError(`Format de contact invalide. ${CONTACT_PATTERN_MESSAGE}`);
            return;
        }
        if (userPassword.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }
        if (userPassword !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        
        onRegister(contact, userPassword);
    };

    const handleAdminSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (adminUsername === ADMIN_USERNAME && adminPassword === ADMIN_PASSWORD) {
            onLogin(adminUsername, true);
        } else {
            setError('Contact ou mot de passe administrateur incorrect.');
        }
    };
    
    const toggleMode = (e: React.MouseEvent) => {
        e.preventDefault();
        setError('');
        setIsAdminLogin(!isAdminLogin);
    }

    return (
        <div className="bg-canal-gray p-8 rounded-lg shadow-2xl animate-fade-in max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-center mb-2">
                {isAdminLogin ? 'Connexion Admin' : 'Bienvenue'}
            </h2>
            <p className="text-center text-canal-light-gray mb-8">
                {isAdminLogin ? 'Accès au tableau de bord' : 'sur votre espace client CANAL+'}
            </p>
            
            {isAdminLogin ? (
                <form onSubmit={handleAdminSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="adminUsername" className="block text-sm font-medium text-canal-light-gray">Contact Administrateur</label>
                        <input
                            id="adminUsername"
                            type="tel"
                            value={adminUsername}
                            onChange={(e) => setAdminUsername(e.target.value)}
                            placeholder="+225XXXXXXXXXX"
                            required
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 mt-1 text-white focus:ring-canal-red focus:border-canal-red transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="adminPassword"  className="block text-sm font-medium text-canal-light-gray">Mot de passe</label>
                        <input
                            id="adminPassword"
                            type="password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            required
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 mt-1 text-white focus:ring-canal-red focus:border-canal-red transition"
                        />
                    </div>
                     {error && <p className="text-canal-red text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-canal-red text-white py-3 px-4 rounded-md hover:bg-red-700 transition duration-300 font-semibold flex items-center justify-center space-x-2"
                    >
                        <span>Se Connecter</span>
                    </button>
                </form>
            ) : (
                <form onSubmit={handleUserSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-canal-light-gray">Contact</label>
                        <input
                            id="contact"
                            type="tel"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="+225XXXXXXXXXX"
                            required
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 mt-1 text-white focus:ring-canal-red focus:border-canal-red transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-canal-light-gray">Mot de passe</label>
                        <input
                            id="password"
                            type="password"
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.target.value)}
                            required
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 mt-1 text-white focus:ring-canal-red focus:border-canal-red transition"
                        />
                    </div>
                     <div>
                        <label htmlFor="confirmPassword"  className="block text-sm font-medium text-canal-light-gray">Confirmation du mot de passe</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 mt-1 text-white focus:ring-canal-red focus:border-canal-red transition"
                        />
                    </div>
                    {error && <p className="text-canal-red text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-canal-red text-white py-3 px-4 rounded-md hover:bg-red-700 transition duration-300 font-semibold flex items-center justify-center space-x-2"
                    >
                        <UserIcon className="h-5 w-5"/>
                        <span>S'inscrire</span>
                    </button>
                </form>
            )}

            <div className="text-center mt-6">
                <a href="#" onClick={toggleMode} className="text-sm text-canal-light-gray hover:text-white transition">
                   {isAdminLogin ? "S'inscrire en tant que client" : "Se connecter en tant qu'administrateur"}
                </a>
            </div>
        </div>
    );
};
