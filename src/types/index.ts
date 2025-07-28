export type ExtractedTable = {
  id: string;
  name: string;
  headers: string[];
  rows: string[][];
};

export type Session = {
  id:string;
  name: string;
  date: string;
  status: 'Completed' | 'In Progress';
};
