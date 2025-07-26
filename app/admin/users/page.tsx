'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal,
  UserPlus,
  Mail,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Calendar,
  Activity,
  Download,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface User {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: 'email' | 'google';
  isActive: boolean;
  isPremium: boolean;
  createdAt: any;
  lastLoginAt: any;
  toolsUsed?: number;
  role: 'user' | 'admin' | 'moderator';
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'premium'>('all');
  const { toast } = useToast();

  // Fetch users from Firebase
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const usersData: User[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        usersData.push({
          id: doc.id,
          uid: data.uid,
          email: data.email || '',
          displayName: data.displayName || 'Unknown User',
          photoURL: data.photoURL || '',
          provider: data.provider || 'email',
          isActive: data.isActive !== false,
          isPremium: data.isPremium || false,
          createdAt: data.createdAt,
          lastLoginAt: data.lastLoginAt,
          toolsUsed: data.toolsUsed || 0,
          role: data.role || 'user'
        });
      });
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive) ||
                         (filterStatus === 'premium' && user.isPremium);
    
    return matchesSearch && matchesFilter;
  });

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      
      switch (action) {
        case 'activate':
          await updateDoc(userRef, { isActive: true });
          break;
        case 'deactivate':
          await updateDoc(userRef, { isActive: false });
          break;
        case 'makePremium':
          await updateDoc(userRef, { isPremium: true });
          break;
        case 'removePremium':
          await updateDoc(userRef, { isPremium: false });
          break;
        case 'makeAdmin':
          await updateDoc(userRef, { role: 'admin' });
          break;
        case 'makeModerator':
          await updateDoc(userRef, { role: 'moderator' });
          break;
        case 'makeUser':
          await updateDoc(userRef, { role: 'user' });
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            await deleteDoc(userRef);
          }
          break;
      }
      
      await fetchUsers(); // Refresh the list
      toast({
        title: "Success",
        description: `User ${action} successfully`,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Provider', 'Status', 'Premium', 'Role', 'Created At', 'Last Login'],
      ...filteredUsers.map(user => [
        user.displayName,
        user.email,
        user.provider,
        user.isActive ? 'Active' : 'Inactive',
        user.isPremium ? 'Yes' : 'No',
        user.role,
        user.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A',
        user.lastLoginAt?.toDate?.()?.toLocaleDateString() || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500">Admin</Badge>;
      case 'moderator':
        return <Badge className="bg-orange-500">Moderator</Badge>;
      default:
        return <Badge variant="outline">User</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-500">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, permissions, and activity
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportUsers}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={fetchUsers}>
            <UserPlus className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.isPremium).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'admin' || u.role === 'moderator').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Manage and monitor user accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter: {filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                  All Users
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                  Active Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('inactive')}>
                  Inactive Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('premium')}>
                  Premium Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Tools Used</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                          <div className="space-y-1">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                            <div className="h-3 bg-gray-100 rounded animate-pulse w-24" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><div className="h-6 bg-gray-200 rounded animate-pulse w-16" /></TableCell>
                      <TableCell><div className="h-6 bg-gray-200 rounded animate-pulse w-12" /></TableCell>
                      <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-16" /></TableCell>
                      <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-8" /></TableCell>
                      <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-20" /></TableCell>
                      <TableCell><div className="h-8 bg-gray-200 rounded animate-pulse w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm || filterStatus !== 'all' ? 'No users found matching your criteria' : 'No users found'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {user.displayName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{user.displayName}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(user.isActive)}
                          {user.isPremium && <Badge className="bg-yellow-500">Premium</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.provider === 'google' ? 'Google' : 'Email'}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.toolsUsed || 0}</TableCell>
                      <TableCell>{formatDate(user.lastLoginAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleUserAction(user.id, user.isActive ? 'deactivate' : 'activate')}
                            >
                              {user.isActive ? (
                                <>
                                  <Ban className="w-4 h-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUserAction(user.id, user.isPremium ? 'removePremium' : 'makePremium')}
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              {user.isPremium ? 'Remove Premium' : 'Make Premium'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Role Management</DropdownMenuLabel>
                            {user.role !== 'admin' && (
                              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'makeAdmin')}>
                                Make Admin
                              </DropdownMenuItem>
                            )}
                            {user.role !== 'moderator' && (
                              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'makeModerator')}>
                                Make Moderator
                              </DropdownMenuItem>
                            )}
                            {user.role !== 'user' && (
                              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'makeUser')}>
                                Make User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleUserAction(user.id, 'delete')}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}