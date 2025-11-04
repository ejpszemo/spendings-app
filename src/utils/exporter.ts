export const exportToJSON = (data: any[] | Record<string, any[]>, filename: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
};

export const importFromJSON = async (
  event: React.ChangeEvent<HTMLInputElement>
): Promise<{ users?: any[]; spendings?: any[] } | null> => {
  const file = event.target.files?.[0];
  if (!file) return null;

  const text = await file.text();
  try {
    const data = JSON.parse(text);
    if (!data || typeof data !== 'object') {
      alert("Invalid file format! Expected an object.");
      return null;
    }
    
    const hasUsers = data.users && Array.isArray(data.users);
    const hasSpendings = data.spendings && Array.isArray(data.spendings);
    
    if (!hasUsers && !hasSpendings) {
      alert("Invalid file format! Expected at least 'users' or 'spendings' array.");
      return null;
    }
    
    return data;
  } catch (error) {
    alert("Invalid JSON file!");
    console.error("Invalid JSON file:", error);
    return null;
  }
};
