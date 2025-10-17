
import type { Formule, NetflixOption } from './types';
import { FormuleName, TechnicienService } from './types';

// NOTE: Hardcoding credentials is not secure for production.
// This is for demonstration purposes only.
export const ADMIN_USERNAME = '+2250787853061';
export const ADMIN_PASSWORD = 'Ely@160125';

export const FORMULES: Formule[] = [
    { name: FormuleName.ACCESS, price: 5000 },
    { name: FormuleName.EVASION, price: 10000 },
    { name: FormuleName.ACCESS_PLUS, price: 15000 },
    { name: FormuleName.TOUT_CANAL, price: 25000 },
];

export const MONTH_OPTIONS = [1, 2, 3, 6, 9, 12];

export const CHARME_PRICE = 6000;

export const DSTV_PRICES = {
    [FormuleName.EVASION]: 5000,
    [FormuleName.ACCESS_PLUS]: 2000,
    [FormuleName.TOUT_CANAL]: 0,
};

export const NETFLIX_PRICES: Record<FormuleName, NetflixOption[]> = {
    [FormuleName.ACCESS]: [
        { screens: 1, price: 3000 },
        { screens: 2, price: 5500 },
        { screens: 4, price: 7000 },
    ],
    [FormuleName.EVASION]: [
        { screens: 1, price: 3000 },
        { screens: 2, price: 5500 },
        { screens: 4, price: 7000 },
    ],
    [FormuleName.ACCESS_PLUS]: [
        { screens: 1, price: 3000 },
        { screens: 2, price: 5500 },
        { screens: 4, price: 7000 },
    ],
    [FormuleName.TOUT_CANAL]: [
        { screens: 1, price: 0 },
        { screens: 2, price: 2500 },
        { screens: 4, price: 4000 },
    ],
};


export const TECHNICIEN_SERVICES: { name: TechnicienService; price: number }[] = [
    { name: TechnicienService.INSTALLATION, price: 5000 },
    { name: TechnicienService.DEPANNAGE, price: 5000 },
    { name: TechnicienService.DEMONTAGE, price: 5000 },
    { name: TechnicienService.DEMENAGEMENT, price: 10000 },
    { name: TechnicienService.POSE_SUPPORT_TV, price: 7000 },
    { name: TechnicienService.POSE_RIDEAUX, price: 10000 },
];

export const CONTACT_PATTERN = /^\+225(01|05|07)\d{8}$/;
export const CONTACT_PATTERN_MESSAGE = "Format: +225XXXXXXXXXX (Orange, MTN, Moov)";
export const SUBSCRIBER_NUMBER_PATTERN = /^(\d{5,8}|\d{14})$/;
// Fix: Corrected typo in constant name from SUBSCRIber_NUMBER_PATTERN_MESSAGE to SUBSCRIBER_NUMBER_PATTERN_MESSAGE to resolve import errors.
export const SUBSCRIBER_NUMBER_PATTERN_MESSAGE = "Numéro d'abonné (5-8 chiffres) ou de réabonnement (14 chiffres)";