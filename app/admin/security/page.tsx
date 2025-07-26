'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Lock,
  Eye,
  Ban,
  Activity,
  Globe,
  Key,
  RefreshCw,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'failed_login' | 'password_reset' | 'suspicious_activity' | 'admin_access';
  user: string;
  ip: string;
  location: string;
  timestamp: string;
  status: 'success' | 'failed' | 'blocked';
  details: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
  };
  sessionTimeout: number;
  maxLoginAttempts: number;
  ipWhitelist: string[];
  suspiciousActivityDetection: boolean;
  emailNotifications: boolean;
}

export default function SecurityManagement() {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: true,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: true
    },
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    ipWhitelist: [],
    suspiciousActivityDetection: true,
    emailNotifications: true
  });
  const [loading, setLoading] = useState(true);
  const [newIp, setNewIp] = useState('');
  const { toast } = useToast();

  // Mock security events
  const mockEvents: SecurityEvent[] = [
    {
      id: '1',
      type: 'failed_login',
      user: 'unknown@example.com',
      ip: '192.168.1.100',
      location: 'New York, US',
      timestamp: '2024-01-21 10:30:00',
      status: 'failed',
      details: 'Invalid password attempt'
    },
    {
      id: '2',
      type: 'admin_access',
      user: 'admin@aitoolshub.com',
      ip: '192.168.1.50',
      location: 'California, US',
      timestamp: '2024-01-21 09:15:00',
      status: 'success',
      details: 'Admin panel access'
    },
    {
      id: '3',
      type: 'suspicious_activity',
      user: 'user@example.com',
      ip: '10.0.0.1',
      location: 'Unknown',
      timestamp: '2024-01-21 08:45:00',
      status: 'blocked',
      details: 'Multiple rapid requests detected'
    },
    {
      id: '4',
      type: 'password_reset',
      user: 'user2@example.com',
      ip: '192.168.1.75',
      location: 'Texas, US',
      timestamp: '2024-01-21 07:20:00',
      status: 'success',
      details: 'Password reset completed'
    },
    {
      id: '5',
      type: 'login_attempt',
      user: 'user3@example.com',
      ip: '192.168.1.80',
      location: 'Florida, US',
      timestamp: '2024-01-21 06:10:00',
      status: 'success',
      details: 'Successful login'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setSecurityEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const updateSetting = (path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split('.');
      const newSettings = { ...prev };
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Security settings have been updated successfully",
    });
  };

  const addIpToWhitelist = () => {
    if (newIp && !settings.ipWhitelist.includes(newIp)) {
      updateSetting('ipWhitelist', [...settings.ipWhitelist, newIp]);
      setNewIp('');
      toast({
        title: "IP Added",
        description: `${newIp} has been added to the whitelist`,
      });
    }
  };

  const removeIpFromWhitelist = (ip: string) => {
    updateSetting('ipWhitelist', settings.ipWhitelist.filter(item => item !== ip));
    toast({
      title: "IP Removed",
      description: `${ip} has been removed from the whitelist`,
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'failed_login':
        return <Ban className="w-4 h-4 text-red-600" />;
      case 'admin_access':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'suspicious_activity':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'password_reset':
        return <Key className="w-4 h-4 text-green-600" />;
      case 'login_attempt':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'blocked':
        return <Badge className="bg-yellow-500">Blocked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const exportSecurityLog = () => {
    const csvContent = [
      ['Timestamp', 'Type', 'User', 'IP', 'Location', 'Status', 'Details'],
      ...securityEvents.map(event => [
        event.timestamp,
        event.type,
        event.user,
        event.ip,
        event.location,
        event.status,
        event.details
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'security-log.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Management</h1>
          <p className="text-muted-foreground">
            Monitor security events and configure security settings
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportSecurityLog}>
            <Download className="w-4 h-4 mr-2" />
            Export Log
          </Button>
          <Button onClick={saveSettings}>
            <Shield className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Secure</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityEvents.filter(e => e.status === 'failed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked IPs</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityEvents.filter(e => e.status === 'blocked').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Configure security policies and authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Require 2FA for admin accounts
                </p>
              </div>
              <Switch
                checked={settings.twoFactorEnabled}
                onCheckedChange={(checked) => updateSetting('twoFactorEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Suspicious Activity Detection</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically detect and block suspicious activity
                </p>
              </div>
              <Switch
                checked={settings.suspiciousActivityDetection}
                onCheckedChange={(checked) => updateSetting('suspiciousActivityDetection', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send security alerts via email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Session Timeout (hours)</Label>
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label>Max Login Attempts</Label>
                <Input
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password Policy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="w-5 h-5 mr-2" />
              Password Policy
            </CardTitle>
            <CardDescription>
              Configure password requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Minimum Length</Label>
              <Input
                type="number"
                value={settings.passwordPolicy.minLength}
                onChange={(e) => updateSetting('passwordPolicy.minLength', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Require Uppercase Letters</Label>
                <Switch
                  checked={settings.passwordPolicy.requireUppercase}
                  onCheckedChange={(checked) => updateSetting('passwordPolicy.requireUppercase', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Require Numbers</Label>
                <Switch
                  checked={settings.passwordPolicy.requireNumbers}
                  onCheckedChange={(checked) => updateSetting('passwordPolicy.requireNumbers', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Require Symbols</Label>
                <Switch
                  checked={settings.passwordPolicy.requireSymbols}
                  onCheckedChange={(checked) => updateSetting('passwordPolicy.requireSymbols', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* IP Whitelist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            IP Whitelist
          </CardTitle>
          <CardDescription>
            Manage allowed IP addresses for admin access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter IP address (e.g., 192.168.1.1)"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
              />
              <Button onClick={addIpToWhitelist}>Add IP</Button>
            </div>

            {settings.ipWhitelist.length > 0 ? (
              <div className="space-y-2">
                {settings.ipWhitelist.map((ip, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="font-mono text-sm">{ip}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeIpFromWhitelist(ip)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No IP addresses in whitelist</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Security Events
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
          <CardDescription>
            Recent security events and login attempts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-32" /></TableCell>
                      <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></TableCell>
                      <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-20" /></TableCell>
                      <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-16" /></TableCell>
                      <TableCell><div className="h-6 bg-gray-200 rounded animate-pulse w-16" /></TableCell>
                      <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  securityEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getEventIcon(event.type)}
                          <div>
                            <div className="font-medium capitalize">
                              {event.type.replace('_', ' ')}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {event.details}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{event.user}</TableCell>
                      <TableCell className="font-mono text-sm">{event.ip}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell className="text-sm">{event.timestamp}</TableCell>
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