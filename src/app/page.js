'use client'
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Trash2, Edit2 } from 'lucide-react';

const RBACDashboard = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'editor', status: 'active' },
  ]);

  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'admin',
      permissions: ['users.view', 'users.create', 'users.edit', 'users.delete', 'roles.manage'],
    },
    {
      id: 2,
      name: 'editor',
      permissions: ['users.view', 'users.edit'],
    },
  ]);

  const [activeTab, setActiveTab] = useState('users');
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const handleDeleteRole = (roleId) => {
    setRoles(roles.filter(role => role.id !== roleId));
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserDialog(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setShowRoleDialog(true);
  };

  const handleSaveUser = (userData) => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...userData } : user
      ));
    } else {
      setUsers([...users, { id: users.length + 1, ...userData }]);
    }
    setShowUserDialog(false);
    setEditingUser(null);
  };

  const handleSaveRole = (roleData) => {
    if (editingRole) {
      setRoles(roles.map(role => 
        role.id === editingRole.id ? { ...role, ...roleData } : role
      ));
    } else {
      setRoles([...roles, { id: roles.length + 1, ...roleData }]);
    }
    setShowRoleDialog(false);
    setEditingRole(null);
  };

  const UserDialog = ({ open, onOpenChange }) => {
    const [formData, setFormData] = useState(editingUser || {
      name: '',
      email: '',
      role: '',
      status: 'active'
    });

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {editingUser ? 'Modify user details' : 'Create a new user and assign their role'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input 
                placeholder="Full Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Input 
                placeholder="Email" 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Select 
                value={formData.role}
                onValueChange={(value) => setFormData({...formData, role: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditingUser(null);
              onOpenChange(false);
            }}>
              Cancel
            </Button>
            <Button onClick={() => handleSaveUser(formData)}>
              {editingUser ? 'Save Changes' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const RoleDialog = ({ open, onOpenChange }) => {
    const [formData, setFormData] = useState(editingRole || {
      name: '',
      permissions: []
    });

    const availablePermissions = [
      'users.view',
      'users.create',
      'users.edit',
      'users.delete',
      'roles.manage'
    ];

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
            <DialogDescription>
              {editingRole ? 'Modify role permissions' : 'Define a new role and its permissions'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input 
                placeholder="Role Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Permissions</h4>
              <div className="grid grid-cols-2 gap-4">
                {availablePermissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox 
                      id={permission}
                      checked={formData.permissions?.includes(permission)}
                      onCheckedChange={(checked) => {
                        setFormData({
                          ...formData,
                          permissions: checked 
                            ? [...(formData.permissions || []), permission]
                            : formData.permissions?.filter(p => p !== permission) || []
                        });
                      }}
                    />
                    <label htmlFor={permission} className="text-sm">
                      {permission}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditingRole(null);
              onOpenChange(false);
            }}>
              Cancel
            </Button>
            <Button onClick={() => handleSaveRole(formData)}>
              {editingRole ? 'Save Changes' : 'Create Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const DeleteDialog = () => (
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the {itemToDelete?.type}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            if (itemToDelete?.type === 'user') {
              handleDeleteUser(itemToDelete.id);
            } else if (itemToDelete?.type === 'role') {
              handleDeleteRole(itemToDelete.id);
            }
          }}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const UserManagement = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user access and roles</CardDescription>
        </div>
        <div className="flex space-x-2">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input 
              placeholder="Search users..." 
              className="w-64"
              type="search"
            />
          </div>
          <Button onClick={() => {
            setEditingUser(null);
            setShowUserDialog(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.status === 'active' ? 'success' : 'secondary'}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setItemToDelete({ type: 'user', id: user.id });
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const RoleManagement = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Roles</CardTitle>
          <CardDescription>Manage roles and permissions</CardDescription>
        </div>
        <Button onClick={() => {
          setEditingRole(null);
          setShowRoleDialog(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map(role => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map(permission => (
                      <Badge key={permission} variant="secondary" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditRole(role)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setItemToDelete({ type: 'role', id: role.id });
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Access Management</h1>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        <TabsContent value="roles">
          <RoleManagement />
        </TabsContent>
      </Tabs>
      <UserDialog open={showUserDialog} onOpenChange={setShowUserDialog} />
      <RoleDialog open={showRoleDialog} onOpenChange={setShowRoleDialog} />
      <DeleteDialog />
    </div>
  );
};

export default RBACDashboard;