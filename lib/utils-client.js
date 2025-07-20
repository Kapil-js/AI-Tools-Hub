'use client';

import { toast } from '@/hooks/use-toast';

// Copy text to clipboard with toast notification using modern Clipboard API
export function copyToClipboard(text, message = "Copied to clipboard!") {
  if (navigator.clipboard && window.isSecureContext) {
    // Use modern Clipboard API if available and in secure context
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copied!",
          description: message,
          duration: 2000,
        });
      })
      .catch(() => {
        // Fallback to older method if permission denied
        copyToClipboardFallback(text, message);
      });
  } else {
    // Fallback for browsers without Clipboard API or non-secure contexts
    copyToClipboardFallback(text, message);
  }
}

// Fallback method for clipboard copy
function copyToClipboardFallback(text, message) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    toast({
      title: "Copied!",
      description: message,
      duration: 2000,
    });
  } catch (err) {
    toast({
      title: "Failed to copy",
      description: "Please try again",
      variant: "destructive",
      duration: 2000,
    });
  }
  
  document.body.removeChild(textarea);
}

// Download content as a file with toast notification
export function downloadFile(content, filename, contentType = 'text/plain') {
  try {
    // Handle different content types
    let blob;
    
    if (content instanceof Blob) {
      // If content is already a Blob, use it directly
      blob = content;
    } else if (content instanceof File) {
      // If content is a File object, convert to Blob
      blob = new Blob([content], { type: content.type || contentType });
    } else if (typeof content === 'object') {
      // If content is an object, stringify it for JSON
      blob = new Blob([JSON.stringify(content)], { type: 'application/json' });
    } else {
      // For text or other content
      blob = new Blob([content], { type: contentType });
    }
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    toast({
      title: "Download started",
      description: `${filename} is being downloaded`,
      duration: 2000,
    });
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (err) {
    console.error('Download error:', err);
    toast({
      title: "Download failed",
      description: "Please try again",
      variant: "destructive",
      duration: 2000,
    });
  }
}

// Download a file from a URL
export function downloadFromUrl(url, filename) {
  try {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        // Use the existing downloadFile function with the blob
        downloadFile(blob, filename, blob.type);
      })
      .catch(error => {
        console.error('Download error:', error);
        toast({
          title: "Download failed",
          description: "Could not download the file",
          variant: "destructive",
          duration: 2000,
        });
      });
  } catch (err) {
    console.error('Download error:', err);
    toast({
      title: "Download failed",
      description: "Please try again",
      variant: "destructive",
      duration: 2000,
    });
  }
}