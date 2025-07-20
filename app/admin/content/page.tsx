'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Edit, Trash2 } from 'lucide-react';

// Mock content data
const mockContent = [
  { id: 1, title: 'AI in Creative Industries', date: '2024-01-15', status: 'published' },
  { id: 2, title: 'The Future of AI-Powered Content Creation', date: '2024-01-12', status: 'draft' },
  { id: 3, title: 'Resume Writing in the AI Era', date: '2024-01-08', status: 'review' },
];

export default function ContentManagement() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Content Management</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage blog posts, articles, and other content
          </p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
          <FileText className="w-4 h-4 mr-2" />
          Add Content
        </Button>
      </div>

      {/* Content Table */}
      <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>
            Manage and edit website content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockContent.map((content) => (
                <TableRow key={content.id}>
                  <TableCell>{content.title}</TableCell>
                  <TableCell>{content.date}</TableCell>
                  <TableCell>
                    <span className={
                      content.status === 'published'
                        ? 'text-green-600'
                        : content.status === 'draft'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }>
                      {content.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
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
