import React, { useState } from 'react';
import { UserIcon } from './icons/UserIcon';
import { CONTACT_PATTERN, CONTACT_PATTERN_MESSAGE, ADMIN_USERNAME, ADMIN_PASSWORD } from '../constants';
import { InstallPrompt } from './InstallPrompt';
import { MobileIcon } from './icons/MobileIcon';


interface AuthPageProps {
    onRegister: (contact: string, password: string) => boolean;
    onUserLogin: (contact: string, password: string) => boolean;
    onAdminLogin: (identifier: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onRegister, onUserLogin, onAdminLogin }) => {
    const [authMode, setAuthMode] = useState<'register' | 'login' | 'admin'>('register');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);

    // Unified state for form inputs
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const clearFormState = () => {
        setContact('');
        setPassword('');
        setConfirmPassword('');
        setError('');
        // Keep success message when switching from register to login
    };
    
    const switchMode = (mode: 'register' | 'login' | 'admin') => {
        setAuthMode(mode);
        clearFormState();
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!CONTACT_PATTERN.test(contact)) {
            setError(`Format de contact invalide. ${CONTACT_PATTERN_MESSAGE}`);
            return;
        }
        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        
        const success = onRegister(contact, password);
        if (success) {
            switchMode('login');
            // This message will now be displayed on the login screen
            setSuccessMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        } else {
            setError('Ce contact est déjà utilisé. Essayez de vous connecter.');
        }
    };

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        const success = onUserLogin(contact, password);
        if (!success) {
            setError('Contact ou mot de passe incorrect.');
        }
    };

     const handleAdminSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (contact === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            onAdminLogin(contact);
        } else {
            setError('Contact ou mot de passe administrateur incorrect.');
        }
    };

    const renderRegisterForm = () => (
        <form onSubmit={handleRegisterSubmit} className="space-y-6">
            <div>
                <label htmlFor="contact" className="block text-sm font-medium text-canal-light-gray">Contact</label>
                <input id="contact" type="tel" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+225XXXXXXXXXX" required className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 mt-1 text-white focus:ring-canal-red focus:border-canal-red transition" />
            </div>
            <div>
                <label htmlFor="password"  className="block text-sm font-medium text-canal-light-gray">Mot de passe</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 mt-1 text-white focus:ring-canal-red focus:border-canal-red transition" />
            </div>
            <div>
                <label htmlFor="confirmPassword"  className="block text-sm font-medium text-canal-light-gray">Confirmation du mot de passe</label>
                <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 mt-1 text-white focus:ring-canal-red focus:border-canal-red transition" />
            </div>
            {error && <p className="text-canal-red text-sm text-center">{error}</p>}
            <button type="submit" className="w-full bg-canal-red text-white py-3 px-4 rounded-md hover:bg-red-700 transition duration-300 font-semibold flex items-center justify-center space-x-2">
                <UserIcon className="h-5 w-5"/>
                <span>S'inscrire</span>
            </button>
        </form>
    );

    const renderLoginForm = () => (
         <form onSubmit={handleLoginSubmit} className="space-y-6">
             <div>
                <label htmlFor="contact" className="block text-sm font-medium text-canal-light-gray">Contact</label>
                <input id="contact" type="tel" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+225XXXXXXXXXX" required className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 mt-1 text-white focus:ring-canal-red focus:border-canal-red transition" />
            </div>
            <div>
                <label htmlFor="password"  className="block text-sm font-medium text-canal-light-gray">Mot de passe</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 mt-1 text-white focus:ring-canal-red focus:border-canal-red transition" />
            </div>
             {error && <p className="text-canal-red text-sm text-center">{error}</p>}
             {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}
            <button type="submit" className="w-full bg-canal-red text-white py-3 px-4 rounded-md hover:bg-red-700 transition duration-300 font-semibold flex items-center justify-center space-x-2">
                <span>Se Connecter</span>
            </button>
        </form>
    );

    const renderAdminForm = () => (
         <form onSubmit={handleAdminSubmit} className="space-y-6">
            <div>
                <label htmlFor="adminContact" className="block text-sm font-medium text-canal-light-gray">Contact Administrateur</label>
                <input id="adminContact" type="tel" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+225XXXXXXXXXX" required className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 mt-1 text-white focus:ring-canal-red focus:border-canal-red transition" />
            </div>
            <div>
                <label htmlFor="adminPassword"  className="block text-sm font-medium text-canal-light-gray">Mot de passe</label>
                <input id="adminPassword" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 mt-1 text-white focus:ring-canal-red focus:border-canal-red transition" />
            </div>
             {error && <p className="text-canal-red text-sm text-center">{error}</p>}
            <button type="submit" className="w-full bg-canal-red text-white py-3 px-4 rounded-md hover:bg-red-700 transition duration-300 font-semibold flex items-center justify-center space-x-2">
                <span>Connexion Admin</span>
            </button>
        </form>
    );

    const getTitle = () => {
        switch(authMode) {
            case 'register': return 'Bienvenue';
            case 'login': return 'Connexion Client';
            case 'admin': return 'Connexion Admin';
        }
    }
    
    const getSubtitle = () => {
        switch(authMode) {
            case 'register': return 'Créez votre compte client CANAL+';
            case 'login': return 'Accédez à votre espace client';
            case 'admin': return 'Accès au tableau de bord';
        }
    }

    return (
        <>
            <div className="bg-canal-gray p-8 rounded-lg shadow-2xl animate-fade-in max-w-md mx-auto">
                <h2 className="text-3xl font-bold text-center mb-2">{getTitle()}</h2>
                <p className="text-center text-canal-light-gray mb-8">{getSubtitle()}</p>
                
                {authMode === 'register' && renderRegisterForm()}
                {authMode === 'login' && renderLoginForm()}
                {authMode === 'admin' && renderAdminForm()}

                <div className="text-center mt-6 space-y-2 text-sm divide-y divide-gray-700 pt-4">
                    <div className="pb-4 space-y-2">
                        {authMode === 'register' && (
                            <p>
                                <a href="#" onClick={(e) => { e.preventDefault(); switchMode('login'); }} className="text-canal-light-gray hover:text-white transition">
                                   Déjà un compte ? Se connecter
                                </a>
                            </p>
                        )}
                         {authMode === 'login' && (
                            <p>
                                <a href="#" onClick={(e) => { e.preventDefault(); switchMode('register'); }} className="text-canal-light-gray hover:text-white transition">
                                   Pas encore de compte ? S'inscrire
                                </a>
                            </p>
                        )}
                        {authMode !== 'admin' ? (
                             <p>
                                <a href="#" onClick={(e) => { e.preventDefault(); switchMode('admin'); }} className="text-canal-light-gray hover:text-white transition">
                                   Se connecter en tant qu'administrateur
                                </a>
                            </p>
                        ) : (
                             <p>
                                <a href="#" onClick={(e) => { e.preventDefault(); switchMode('register'); }} className="text-canal-light-gray hover:text-white transition">
                                   S'inscrire en tant que client
                                </a>
                            </p>
                        )}
                    </div>
                     <div className="pt-4">
                         <a href="#" onClick={(e) => { e.preventDefault(); setShowInstallPrompt(true); }} className="text-canal-light-gray hover:text-white transition flex items-center justify-center">
                           <MobileIcon className="h-5 w-5 mr-2" />
                           Installer sur mobile
                        </a>
                    </div>
                </div>
            </div>
            {showInstallPrompt && <InstallPrompt onClose={() => setShowInstallPrompt(false)} />}
        </>
    );
};