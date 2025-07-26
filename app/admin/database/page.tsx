'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';

export default function DatabasePage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Database Management</h1>
          <p className="text-gray-600">Manage your database and data</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Database management features coming soon...</p>
        </div>
      </div>
    </AdminLayout>
  );
}