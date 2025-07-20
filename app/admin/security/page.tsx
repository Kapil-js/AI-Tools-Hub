'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, AlertTriangle, CheckCircle, Lock, Eye, RefreshCw, Settings } from 'lucide-react';

// Mock security events
const securityEvents = [
  {
    id: 1,
    type: 'failed_login',
    severity: 'medium',
    description: 'Multiple failed login attempts',
    ip: '192.168.1.100',
    location: 'New York, US',
    timestamp: '2024-01-20T10:30:00Z',
    status: 'blocked'
  },
  {
    id: 2,
    type: 'suspicious_activity',
    severity: 'high',
    description: 'Unusual API usage pattern detected',
    ip: '203.45.67.89',
    location: 'Unknown',
    timestamp: '2024-01-20T09:15:00Z',
    status: 'investigating'
  },
  {
    id: 3,
    type: 'admin_access',
    severity: 'low',
    description: 'Admin panel accessed from new device',
    ip: '192.168.1.50',
    location: 'San Francisco, US',
    timestamp: '2024-01-20T08:45:00Z',
    status: 'resolved'
  },
  {
    id: 4,
    type: 'data_export',
    severity: 'medium',
    description: 'Large data export request',
    ip: '10.0.0.25',
    location: 'Internal',
    timestamp: '2024-01-19T16:20:00Z',
    status: 'approved'
  },
];

// Security settings
const securitySettings = [
  {
    id: 'two_factor',
    name: 'Two-Factor Authentication',
    description: 'Require 2FA for all admin accounts',
    enabled: true
  },
  {
    id: 'ip_whitelist',
    name: 'IP Whitelisting',
    description: 'Only allow access from approved IP addresses',
    enabled: false
  },
  {
    id: 'session_timeout',
    name: 'Session Timeout',
    description: 'Automatically log out inactive users',
    enabled: true
  },
  {
    id: 'login_monitoring',
    name: 'Login Monitoring',
    description: 'Monitor and alert on suspicious login patterns',
    enabled: true
  },
  {
    id: 'api_rate_limiting',
    name: 'API Rate Limiting',
    description: 'Limit API requests per user/IP',
    enabled: true
  },
  {
    id: 'data_encryption',
    name: 'Data Encryption',
    description: 'Encrypt sensitive data at rest',
    enabled: true
  },
];

export default function SecurityManagement() {
  const [settings, setSettings] = useState(securitySettings);
  const [events] = useState(securityEvents);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Low</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'blocked':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Blocked</Badge>;
      case 'investigating':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Investigating</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Resolved</Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Approved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'failed_login':
        return <Lock className="w-4 h-4 text-red-500" />;
      case 'suspicious_activity':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'admin_access':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'data_export':
        return <Eye className="w-4 h-4 text-green-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleSetting = (settingId: string) => {
    setSettings(prev => prev.map(setting => 
      setting.id === settingId ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Security Management</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Monitor security events, manage settings, and protect your platform
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Settings className="w-4 h-4 mr-2" />
            Security Audit
          </Button>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Security Score</p>
                <p className="text-2xl font-bold text-green-600">95%</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Threats</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {events.filter(event => event.status === 'investigating').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Blocked Events</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {events.filter(event => event.status === 'blocked').length}
                </p>
              </div>
              <Lock className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Security Settings</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {settings.filter(setting => setting.enabled).length}/{settings.length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Events */}
        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle>Recent Security Events</CardTitle>
            <CardDescription>
              Latest security alerts and incidents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg dark:border-slate-700">
                  <div className="mt-1">
                    {getTypeIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {event.description}
                      </p>
                      {getSeverityBadge(event.severity)}
                    </div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      <p>IP: {event.ip} • Location: {event.location}</p>
                      <p>{formatDate(event.timestamp)}</p>
                    </div>
                    <div className="mt-2">
                      {getStatusBadge(event.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Configure security policies and protections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {settings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-3 border rounded-lg dark:border-slate-700">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {setting.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {setting.description}
                    </p>
                  </div>
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={() => toggleSetting(setting.id)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Events Table */}
      <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle>All Security Events</CardTitle>
          <CardDescription>
            Complete log of security events and incidents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(event.type)}
                      <span className="capitalize font-medium">
                        {event.type.replace('_', ' ')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell>{getSeverityBadge(event.severity)}</TableCell>
                  <TableCell className="font-mono text-sm">{event.ip}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{formatDate(event.timestamp)}</TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
          <CardDescription>
            Suggested actions to improve platform security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">Enable IP Whitelisting</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Consider enabling IP whitelisting for admin accounts to add an extra layer of security.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-900 dark:text-yellow-100">Review Failed Login Attempts</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Multiple failed login attempts detected. Consider implementing account lockout policies.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
              <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">Security Score: Excellent</p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your platform maintains a high security score. Keep up the good work!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
