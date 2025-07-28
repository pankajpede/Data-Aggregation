import type { Session, ExtractedTable } from '@/types';

export const mockSessions: Session[] = [
  { id: '1', name: 'Q3_Financials_2023.pdf', date: '2023-10-28', status: 'Completed' },
  { id: '2', name: 'Invoice_Batch_Sept.pdf', date: '2023-10-25', status: 'Completed' },
  { id: '3', name: 'Expense_Report_Oct.pdf', date: '2023-10-22', status: 'In Progress' },
  { id: '4', name: 'Annual_Report_2022.pdf', date: '2023-10-20', status: 'Completed' },
];

export const mockExtractedData: { tables: ExtractedTable[] } = {
  tables: [
    {
      id: 'table_1',
      name: 'Transactions',
      headers: ['Transaction Date', 'Details', 'Amount (USD)', 'Category', 'Status'],
      rows: [
        ['2023-10-01', 'Invoice #INV-001 Payment', '5000.00', 'Revenue', 'Completed'],
        ['2023-10-02', 'Software Subscription', '-150.00', 'Operating Expense', 'Completed'],
        ['2023-10-03', 'Office Supplies Purchase', '-75.50', 'Operating Expense', 'Completed'],
        ['2023-10-05', 'Client A Project Milestone', '12000.00', 'Revenue', 'Completed'],
        ['2023-10-07', 'Cloud Hosting Services', '-300.00', 'Operating Expense', 'Pending'],
      ],
    },
    {
      id: 'table_2',
      name: 'Holdings',
      headers: ['Security ID', 'Description', 'Quantity', 'Market Value', 'Portfolio %'],
      rows: [
        ['AAPL', 'Apple Inc.', '100', '15000.00', '15.0'],
        ['GOOGL', 'Alphabet Inc.', '50', '12500.00', '12.5'],
        ['MSFT', 'Microsoft Corp.', '75', '22500.00', '22.5'],
        ['TSLA', 'Tesla Inc.', '30', '7500.00', '7.5'],
      ],
    },
  ],
};
