
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-canal-gray p-4 text-center text-canal-light-gray text-sm">
            © {new Date().getFullYear()} ELYARISE CANAL+ STORE. Tous droits réservés.
        </footer>
    );
};
