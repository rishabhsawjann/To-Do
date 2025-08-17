'use client';

import { useState } from 'react';
import { Edit, Trash2, Crown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUsersStore } from '@/stores/users';
import { getInitials } from '@/lib/utils';

export function UserTable() {
  const { users, toggleUserRole, deleteUser } = useUsersStore();
  const [editingUser, setEditingUser] = useState<string | null>(null);

  const handleToggleRole = (userId: string) => {
    toggleUserRole(userId);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-500">Manage user roles and permissions</p>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
            <div className="col-span-3">User</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Joined</div>
            <div className="col-span-2">Actions</div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {users.map((user) => (
            <div key={user.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* User Info */}
                <div className="col-span-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-sm">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">ID: {user.id}</p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="col-span-3">
                  <span className="text-sm text-gray-900">{user.email || 'No email'}</span>
                </div>

                {/* Role */}
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    {user.role === 'superuser' ? (
                      <Crown size={16} className="text-purple-600" />
                    ) : (
                      <User size={16} className="text-gray-600" />
                    )}
                    <Badge 
                      variant={user.role === 'superuser' ? 'default' : 'secondary'}
                      className={user.role === 'superuser' ? 'bg-purple-100 text-purple-800' : ''}
                    >
                      {user.role === 'superuser' ? 'Super Admin' : 'Normal User'}
                    </Badge>
                  </div>
                </div>

                {/* Joined Date */}
                <div className="col-span-2">
                  <span className="text-sm text-gray-900">{formatDate(user.createdAt)}</span>
                </div>

                {/* Actions */}
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleRole(user.id)}
                      className="text-xs"
                    >
                      Toggle Role
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingUser(user.id)}
                      className="text-xs"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
          <p className="text-3xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Super Admins</h3>
          <p className="text-3xl font-bold text-purple-600">
            {users.filter(u => u.role === 'superuser').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Normal Users</h3>
          <p className="text-3xl font-bold text-blue-600">
            {users.filter(u => u.role === 'normal').length}
          </p>
        </div>
      </div>
    </div>
  );
}
