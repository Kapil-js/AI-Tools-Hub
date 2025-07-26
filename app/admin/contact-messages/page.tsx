'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Search, Eye, Trash2, Calendar, User, Building, MessageCircle } from 'lucide-react';
import { collection, getDocs, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company: string;
  inquiryType: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  isRead: boolean;
  createdAt: any;
}

export default function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchTerm, statusFilter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const messagesRef = collection(db, 'contact_messages');
      const q = query(messagesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const messagesData: ContactMessage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messagesData.push({
          id: doc.id,
          name: data.name || '',
          email: data.email || '',
          company: data.company || '',
          inquiryType: data.inquiryType || 'general',
          subject: data.subject || '',
          message: data.message || '',
          status: data.status || 'new',
          isRead: data.isRead || false,
          createdAt: data.createdAt
        });
      });
      
      setMessages(messagesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch contact messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = messages;
    
    if (searchTerm) {
      filtered = filtered.filter(message =>
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(message => message.status === statusFilter);
    }
    
    setFilteredMessages(filtered);
  };

  const markAsRead = async (messageId: string) => {
    try {
      await updateDoc(doc(db, 'contact_messages', messageId), {
        status: 'read',
        isRead: true
      });
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: 'read', isRead: true } : msg
      ));
      
      toast({
        title: "Success",
        description: "Message marked as read"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive"
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await deleteDoc(doc(db, 'contact_messages', messageId));
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setSelectedMessage(null);
      
      toast({
        title: "Success",
        description: "Message deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive"
      });
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-600">Manage customer inquiries</p>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Messages ({filteredMessages.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="animate-pulse p-4 border rounded-lg">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                      </div>
                    ))}
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No messages found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          selectedMessage?.id === message.id ? 'border-blue-500 bg-blue-50' : ''
                        } ${!message.isRead ? 'border-l-4 border-l-blue-500' : ''}`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{message.name}</span>
                            <Badge variant={message.status === 'new' ? 'default' : 'secondary'}>
                              {message.status}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{message.email}</p>
                        <p className="text-sm font-medium">{message.subject}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Message Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedMessage ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{selectedMessage.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{selectedMessage.email}</span>
                      </div>
                      {selectedMessage.company && (
                        <div className="flex items-center space-x-2 mb-2">
                          <Building className="w-4 h-4" />
                          <span className="text-sm">{selectedMessage.company}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{formatDate(selectedMessage.createdAt)}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Subject</h4>
                      <p className="text-sm">{selectedMessage.subject}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Message</h4>
                      <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>

                    <div className="flex space-x-2">
                      {selectedMessage.status === 'new' && (
                        <Button size="sm" onClick={() => markAsRead(selectedMessage.id)}>
                          <Eye className="w-4 h-4 mr-1" />
                          Mark Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMessage(selectedMessage.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select a message</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}