import React, { useState, useMemo } from 'react';
import type { OrderDetails } from '../../types';
import { ConfirmationModal } from './ConfirmationModal';
import { TrashIcon } from '../icons/TrashIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { DownloadIcon } from '../icons/DownloadIcon';
import { exportOrdersToXLSX } from '../../utils/exporter';

interface OrderManagementProps {
    orders: OrderDetails[];
    onUpdateStatus: (orderId: string, status: 'Validée' | 'En attente') => void;
    onDelete: (orderId: string) => void;
}

export const OrderManagement: React.FC<OrderManagementProps> = ({ orders, onUpdateStatus, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'En attente' | 'Validée'>('all');
    const [orderToAction, setOrderToAction] = useState<{order: OrderDetails, action: 'delete' | 'validate'} | null>(null);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    const sortedOrders = useMemo(() => {
        return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [orders]);

    const filteredOrders = useMemo(() => {
        return sortedOrders.filter(order => {
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            const matchesSearch =
                order.clientInfo.mainContact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (order.clientInfo.subscriberNumber && order.clientInfo.subscriberNumber.includes(searchTerm));
            return matchesStatus && matchesSearch;
        });
    }, [sortedOrders, searchTerm, statusFilter]);

    const confirmAction = () => {
        if (!orderToAction) return;
        if (orderToAction.action === 'delete') {
            onDelete(orderToAction.order.id);
        } else if (orderToAction.action === 'validate') {
            onUpdateStatus(orderToAction.order.id, 'Validée');
        }
        setOrderToAction(null);
    };

    const OrderRow: React.FC<{ order: OrderDetails }> = ({ order }) => {
        const isExpanded = expandedOrderId === order.id;
        const toggleExpand = () => setExpandedOrderId(isExpanded ? null : order.id);

        return (
            <>
                <tr className="border-b border-gray-800 hover:bg-gray-800 cursor-pointer" onClick={toggleExpand}>
                    <td className="p-3">
                        <span className={`flex items-center gap-2 font-semibold ${order.status === 'Validée' ? 'text-green-400' : 'text-yellow-400'}`}>
                           {order.status === 'Validée' ? <CheckCircleIcon className="h-5 w-5"/> : <ClockIcon className="h-5 w-5"/>}
                           {order.status}
                        </span>
                    </td>
                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td className="p-3 font-medium">{order.type}</td>
                    <td className="p-3">{order.clientInfo.mainContact}</td>
                    <td className="p-3 text-right font-semibold text-canal-red">{order.totalAmount.toLocaleString('fr-FR')} F</td>
                    <td className="p-3 text-right">
                         {order.status === 'En attente' && (
                            <button onClick={(e) => { e.stopPropagation(); setOrderToAction({order, action: 'validate'})}} className="p-1 text-green-400 hover:text-green-300 transition" title="Valider la commande"><CheckCircleIcon /></button>
                         )}
                         {/* FIX: Corrected typo in hover class from text-red-40á00 to text-red-400 */}
                         <button onClick={(e) => { e.stopPropagation(); setOrderToAction({order, action: 'delete'})}} className="p-1 text-canal-red hover:text-red-400 transition" title="Supprimer la commande"><TrashIcon /></button>
                    </td>
                </tr>
                {isExpanded && (
                    <tr className="bg-canal-dark-gray">
                        <td colSpan={6} className="p-4">
                            <div className="text-sm space-y-2">
                                <p><strong>ID:</strong> {order.id}</p>
                                {order.clientInfo.subscriberNumber && <p><strong>N° Abonné:</strong> {order.clientInfo.subscriberNumber}</p>}
                                {order.type === 'Réabonnement' && <p><strong>Détails:</strong> {order.details.formule} pour {order.details.months} mois.</p>}
                                {order.type === 'Modification de formule' && <p><strong>Détails:</strong> De {order.details.from} à {order.details.to}.</p>}
                                {order.type === 'Demande de technicien' && <p><strong>Service:</strong> {order.details.service}</p>}
                                {order.type === 'Demande de technicien' && <p><strong>Description:</strong> {order.details.description}</p>}
                            </div>
                        </td>
                    </tr>
                )}
            </>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <input type="text" placeholder="Rechercher (contact, n° abonné)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-60 bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:ring-canal-red focus:border-canal-red"/>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="w-full sm:w-48 bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:ring-canal-red focus:border-canal-red">
                    <option value="all">Tous les statuts</option>
                    <option value="En attente">En attente</option>
                    <option value="Validée">Validée</option>
                </select>
                <button onClick={() => exportOrdersToXLSX(orders)} className="flex items-center justify-center space-x-2 w-full sm:w-auto bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-semibold">
                    <DownloadIcon className="h-5 w-5"/>
                    <span>Exporter (.xlsx)</span>
                </button>
            </div>

            <div className="overflow-x-auto bg-canal-dark-gray rounded-lg">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="p-3">Statut</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Opération</th>
                            <th className="p-3">Client</th>
                            <th className="p-3 text-right">Montant</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? filteredOrders.map(order => (
                            <OrderRow key={order.id} order={order} />
                         )) : (
                            <tr><td colSpan={6} className="text-center p-6 text-canal-light-gray">Aucune commande trouvée.</td></tr>
                         )}
                    </tbody>
                </table>
            </div>
            
            <ConfirmationModal
                isOpen={!!orderToAction}
                onClose={() => setOrderToAction(null)}
                onConfirm={confirmAction}
                title={orderToAction?.action === 'delete' ? "Confirmer la Suppression" : "Confirmer la Validation"}
                message={orderToAction?.action === 'delete' ? `Êtes-vous sûr de vouloir supprimer la commande de ${orderToAction.order.clientInfo.mainContact} ?` : `Valider la commande de ${orderToAction.order.clientInfo.mainContact} ?`}
            />
        </div>
    );
};