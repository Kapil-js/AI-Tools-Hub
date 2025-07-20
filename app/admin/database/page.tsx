'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, Download, RefreshCw, AlertTriangle, CheckCircle, Clock, HardDrive } from 'lucide-react';

// Mock database tables
const databaseTables = [
  {
    name: 'users',
    records: 12845,
    size: '2.4 GB',
    lastUpdated: '2024-01-20T10:30:00Z',
    status: 'healthy'
  },
  {
    name: 'tool_usage',
    records: 156789,
    size: '890 MB',
    lastUpdated: '2024-01-20T10:25:00Z',
    status: 'healthy'
  },
  {
    name: 'subscriptions',
    records: 3298,
    size: '45 MB',
    lastUpdated: '2024-01-20T10:20:00Z',
    status: 'healthy'
  },
  {
    name: 'blog_posts',
    records: 127,
    size: '12 MB',
    lastUpdated: '2024-01-19T15:45:00Z',
    status: 'healthy'
  },
  {
    name: 'messages',
    records: 8934,
    size: '156 MB',
    lastUpdated: '2024-01-20T09:15:00Z',
    status: 'warning'
  },
  {
    name: 'analytics',
    records: 45678,
    size: '234 MB',
    lastUpdated: '2024-01-20T08:30:00Z',
    status: 'healthy'
  },
];

const backupHistory = [
  {
    id: 1,
    date: '2024-01-20T02:00:00Z',
    type: 'Full Backup',
    size: '4.2 GB',
    status: 'completed',
    duration: '45 minutes'
  },
  {
    id: 2,
    date: '2024-01-19T02:00:00Z',
    type: 'Full Backup',
    size: '4.1 GB',
    status: 'completed',
    duration: '42 minutes'
  },
  {
    id: 3,
    date: '2024-01-18T14:30:00Z',
    type: 'Incremental Backup',
    size: '456 MB',
    status: 'completed',
    duration: '8 minutes'
  },
  {
    id: 4,
    date: '2024-01-18T02:00:00Z',
    type: 'Full Backup',
    size: '4.0 GB',
    status: 'failed',
    duration: '15 minutes'
  },
];

export default function DatabaseManagement() {
  const [isBackingUp, setIsBackingUp] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Error</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getBackupStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Completed</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Failed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">In Progress</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleBackup = () => {
    setIsBackingUp(true);
    // Simulate backup process
    setTimeout(() => {
      setIsBackingUp(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Database Management</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Monitor database health, manage backups, and view system status
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" disabled={isBackingUp}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isBackingUp ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            className="bg-gradient-to-r from-purple-600 to-blue-600"
            onClick={handleBackup}
            disabled={isBackingUp}
          >
            <Download className="w-4 h-4 mr-2" />
            {isBackingUp ? 'Creating Backup...' : 'Create Backup'}
          </Button>
        </div>
      </div>

      {/* Database Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Tables</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{databaseTables.length}</p>
              </div>
              <Database className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Records</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {databaseTables.reduce((sum, table) => sum + table.records, 0).toLocaleString()}
                </p>
              </div>
              <HardDrive className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Database Size</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">4.2 GB</p>
              </div>
              <Database className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Health Status</p>
                <p className="text-2xl font-bold text-green-600">Good</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Tables */}
      <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle>Database Tables</CardTitle>
          <CardDescription>
            Overview of all database tables and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table Name</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {databaseTables.map((table) => (
                <TableRow key={table.name}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4 text-slate-500" />
                      <span className="font-medium text-slate-900 dark:text-white">{table.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {table.records.toLocaleString()}
                  </TableCell>
                  <TableCell>{table.size}</TableCell>
                  <TableCell>{formatDate(table.lastUpdated)}</TableCell>
                  <TableCell>{getStatusBadge(table.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
          <CardDescription>
            Recent database backup operations and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backupHistory.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell>{formatDate(backup.date)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{backup.type}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{backup.size}</TableCell>
                  <TableCell>{backup.duration}</TableCell>
                  <TableCell>{getBackupStatusBadge(backup.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" disabled={backup.status === 'failed'}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Connection Pool</p>
                <p className="text-lg font-semibold text-green-600">Optimal</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">15/50 connections used</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Query Performance</p>
                <p className="text-lg font-semibold text-green-600">Good</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Avg response: 45ms</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Storage Usage</p>
                <p className="text-lg font-semibold text-yellow-600">Moderate</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">68% of allocated space</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
