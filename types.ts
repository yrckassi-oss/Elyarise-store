
export enum FormuleName {
    ACCESS = 'ACCESS',
    EVASION = 'EVASION',
    ACCESS_PLUS = 'ACCESS+',
    TOUT_CANAL = 'TOUT CANAL+',
}

export enum TechnicienService {
    INSTALLATION = 'Installation & Pointage antenne',
    DEPANNAGE = 'Dépannage',
    DEMONTAGE = 'Démontage / Désinstallation',
    DEMENAGEMENT = 'Déménagement',
    POSE_SUPPORT_TV = 'Pose Support TV',
    POSE_RIDEAUX = 'Pose Rideaux',
}

export interface Formule {
    name: FormuleName;
    price: number;
}

export interface NetflixOption {
    screens: number;
    price: number;
}

export interface ClientInfo {
    mainContact: string;
    secondaryContact?: string;
    subscriberNumber?: string;
}

export interface User {
    contact: string;
    password: string; // Note: Storing plaintext passwords is not secure. For demonstration only.
}

// Using a discriminated union for order details for better type safety
interface ReabonnementDetails {
    type: 'Réabonnement';
    details: {
        formule: FormuleName;
        months: number;
        options: {
            charme: boolean;
            dstv: boolean;
            netflixScreens: string;
        };
    };
}

interface ModificationDetails {
    type: 'Modification de formule';
    details: {
        from: FormuleName;
        to: FormuleName;
        currentPrice: number;
        desiredPrice: number;
    };
}

interface ReactivationDetails {
    type: 'Réactivation des chaînes';
    details: {
        request: string;
    };
}

interface TechnicienDetails {
    type: 'Demande de technicien';
    details: {
        service: TechnicienService | '';
        description: string;
    };
}

// Base type for all orders
interface OrderBase {
    id: string;
    clientInfo: ClientInfo;
    totalAmount: number;
    status: 'En attente' | 'Validée';
    createdAt: string; 
}

// The final OrderDetails type is a union of all possible order types
// Fix: Changed OrderDetails to be a union of intersections to help TypeScript's type inference.
export type OrderDetails = 
    | (OrderBase & ReabonnementDetails) 
    | (OrderBase & ModificationDetails) 
    | (OrderBase & ReactivationDetails) 
    | (OrderBase & TechnicienDetails);

export type Page = 'main' | 'reabonnement' | 'modification' | 'reactivation' | 'technicien' | 'cart' | 'payment' | 'auth' | 'adminDashboard';
