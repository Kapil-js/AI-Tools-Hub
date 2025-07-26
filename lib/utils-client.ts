export const downloadFile = (blob: Blob, fileName: string, fileType: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const copyToClipboard = (text: string, successMessage: string = 'Copied to clipboard') => {
  navigator.clipboard.writeText(text).then(() => {
    alert(successMessage);
  }).catch(() => {
    alert('Failed to copy to clipboard');
  });
};