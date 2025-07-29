
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
            { 'Ex-Date': '2023-04-15', 'Payable-Date': '2023-04-30', 'Amount': '140.25', 'Currency': 'USD' },
            { 'Ex-Date': '2023-01-15', 'Payable-Date': '2023-01-30', 'Amount': '135.00', 'Currency': 'USD' },
            { 'Ex-Date': '2022-10-15', 'Payable-Date': '2022-10-30', 'Amount': '130.75', 'Currency': 'USD' },
            { 'Ex-Date': '2022-07-15', 'Payable-Date': '2022-07-30', 'Amount': '125.50', 'Currency': 'USD' },
            { 'Ex-Date': '2022-04-15', 'Payable-Date': '2022-04-30', 'Amount': '120.25', 'Currency': 'USD' },
            { 'Ex-Date': '2022-01-15', 'Payable-Date': '2022-01-30', 'Amount': '115.00', 'Currency': 'USD' },
            { 'Ex-Date': '2021-10-15', 'Payable-Date': '2021-10-30', 'Amount': '110.75', 'Currency': 'USD' },
            { 'Ex-Date': '2021-07-15', 'Payable-Date': '2021-07-30', 'Amount': '105.50', 'Currency': 'USD' },
            { 'Ex-Date': '2021-04-15', 'Payable-Date': '2021-04-30', 'Amount': '100.25', 'Currency': 'USD' },
            { 'Ex-Date': '2021-01-15', 'Payable-Date': '2021-01-30', 'Amount': '95.00', 'Currency': 'USD' },
        ] 
    },
    { 
        name: 'Sales', 
        columns: ['Date', 'Security', 'Quantity', 'Price', 'Fees'],
        rows: [
            { 'Date': '2023-10-20', 'Security': 'TSLA', 'Quantity': '10', 'Price': '250.00', 'Fees': '5.00' },
            { 'Date': '2023-09-15', 'Security': 'AAPL', 'Quantity': '20', 'Price': '175.00', 'Fees': '7.50' },
            { 'Date': '2023-08-10', 'Security': 'GOOGL', 'Quantity': '15', 'Price': '130.00', 'Fees': '6.00' },
            { 'Date': '2023-07-05', 'Security': 'AMZN', 'Quantity': '25', 'Price': '140.00', 'Fees': '8.00' },
            { 'Date': '2023-06-20', 'Security': 'MSFT', 'Quantity': '12', 'Price': '340.00', 'Fees': '5.50' },
            { 'Date': '2023-05-15', 'Security': 'NFLX', 'Quantity': '30', 'Price': '400.00', 'Fees': '10.00' },
            { 'Date': '2023-04-10', 'Security': 'META', 'Quantity': '18', 'Price': '300.00', 'Fees': '7.00' },
            { 'Date': '2023-03-05', 'Security': 'BABA', 'Quantity': '40', 'Price': '90.00', 'Fees': '12.00' },
            { 'Date': '2023-02-20', 'Security': 'DIS', 'Quantity': '22', 'Price': '100.00', 'Fees': '6.50' },
            { 'Date': '2023-01-15', 'Security': 'V', 'Quantity': '10', 'Price': '230.00', 'Fees': '5.00' },
            { 'Date': '2022-12-10', 'Security': 'JPM', 'Quantity': '15', 'Price': '140.00', 'Fees': '6.00' },
            { 'Date': '2022-11-05', 'Security': 'WMT', 'Quantity': '25', 'Price': '150.00', 'Fees': '8.00' },
        ]
    },
    { 
        name: 'Purchase', 
        columns: ['Date', 'Security', 'Quantity', 'Price', 'Fees'],
        rows: [
            { 'Date': '2023-10-05', 'Security': 'NVDA', 'Quantity': '5', 'Price': '450.00', 'Fees': '5.00' },
            { 'Date': '2023-09-01', 'Security': 'COST', 'Quantity': '10', 'Price': '550.00', 'Fees': '7.50' },
            { 'Date': '2023-08-15', 'Security': 'HD', 'Quantity': '15', 'Price': '330.00', 'Fees': '6.00' },
            { 'Date': '2023-07-20', 'Security': 'PG', 'Quantity': '20', 'Price': '155.00', 'Fees': '8.00' },
            { 'Date': '2023-06-10', 'Security': 'JNJ', 'Quantity': '25', 'Price': '165.00', 'Fees': '9.00' },
            { 'Date': '2023-05-05', 'Security': 'KO', 'Quantity': '30', 'Price': '60.00', 'Fees': '10.00' },
            { 'Date': '2023-04-15', 'Security': 'PEP', 'Quantity': '18', 'Price': '180.00', 'Fees': '7.00' },
            { 'Date': '2023-03-20', 'Security': 'MCD', 'Quantity': '40', 'Price': '280.00', 'Fees': '12.00' },
            { 'Date': '2023-02-10', 'Security': 'BAC', 'Quantity': '50', 'Price': '30.00', 'Fees': '15.00' },
            { 'Date': '2023-01-25', 'Security': 'XOM', 'Quantity': '35', 'Price': '110.00', 'Fees': '11.00' },
            { 'Date': '2022-12-15', 'Security': 'CVX', 'Quantity': '45', 'Price': '170.00', 'Fees': '14.00' },
            { 'Date': '2022-11-20', 'Security': 'UNH', 'Quantity': '8', 'Price': '500.00', 'Fees': '6.00' },
        ]
    },
    { 
        name: 'Income', 
        columns: ['Date', 'Source', 'Gross Amount', 'Taxes', 'Net Amount'],
        rows: [
            { 'Date': '2023-10-01', 'Source': 'Interest', 'Gross Amount': '50.00', 'Taxes': '7.50', 'Net Amount': '42.50'},
            { 'Date': '2023-09-01', 'Source': 'Bond Coupon', 'Gross Amount': '100.00', 'Taxes': '15.00', 'Net Amount': '85.00'},
            { 'Date': '2023-08-01', 'Source': 'Rental Income', 'Gross Amount': '1200.00', 'Taxes': '180.00', 'Net Amount': '1020.00'},
            { 'Date': '2023-07-01', 'Source': 'Interest', 'Gross Amount': '55.00', 'Taxes': '8.25', 'Net Amount': '46.75'},
            { 'Date': '2023-06-01', 'Source': 'Bond Coupon', 'Gross Amount': '100.00', 'Taxes': '15.00', 'Net Amount': '85.00'},
            { 'Date': '2023-05-01', 'Source': 'Rental Income', 'Gross Amount': '1200.00', 'Taxes': '180.00', 'Net Amount': '1020.00'},
            { 'Date': '2023-04-01', 'Source': 'Interest', 'Gross Amount': '60.00', 'Taxes': '9.00', 'Net Amount': '51.00'},
            { 'Date': '2023-03-01', 'Source': 'Bond Coupon', 'Gross Amount': '100.00', 'Taxes': '15.00', 'Net Amount': '85.00'},
            { 'Date': '2023-02-01', 'Source': 'Rental Income', 'Gross Amount': '1200.00', 'Taxes': '180.00', 'Net Amount': '1020.00'},
            { 'Date': '2023-01-01', 'Source': 'Interest', 'Gross Amount': '65.00', 'Taxes': '9.75', 'Net Amount': '55.25'},
            { 'Date': '2022-12-01', 'Source': 'Bond Coupon', 'Gross Amount': '100.00', 'Taxes': '15.00', 'Net Amount': '85.00'},
            { 'Date': '2022-11-01', 'Source': 'Rental Income', 'Gross Amount': '1200.00', 'Taxes': '180.00', 'Net Amount': '1020.00'},
        ]
    },
    { 
        name: 'Foreign Dividend', 
        columns: ['Ex-Date', 'Payable-Date', 'Amount (Foreign)', 'FX Rate', 'Amount (USD)'],
        rows: [
             { 'Ex-Date': '2023-09-10', 'Payable-Date': '2023-09-25', 'Amount (Foreign)': '100.00', 'FX Rate': '1.05', 'Amount (USD)': '105.00' },
             { 'Ex-Date': '2023-06-10', 'Payable-Date': '2023-06-25', 'Amount (Foreign)': '120.00', 'FX Rate': '1.08', 'Amount (USD)': '129.60' },
             { 'Ex-Date': '2023-03-10', 'Payable-Date': '2023-03-25', 'Amount (Foreign)': '90.00', 'FX Rate': '1.03', 'Amount (USD)': '92.70' },
             { 'Ex-Date': '2022-12-10', 'Payable-Date': '2022-12-25', 'Amount (Foreign)': '110.00', 'FX Rate': '1.06', 'Amount (USD)': '116.60' },
             { 'Ex-Date': '2022-09-10', 'Payable-Date': '2022-09-25', 'Amount (Foreign)': '95.00', 'FX Rate': '1.01', 'Amount (USD)': '95.95' },
             { 'Ex-Date': '2022-06-10', 'Payable-Date': '2022-06-25', 'Amount (Foreign)': '115.00', 'FX Rate': '1.07', 'Amount (USD)': '123.05' },
             { 'Ex-Date': '2022-03-10', 'Payable-Date': '2022-03-25', 'Amount (Foreign)': '85.00', 'FX Rate': '1.02', 'Amount (USD)': '86.70' },
             { 'Ex-Date': '2021-12-10', 'Payable-Date': '2021-12-25', 'Amount (Foreign)': '105.00', 'FX Rate': '1.04', 'Amount (USD)': '109.20' },
             { 'Ex-Date': '2021-09-10', 'Payable-Date': '2021-09-25', 'Amount (Foreign)': '80.00', 'FX Rate': '1.00', 'Amount (USD)': '80.00' },
             { 'Ex-Date': '2021-06-10', 'Payable-Date': '2021-06-25', 'Amount (Foreign)': '125.00', 'FX Rate': '1.09', 'Amount (USD)': '136.25' },
             { 'Ex-Date': '2021-03-10', 'Payable-Date': '2021-03-25', 'Amount (Foreign)': '75.00', 'FX Rate': '1.01', 'Amount (USD)': '75.75' },
             { 'Ex-Date': '2020-12-10', 'Payable-Date': '2020-12-25', 'Amount (Foreign)': '130.00', 'FX Rate': '1.10', 'Amount (USD)': '143.00' },
        ]
    },
    { 
        name: 'Depository Bank (ADR) Fee', 
        columns: ['Date', 'Description', 'Amount'],
        rows: [
            { 'Date': '2023-09-30', 'Description': 'ADR Fee for SHELL PLC', 'Amount': '2.50' },
            { 'Date': '2023-06-30', 'Description': 'ADR Fee for BP PLC', 'Amount': '2.00' },
            { 'Date': '2023-03-31', 'Description': 'ADR Fee for RIO TINTO', 'Amount': '1.50' },
            { 'Date': '2022-12-31', 'Description': 'ADR Fee for BHP GROUP', 'Amount': '3.00' },
            { 'Date': '2022-09-30', 'Description': 'ADR Fee for SHELL PLC', 'Amount': '2.50' },
            { 'Date': '2022-06-30', 'Description': 'ADR Fee for BP PLC', 'Amount': '2.00' },
            { 'Date': '2022-03-31', 'Description': 'ADR Fee for RIO TINTO', 'Amount': '1.50' },
            { 'Date': '2021-12-31', 'Description': 'ADR Fee for BHP GROUP', 'Amount': '3.00' },
            { 'Date': '2021-09-30', 'Description': 'ADR Fee for SHELL PLC', 'Amount': '2.50' },
            { 'Date': '2021-06-30', 'Description': 'ADR Fee for BP PLC', 'Amount': '2.00' },
            { 'Date': '2021-03-31', 'Description': 'ADR Fee for RIO TINTO', 'Amount': '1.50' },
            { 'Date': '2020-12-31', 'Description': 'ADR Fee for BHP GROUP', 'Amount': '3.00' },
        ] 
    },
];

