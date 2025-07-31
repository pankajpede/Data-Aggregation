
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
        columns: ['CUSTODIAN_NAME', 'ACCOUNT_NUMBER', 'AS_OF_DATE', 'TRADE_DATE', 'SETTLEMENT_DATE', 'CUSIP', 'TICKER', 'TRANSACTION_CODE', 'NARRATION', 'TXN_AMOUNT', 'TXN_QUANTITY', 'TXN_PRICE', 'Total_Cost_Basis', 'Transaction_Cost', 'SEDOL', 'Accrual_Interest', 'Long_term_income_loss', 'Short_term_income_loss', 'Ticker_Cusip_Name'],
        rows: Array.from({ length: 12 }, (_, i) => ({
            'CUSTODIAN_NAME': 'Apex Clearing',
            'ACCOUNT_NUMBER': `ACCT${12345 + i}`,
            'AS_OF_DATE': `2023-10-${28 - i}`,
            'TRADE_DATE': `2023-10-${27 - i}`,
            'SETTLEMENT_DATE': `2023-10-${29 - i}`,
            'CUSIP': `CUSIP${98765 - i}`,
            'TICKER': 'AAPL',
            'TRANSACTION_CODE': 'DIV',
            'NARRATION': 'QUALIFIED DIVIDEND',
            'TXN_AMOUNT': `${(150 - i * 2.5).toFixed(2)}`,
            'TXN_QUANTITY': '10',
            'TXN_PRICE': `${(15 - i * 0.25).toFixed(2)}`,
            'Total_Cost_Basis': '1400.00',
            'Transaction_Cost': '0.00',
            'SEDOL': `SEDOL${54321 - i}`,
            'Accrual_Interest': '0.00',
            'Long_term_income_loss': '0.00',
            'Short_term_income_loss': '0.00',
            'Ticker_Cusip_Name': 'Apple Inc.'
        }))
    },
    { 
        name: 'Sale', 
        columns: ['CUSTODIAN_NAME', 'ACCOUNT_NUMBER', 'AS_OF_DATE', 'TRADE_DATE', 'SETTLEMENT_DATE', 'CUSIP', 'TICKER', 'TRANSACTION_CODE', 'NARRATION', 'TXN_AMOUNT', 'TXN_QUANTITY', 'TXN_PRICE', 'Total_Cost_Basis', 'Transaction_Cost', 'SEDOL', 'Accrual_Interest', 'Long_term_income_loss', 'Short_term_income_loss', 'Ticker_Cusip_Name'],
        rows: Array.from({ length: 12 }, (_, i) => ({
            'CUSTODIAN_NAME': 'Fidelity',
            'ACCOUNT_NUMBER': `ACCT${54321 + i}`,
            'AS_OF_DATE': `2023-10-${28 - i}`,
            'TRADE_DATE': `2023-10-${27 - i}`,
            'SETTLEMENT_DATE': `2023-10-${29 - i}`,
            'CUSIP': `CUSIP${12345 - i}`,
            'TICKER': 'TSLA',
            'TRANSACTION_CODE': 'SELL',
            'NARRATION': 'SALE OF TESLA INC',
            'TXN_AMOUNT': `${(2500 + i * 50).toFixed(2)}`,
            'TXN_QUANTITY': '10',
            'TXN_PRICE': `${(250 + i * 5).toFixed(2)}`,
            'Total_Cost_Basis': '2000.00',
            'Transaction_Cost': '5.00',
            'SEDOL': `SEDOL${98765 - i}`,
            'Accrual_Interest': '0.00',
            'Long_term_income_loss': `${(500 + i * 50).toFixed(2)}`,
            'Short_term_income_loss': '0.00',
            'Ticker_Cusip_Name': 'Tesla Inc.'
        }))
    },
    { 
        name: 'Purchase', 
        columns: ['CUSTODIAN_NAME', 'ACCOUNT_NUMBER', 'AS_OF_DATE', 'TRADE_DATE', 'SETTLEMENT_DATE', 'CUSIP', 'TICKER', 'TRANSACTION_CODE', 'NARRATION', 'TXN_AMOUNT', 'TXN_QUANTITY', 'TXN_PRICE', 'Total_Cost_Basis', 'Transaction_Cost', 'SEDOL', 'Accrual_Interest', 'Long_term_income_loss', 'Short_term_income_loss', 'Ticker_Cusip_Name'],
        rows: Array.from({ length: 12 }, (_, i) => ({
            'CUSTODIAN_NAME': 'Charles Schwab',
            'ACCOUNT_NUMBER': `ACCT${24680 + i}`,
            'AS_OF_DATE': `2023-10-${28 - i}`,
            'TRADE_DATE': `2023-10-${27 - i}`,
            'SETTLEMENT_DATE': `2023-10-${29 - i}`,
            'CUSIP': `CUSIP${54321 - i}`,
            'TICKER': 'NVDA',
            'TRANSACTION_CODE': 'BUY',
            'NARRATION': 'PURCHASE OF NVIDIA CORP',
            'TXN_AMOUNT': `${(4500 - i * 100).toFixed(2)}`,
            'TXN_QUANTITY': '10',
            'TXN_PRICE': `${(450 - i * 10).toFixed(2)}`,
            'Total_Cost_Basis': `${(4500 - i * 100).toFixed(2)}`,
            'Transaction_Cost': '5.00',
            'SEDOL': `SEDOL${12345 - i}`,
            'Accrual_Interest': '0.00',
            'Long_term_income_loss': '0.00',
            'Short_term_income_loss': '0.00',
            'Ticker_Cusip_Name': 'NVIDIA Corp'
        }))
    },
    { 
        name: 'Income', 
        columns: ['CUSTODIAN_NAME', 'ACCOUNT_NUMBER', 'AS_OF_DATE', 'NARRATION', 'AMOUNT', 'TICKER'],
        rows: Array.from({ length: 12 }, (_, i) => ({
            'CUSTODIAN_NAME': 'Vanguard',
            'ACCOUNT_NUMBER': `ACCT${13579 + i}`,
            'AS_OF_DATE': `2023-${12 - i}-01`,
            'NARRATION': 'INTEREST INCOME',
            'AMOUNT': `${(50 + i * 5).toFixed(2)}`,
            'TICKER': 'VMFXX'
        }))
    },
    { 
        name: 'Foreign Dividend', 
        columns: ['CUSTODIAN_NAME', 'ACCOUNT_NUMBER', 'AS_OF_DATE', 'NARRATION', 'Foreign Withholding', 'Currency', 'Amount', 'Ticker or Security Name'],
        rows: Array.from({ length: 12 }, (_, i) => ({
            'CUSTODIAN_NAME': 'Interactive Brokers',
            'ACCOUNT_NUMBER': `ACCT${97531 + i}`,
            'AS_OF_DATE': `2023-${12-i}-15`,
            'NARRATION': 'FOREIGN DIVIDEND',
            'Foreign Withholding': `${(15 + i * 0.5).toFixed(2)}`,
            'Currency': 'EUR',
            'Amount': `${(100 + i * 2).toFixed(2)}`,
            'Ticker or Security Name': 'SHELL PLC'
        }))
    },
    { 
        name: 'Depository Bank (ADR) Fee', 
        columns: ['CUSTODIAN_NAME', 'ACCOUNT_NUMBER', 'AS_OF_DATE', 'CUSIP', 'FEE_AMOUNT', 'FEE_DESCRIPTION', 'TICKER'],
        rows: Array.from({ length: 12 }, (_, i) => ({
            'CUSTODIAN_NAME': 'Citibank',
            'ACCOUNT_NUMBER': `ACCT${86420 + i}`,
            'AS_OF_DATE': `2023-${12-i}-31`,
            'CUSIP': `CUSIP${24680 - i}`,
            'FEE_AMOUNT': '2.50',
            'FEE_DESCRIPTION': 'ADR CUSTODY FEE',
            'TICKER': 'RIO'
        }))
    },
    {
        name: 'Cash In Lieu of Shares',
        columns: ['CUSTODIAN_NAME', 'ACCOUNT_NUMBER', 'AS_OF_DATE', 'NARRATION', 'AMOUNT', 'REASON or COMMENT'],
        rows: Array.from({ length: 12 }, (_, i) => ({
            'CUSTODIAN_NAME': 'E*TRADE',
            'ACCOUNT_NUMBER': `ACCT${11223 + i}`,
            'AS_OF_DATE': `2023-${12-i}-20`,
            'NARRATION': 'CASH IN LIEU OF FRACTIONAL SHARES',
            'AMOUNT': `${(25.50 + i).toFixed(2)}`,
            'REASON or COMMENT': 'Post-Split Liquidation'
        }))
    },
    {
        name: 'Bank Interest',
        columns: ['CUSTODIAN_NAME', 'ACCOUNT_NUMBER', 'AS_OF_DATE', 'INTEREST_AMOUNT', 'CURRENCY'],
        rows: Array.from({ length: 12 }, (_, i) => ({
            'CUSTODIAN_NAME': 'Bank of America',
            'ACCOUNT_NUMBER': `ACCT${33445 + i}`,
            'AS_OF_DATE': `2023-${12-i}-01`,
            'INTEREST_AMOUNT': `${(12.34 + i * 0.5).toFixed(2)}`,
            'CURRENCY': 'USD'
        }))
    },
    {
        name: 'Advisory Program Fee',
        columns: ['CUSTODIAN_NAME', 'ACCOUNT_NUMBER', 'AS_OF_DATE', 'FEE_AMOUNT', 'FEE_DESCRIPTION'],
        rows: Array.from({ length: 12 }, (_, i) => ({
            'CUSTODIAN_NAME': 'Morgan Stanley',
            'ACCOUNT_NUMBER': `ACCT${55667 + i}`,
            'AS_OF_DATE': `2023-${12-i}-28`,
            'FEE_AMOUNT': `${(150.00 + i * 10).toFixed(2)}`,
            'FEE_DESCRIPTION': 'QUARTERLY ADVISORY FEE'
        }))
    }
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
