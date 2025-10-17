import type { User, OrderDetails } from '../types';

declare const window: any; // Assuming SheetJS is loaded via CDN

const getSheetJS = (): any => {
    if (typeof window.XLSX === 'undefined') {
        console.error("SheetJS library (XLSX) not found. Please ensure it's loaded.");
        return null;
    }
    return window.XLSX;
};

export const exportUsersToXLSX = (users: User[]) => {
    const XLSX = getSheetJS();
    if (!XLSX) return;

    const dataToExport = users.map(user => ({
        'Contact': user.contact,
        'Mot de Passe (pour démo)': user.password,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Utilisateurs');

    // Auto-fit columns
    const max_width = dataToExport.reduce((w, r) => Math.max(w, r['Contact'].length, r['Mot de Passe (pour démo)'].length), 10);
    worksheet["!cols"] = [ { wch: max_width }, { wch: max_width } ];

    XLSX.writeFile(workbook, 'Export_Utilisateurs_Elyarise.xlsx');
};

export const exportOrdersToXLSX = (orders: OrderDetails[]) => {
    const XLSX = getSheetJS();
    if (!XLSX) return;
    
    const dataToExport = orders.map(order => {
        let details = '';
        if (order.type === 'Réabonnement') {
            const opts = order.details.options;
            details = `${order.details.formule} ${order.details.months}m. Options: C(${opts.charme?'O':'N'}) D(${opts.dstv?'O':'N'}) N(${opts.netflixScreens})`;
        } else if (order.type === 'Modification de formule') {
            details = `${order.details.from} -> ${order.details.to}`;
        } else if (order.type === 'Demande de technicien') {
            details = `${order.details.service}: ${order.details.description.substring(0, 50)}...`;
        } else {
            details = 'Réactivation simple';
        }

        return {
            'ID Commande': order.id,
            'Date': new Date(order.createdAt).toLocaleString('fr-FR'),
            'Statut': order.status,
            'Type Opération': order.type,
            'Contact Client': order.clientInfo.mainContact,
            'Numéro Abonné': order.clientInfo.subscriberNumber || 'N/A',
            'Détails': details,
            'Montant Total (F CFA)': order.totalAmount,
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Commandes');

    // Set column widths for better readability
    worksheet["!cols"] = [
        { wch: 20 }, { wch: 20 }, { wch: 12 }, { wch: 25 }, 
        { wch: 20 }, { wch: 20 }, { wch: 50 }, { wch: 20 }
    ];

    XLSX.writeFile(workbook, 'Export_Commandes_Elyarise.xlsx');
};
