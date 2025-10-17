import React, { useState } from 'react';
import type { User, OrderDetails } from '../types';
import { UserManagement } from './admin/UserManagement';
import { OrderManagement } from './admin/OrderManagement';
import { UsersIcon } from './icons/UsersIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';


interface AdminDashboardProps {
    adminId: string;
    users: User[];
    orders: OrderDetails[];
    onDeleteUser: (contact: string) => void;
    onUpdateOrderStatus: (orderId: string, status: 'Validée' | 'En attente') => void;
    onDeleteOrder: (orderId: string) => void;
}

type AdminTab = 'users' | 'orders';

export const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('orders');
    
    const TabButton: React.FC<{tabName: AdminTab, label: string, icon: React.ReactNode}> = ({tabName, label, icon}) => (
         <button
            onClick={() => setActiveTab(tabName)}
            className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-t-lg transition font-semibold ${
                activeTab === tabName
                    ? 'bg-canal-gray text-white'
                    : 'bg-canal-dark-gray text-canal-light-gray hover:bg-gray-800'
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="bg-canal-dark-gray p-4 sm:p-6 rounded-lg shadow-2xl animate-fade-in w-full">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold">Tableau de Bord</h2>
                 <p className="text-sm text-canal-light-gray">Connecté en tant que <span className="font-semibold text-white">{props.adminId}</span></p>
            </div>
           
            <div className="flex border-b border-gray-700">
                <TabButton tabName="orders" label="Gestion des Commandes" icon={<ClipboardListIcon className="h-5 w-5" />} />
                <TabButton tabName="users" label="Gestion des Utilisateurs" icon={<UsersIcon className="h-5 w-5" />} />
            </div>

            <div className="bg-canal-gray p-4 sm:p-6 rounded-b-lg">
                {activeTab === 'orders' && <OrderManagement orders={props.orders} onUpdateStatus={props.onUpdateOrderStatus} onDelete={props.onDeleteOrder} />}
                {activeTab === 'users' && <UserManagement users={props.users} onDelete={props.onDeleteUser} />}
            </div>
        </div>
    );
};
