'use client';

import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { copyToClipboard } from '@/lib/utils-client';

export function CopyButton({ text, message = "Copied to clipboard!" }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    copyToClipboard(text, message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleCopy}
      className="h-8 w-8 p-0"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}