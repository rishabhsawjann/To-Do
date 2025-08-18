'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';
import { useTodosStore } from '@/stores/todos';
import { getInitials } from '@/lib/utils';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const profileStore = useProfileStore();
  const { user, signOut } = useAuthStore();
  const { getTodosByUser } = useTodosStore();

  // Get user's todos for summary
  const userTodos = getTodosByUser(user?.uid || '');
  const allTodos = userTodos.length;
  const upcomingTodos = userTodos.filter(todo => !todo.completed).length;
  const completedTodos = userTodos.filter(todo => todo.completed).length;

  // Initialize form with current values
  useEffect(() => {
    if (user?.displayName) {
      setName(user.displayName);
    } else if (profileStore.name) {
      setName(profileStore.name);
    }
    if (profileStore.avatar) setAvatar(profileStore.avatar);
  }, [user?.displayName, profileStore.name, profileStore.avatar]);

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
    profileStore.updateProfile({ name, avatar });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(user?.displayName || profileStore.name || '');
    setAvatar(profileStore.avatar || user?.photoURL || '');
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const displayName = user?.displayName || profileStore.name || 'User';
  const displayAvatar = profileStore.avatar || user?.photoURL || '';

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
            <CardContent className="space-y-4">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={displayAvatar} />
                    <AvatarFallback className="text-xl">
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
                  <div className="space-y-3">
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
                      <p className="text-gray-600">{user?.email || 'No email provided'}</p>
                    </div>

                    <div>
                      <Label>Role</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Normal User
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label>Joined On</Label>
                      <p className="text-gray-600">
                        {user?.metadata?.creationTime 
                          ? new Date(user.metadata.creationTime).toLocaleDateString('en-GB', {
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
              <div className="flex justify-end space-x-3 pt-2">
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
            <CardHeader className="pb-3">
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{allTodos}</p>
                <p className="text-sm text-gray-500">All Todos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{upcomingTodos}</p>
                <p className="text-sm text-gray-500">Upcoming</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{completedTodos}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={handleLogout}>
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
