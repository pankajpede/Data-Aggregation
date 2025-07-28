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
      name: 'Transaction Summary (Page 1)',
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
      name: 'Expense Breakdown (Page 2)',
      headers: ['Expense ID', 'Item', 'Cost', 'Vendor', 'Purchase Date'],
      rows: [
        ['E-001', 'Laptop', '1200.00', 'TechStore', '2023-09-15'],
        ['E-002', 'Office Chairs (x4)', '800.00', 'OfficeDepot', '2023-09-18'],
        ['E-003', 'Marketing Campaign', '2500.00', 'Adgency', '2023-09-20'],
        ['E-004', 'Catering for event', '650.00', 'TastyBites', '2023-09-22'],
      ],
    },
  ],
};
