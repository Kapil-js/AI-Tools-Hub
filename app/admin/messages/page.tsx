'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MessageSquare, Mail, Reply, Trash2, Search, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';

// Mock messages data
const mockMessages = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    subject: 'Issue with PDF Compressor',
    message: 'The PDF compressor is not working properly. It keeps showing an error when I try to upload files.',
    date: '2024-01-20T10:30:00Z',
    status: 'unread',
    priority: 'high',
    type: 'support'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    subject: 'Feature Request',
    message: 'Would it be possible to add batch processing to the image enhancer tool?',
    date: '2024-01-19T15:45:00Z',
    status: 'replied',
    priority: 'medium',
    type: 'feature'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    subject: 'Billing Question',
    message: 'I was charged twice for my Pro subscription this month. Can you please check?',
    date: '2024-01-18T09:15:00Z',
    status: 'resolved',
    priority: 'high',
    type: 'billing'
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    subject: 'General Inquiry',
    message: 'How can I upgrade my plan to Business? I need access to the API.',
    date: '2024-01-17T14:20:00Z',
    status: 'unread',
    priority: 'low',
    type: 'general'
  },
];

export default function MessagesManagement() {
  const [messages, setMessages] = useState(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [replyText, setReplyText] = useState('');

  // Filter messages
  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Unread</Badge>;
      case 'replied':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Replied</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Resolved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'replied':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleReply = () => {
    // Implement reply logic here
    console.log('Replying to message:', selectedMessage?.id, 'with:', replyText);
    setReplyText('');
    setIsMessageDialogOpen(false);
  };

  const handleMarkAsResolved = (messageId: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status: 'resolved' } : msg
    ));
  };

  const handleDelete = (messageId: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Messages</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage user communications and support requests
          </p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
          <Mail className="w-4 h-4 mr-2" />
          Compose Message
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Messages</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{messages.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Unread</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {messages.filter(msg => msg.status === 'unread').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Awaiting Reply</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {messages.filter(msg => msg.status === 'replied').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Resolved</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {messages.filter(msg => msg.status === 'resolved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                className="pl-10"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="replied">Replied</option>
                <option value="resolved">Resolved</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle>Messages ({filteredMessages.length})</CardTitle>
          <CardDescription>
            User communications and support requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.map((message) => (
                <TableRow key={message.id} className={message.status === 'unread' ? 'bg-blue-50 dark:bg-blue-900/10' : ''}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(message.status)}
                      <div>
                        <p className={`font-medium ${message.status === 'unread' ? 'font-bold' : ''} text-slate-900 dark:text-white`}>
                          {message.name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{message.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className={`${message.status === 'unread' ? 'font-bold' : ''} text-slate-900 dark:text-white`}>
                      {message.subject}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {message.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{getPriorityBadge(message.priority)}</TableCell>
                  <TableCell>{getStatusBadge(message.status)}</TableCell>
                  <TableCell>{formatDate(message.date)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedMessage(message);
                          setIsMessageDialogOpen(true);
                        }}
                      >
                        <Reply className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsResolved(message.id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(message.id)}
                      >
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

      {/* Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              View and reply to user message
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {selectedMessage.name}
                  </h3>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(selectedMessage.date)}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {selectedMessage.email}
                </p>
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                  Subject: {selectedMessage.subject}
                </h4>
                <p className="text-slate-700 dark:text-slate-300">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 dark:text-white">
                  Reply
                </label>
                <Textarea
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleReply}>
                  <Reply className="w-4 h-4 mr-2" />
                  Send Reply
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
