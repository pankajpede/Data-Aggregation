
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
      headers: [], // Headers are now defined in mockTransactionTypes
      rows: [], // Rows are now defined in mockTransactionTypes
    },
    {
      id: 'table_2',
      name: 'Holdings',
      headers: [], // Headers are now defined in mockHoldingTypes
      rows: [], // Rows are now defined in mockHoldingTypes
    },
  ],
};

export const mockTransactionTypes = [
    { 
        name: 'Dividend', 
        columns: ['Ex-Date', 'Payable-Date', 'Amount', 'Currency'],
        rows: [
            { 'Ex-Date': '2023-10-15', 'Payable-Date': '2023-10-30', 'Amount': '150.00', 'Currency': 'USD' },
            { 'Ex-Date': '2023-07-15', 'Payable-Date': '2023-07-30', 'Amount': '145.50', 'Currency': 'USD' },
        ] 
    },
    { 
        name: 'Sales', 
        columns: ['Date', 'Security', 'Quantity', 'Price', 'Fees'],
        rows: [
            { 'Date': '2023-10-20', 'Security': 'TSLA', 'Quantity': '10', 'Price': '250.00', 'Fees': '5.00' },
        ]
    },
    { 
        name: 'Purchase', 
        columns: ['Date', 'Security', 'Quantity', 'Price', 'Fees'],
        rows: [
            { 'Date': '2023-10-05', 'Security': 'NVDA', 'Quantity': '5', 'Price': '450.00', 'Fees': '5.00' },
        ]
    },
    { 
        name: 'Income', 
        columns: ['Date', 'Source', 'Gross Amount', 'Taxes', 'Net Amount'],
        rows: [
            { 'Date': '2023-10-01', 'Source': 'Interest', 'Gross Amount': '50.00', 'Taxes': '7.50', 'Net Amount': '42.50'},
        ]
    },
    { 
        name: 'Foreign Dividend', 
        columns: ['Ex-Date', 'Payable-Date', 'Amount (Foreign)', 'FX Rate', 'Amount (USD)'],
        rows: [
             { 'Ex-Date': '2023-09-10', 'Payable-Date': '2023-09-25', 'Amount (Foreign)': '100.00', 'FX Rate': '1.05', 'Amount (USD)': '105.00' },
        ]
    },
    { 
        name: 'Depository Bank (ADR) Fee', 
        columns: ['Date', 'Description', 'Amount'],
        rows: [
            { 'Date': '2023-09-30', 'Description': 'ADR Fee for SHELL PLC', 'Amount': '2.50' },
        ] 
    },
];

export const mockHoldingTypes = [
    { 
        name: 'Holdings', 
        columns: ['Security ID', 'Description', 'Quantity', 'Market Value', 'Portfolio %'],
        rows: [
            { 'Security ID': 'AAPL', 'Description': 'Apple Inc.', 'Quantity': '100', 'Market Value': '17000.00', 'Portfolio %': '17.0' },
            { 'Security ID': 'GOOGL', 'Description': 'Alphabet Inc.', 'Quantity': '50', 'Market Value': '13500.00', 'Portfolio %': '13.5' },
            { 'Security ID': 'MSFT', 'Description': 'Microsoft Corp.', 'Quantity': '75', 'Market Value': '25500.00', 'Portfolio %': '25.5' },
            { 'Security ID': 'NVDA', 'Description': 'NVIDIA Corp.', 'Quantity': '35', 'Price': '455.00', 'Market Value': '15925.00', 'Portfolio %': '15.9' },
        ]
    },
];
