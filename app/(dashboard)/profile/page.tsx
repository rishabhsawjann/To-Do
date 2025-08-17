'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfileStore } from '@/stores/profile';
import { useUsersStore } from '@/stores/users';
import { useSessionStore } from '@/stores/session';
import { getInitials } from '@/lib/utils';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { getProfile, updateProfile } = useProfileStore();
  const { getUserById } = useUsersStore();
  const { currentUserId } = useSessionStore();
  
  const profile = getProfile();
  const currentUser = getUserById(currentUserId);

  // Initialize form with current profile data
  useState(() => {
    setName(profile.name || currentUser?.name || '');
    setAvatar(profile.avatar || currentUser?.avatar || '');
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatar(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfile({ name, avatar });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(profile.name || currentUser?.name || '');
    setAvatar(profile.avatar || currentUser?.avatar || '');
    setIsEditing(false);
  };

  const displayName = profile.name || currentUser?.name || 'Fawaz Ahamed';
  const displayAvatar = profile.avatar || currentUser?.avatar || '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500">Manage your profile information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={displayAvatar} />
                    <AvatarFallback className="text-2xl">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </Button>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                        />
                      ) : (
                        <p className="text-lg font-medium text-gray-900">{displayName}</p>
                      )}
                    </div>

                    <div>
                      <Label>Email</Label>
                      <p className="text-gray-600">{currentUser?.email || 'No email provided'}</p>
                    </div>

                    <div>
                      <Label>Role</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          currentUser?.role === 'superuser' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {currentUser?.role === 'superuser' ? 'Super Admin' : 'Normal User'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label>Joined On</Label>
                      <p className="text-gray-600">
                        {currentUser?.createdAt 
                          ? new Date(currentUser.createdAt).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Unknown'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      Update Profile
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-500">All Todos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">4</p>
                <p className="text-sm text-gray-500">Upcoming</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">6</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full mb-2">
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