export const mockHoldingTypes = [
    { 
        name: 'Holdings', 
        columns: ['Security ID', 'Description', 'Quantity', 'Market Value', 'Portfolio %'],
        rows: [
            { 'Security ID': 'AAPL', 'Description': 'Apple Inc.', 'Quantity': '100', 'Market Value': '17000.00', 'Portfolio %': '10.0' },
            { 'Security ID': 'GOOGL', 'Description': 'Alphabet Inc.', 'Quantity': '50', 'Market Value': '13500.00', 'Portfolio %': '8.0' },
            { 'Security ID': 'MSFT', 'Description': 'Microsoft Corp.', 'Quantity': '75', 'Market Value': '25500.00', 'Portfolio %': '15.0' },
            { 'Security ID': 'NVDA', 'Description': 'NVIDIA Corp.', 'Quantity': '35', 'Price': '455.00', 'Market Value': '15925.00', 'Portfolio %': '9.4' },
            { 'Security ID': 'AMZN', 'Description': 'Amazon.com, Inc.', 'Quantity': '60', 'Market Value': '8400.00', 'Portfolio %': '5.0' },
            { 'Security ID': 'TSLA', 'Description': 'Tesla, Inc.', 'Quantity': '40', 'Market Value': '10000.00', 'Portfolio %': '5.9' },
            { 'Security ID': 'JPM', 'Description': 'JPMorgan Chase & Co.', 'Quantity': '120', 'Market Value': '16800.00', 'Portfolio %': '9.9' },
            { 'Security ID': 'V', 'Description': 'Visa Inc.', 'Quantity': '80', 'Market Value': '18400.00', 'Portfolio %': '10.8' },
            { 'Security ID': 'JNJ', 'Description': 'Johnson & Johnson', 'Quantity': '90', 'Market Value': '14850.00', 'Portfolio %': '8.7' },
            { 'Security ID': 'WMT', 'Description': 'Walmart Inc.', 'Quantity': '150', 'Market Value': '22500.00', 'Portfolio %': '13.2' },
            { 'Security ID': 'PG', 'Description': 'Procter & Gamble Co.', 'Quantity': '110', 'Market Value': '17050.00', 'Portfolio %': '10.0' },
            { 'Security ID': 'UNH', 'Description': 'UnitedHealth Group Inc.', 'Quantity': '25', 'Market Value': '12500.00', 'Portfolio %': '7.4' },
        ]
    },
];
