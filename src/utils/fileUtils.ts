export const getFileExtension = (fileName: string): string => {
    const ext = fileName.split('.').pop();
    return ext?.toLowerCase() || '';
  };