'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Image, Settings, Eye, BarChart3 } from 'lucide-react';

// Mock tools data
const mockTools = [
  { 
    id: 1, 
    name: 'Image Enhancer', 
    status: 'active', 
    usage: 45231, 
    lastUpdated: '2024-01-15',
    maintenance: false 
  },
  { 
    id: 2, 
    name: 'PDF Compressor', 
    status: 'active', 
    usage: 38445, 
    lastUpdated: '2024-01-14',
    maintenance: false 
  },
  { 
    id: 3, 
    name: 'Face Swapper', 
    status: 'maintenance', 
    usage: 29834, 
    lastUpdated: '2024-01-13',
    maintenance: true 
  },
  { 
    id: 4, 
    name: 'Resume Builder', 
    status: 'active', 
    usage: 23567, 
    lastUpdated: '2024-01-12',
    maintenance: false 
  },
  { 
    id: 5, 
    name: 'Instagram Caption', 
    status: 'inactive', 
    usage: 19876, 
    lastUpdated: '2024-01-10',
    maintenance: false 
  },
];

export default function ToolsManagement() {
  const [tools, setTools] = useState(mockTools);

  const handleToggleTool = (toolId: number) => {
    setTools(prev => prev.map(tool => 
      tool.id === toolId 
        ? { ...tool, status: tool.status === 'active' ? 'inactive' : 'active' }
        : tool
    ));
  };

  const handleToggleMaintenance = (toolId: number) => {
    setTools(prev => prev.map(tool => 
      tool.id === toolId 
        ? { 
            ...tool, 
            maintenance: !tool.maintenance,
            status: !tool.maintenance ? 'maintenance' : 'active'
          }
        : tool
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400">Inactive</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tools Management</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage AI tools, monitor usage, and control availability
          </p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
          <Settings className="w-4 h-4 mr-2" />
          Configure Tools
        </Button>
      </div>

      {/* Tools Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Tools</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{tools.length}</p>
              </div>
              <Image className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Tools</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {tools.filter(tool => tool.status === 'active').length}
                </p>
              </div>
              <Image className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">In Maintenance</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {tools.filter(tool => tool.status === 'maintenance').length}
                </p>
              </div>
              <Settings className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Usage</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {tools.reduce((sum, tool) => sum + tool.usage, 0).toLocaleString()}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tools Table */}
      <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle>AI Tools</CardTitle>
          <CardDescription>
            Manage individual tools and their configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tool Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Maintenance Mode</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tools.map((tool) => (
                <TableRow key={tool.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Image className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{tool.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(tool.status)}</TableCell>
                  <TableCell className="font-medium">
                    {tool.usage.toLocaleString()}
                  </TableCell>
                  <TableCell>{tool.lastUpdated}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={tool.maintenance}
                      onCheckedChange={() => handleToggleMaintenance(tool.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={tool.status === 'active'}
                      onCheckedChange={() => handleToggleTool(tool.id)}
                      disabled={tool.maintenance}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
