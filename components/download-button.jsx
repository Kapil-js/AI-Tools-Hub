'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { downloadFile } from '@/lib/utils-client';

export function DownloadButton({ content, filename, contentType = 'text/plain', children }) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => downloadFile(content, filename, contentType)}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      {children || 'Download'}
    </Button>
  );
}