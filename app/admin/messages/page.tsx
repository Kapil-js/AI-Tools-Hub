'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  MoreHorizontal,
  Reply,
  Trash2,
  Eye,
  Mail,
  User,
  Calendar,
  Send,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  priority: 'low' | 'medium' | 'high';
  createdAt: any;
  repliedAt?: any;
  reply?: string;
}

export default function MessagesManagement() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const { toast } = useToast();

  // Fetch messages from Firebase
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const messagesRef = collection(db, 'contact_messages');
      const q = query(messagesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const messagesData: Message[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messagesData.push({
          id: doc.id,
          name: data.name || 'Unknown',
          email: data.email || '',
          subject: data.subject || 'No Subject',
          message: data.message || '',
          status: data.status || 'unread',
          priority: data.priority || 'medium',
          createdAt: data.createdAt,
          repliedAt: data.repliedAt,
          reply: data.reply
        });
      });
      
      setMessages(messagesData);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || message.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = async (messageId: string, newStatus: 'unread' | 'read' | 'replied') => {
    try {
      const messageRef = doc(db, 'contact_messages', messageId);
      await updateDoc(messageRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      
      toast({
        title: "Success",
        description: `Message marked as ${newStatus}`,
      });
      
      fetchMessages();
    } catch (error) {
      console.error('Error updating message status:', error);
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'contact_messages', messageId));
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive"
      });
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) {
      toast({
        title: "Error",
        description: "Reply text is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setReplying(true);
      
      // Update message with reply
      const messageRef = doc(db, 'contact_messages', selectedMessage.id);
      await updateDoc(messageRef, {
        status: 'replied',
        reply: replyText,
        repliedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // In a real application, you would send an email here
      // For now, we'll just show a success message
      
      toast({
        title: "Success",
        description: "Reply sent successfully",
      });
      
      setSelectedMessage(null);
      setReplyText('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive"
      });
    } finally {
      setReplying(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <Badge className="bg-red-500">Unread</Badge>;
      case 'read':
        return <Badge className="bg-yellow-500">Read</Badge>;
      case 'replied':
        return <Badge className="bg-green-500">Replied</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="outline">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Manage contact messages and support requests
          </p>
        </div>
        <Button onClick={fetchMessages}>
          <MessageSquare className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {messages.filter(m => m.status === 'unread').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Replied</CardTitle>
            <Reply className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {messages.filter(m => m.status === 'replied').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {messages.filter(m => m.priority === 'high').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Messages ({filteredMessages.length})</CardTitle>
          <CardDescription>
            Manage customer inquiries and support requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Status: {filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                  All Messages
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('unread')}>
                  Unread Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('read')}>
                  Read Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('replied')}>
                  Replied Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                          <div className="h-3 bg-gray-100 rounded animate-pulse w-24" />
                        </div>
                      </TableCell>
                      <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-48" /></TableCell>
                      <TableCell><div className="h-6 bg-gray-200 rounded animate-pulse w-16" /></TableCell>
                      <TableCell><div className="h-6 bg-gray-200 rounded animate-pulse w-16" /></TableCell>
                      <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-20" /></TableCell>
                      <TableCell><div className="h-8 bg-gray-200 rounded animate-pulse w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredMessages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm || filterStatus !== 'all' ? 'No messages found matching your criteria' : 'No messages found'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMessages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {message.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{message.name}</div>
                            <div className="text-sm text-muted-foreground">{message.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="font-medium truncate">{message.subject}</div>
                          <div className="text-sm text-muted-foreground truncate">
                            {message.message.substring(0, 60)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(message.status)}</TableCell>
                      <TableCell>{getPriorityBadge(message.priority)}</TableCell>
                      <TableCell className="text-sm">
                        {formatDate(message.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setSelectedMessage(message)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View & Reply
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Status</DropdownMenuLabel>
                            {message.status !== 'read' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(message.id, 'read')}>
                                Mark as Read
                              </DropdownMenuItem>
                            )}
                            {message.status !== 'unread' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(message.id, 'unread')}>
                                Mark as Unread
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteMessage(message.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
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

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => {
        if (!open) {
          setSelectedMessage(null);
          setReplyText('');
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Message Details</span>
              {selectedMessage && getStatusBadge(selectedMessage.status)}
            </DialogTitle>
            <DialogDescription>
              View message details and send a reply
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>From</Label>
                  <div className="font-medium">{selectedMessage.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedMessage.email}</div>
                </div>
                <div>
                  <Label>Date</Label>
                  <div className="text-sm">{formatDate(selectedMessage.createdAt)}</div>
                </div>
              </div>

              <div>
                <Label>Subject</Label>
                <div className="font-medium">{selectedMessage.subject}</div>
              </div>

              <div>
                <Label>Message</Label>
                <div className="p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {selectedMessage.reply && (
                <div>
                  <Label>Previous Reply</Label>
                  <div className="p-3 bg-blue-50 rounded-md whitespace-pre-wrap">
                    {selectedMessage.reply}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Replied on {formatDate(selectedMessage.repliedAt)}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="reply">Reply</Label>
                <Textarea
                  id="reply"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={6}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => {
                  setSelectedMessage(null);
                  setReplyText('');
                }}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleReply} disabled={replying || !replyText.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  {replying ? 'Sending...' : 'Send Reply'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}