
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

type MockTable = {
    name: string;
    columns: string[];
    rows: Record<string, any>[];
};

export const mockTransactionTypes: MockTable[] = [
    { 
        name: 'Dividend', 
        columns: ['CUSTODIAN_NAME', 'ACCOUNT_NUMBER', 'AS_OF_DATE', 'TRADE_DATE', 'SETTLEMENT_DATE', 'CUSIP', 'TICKER', 'TRANSACTION_CODE', 'NARRATION', 'TXN_AMOUNT', 'TXN_QUANTITY', 'TXN_PRICE', 'Total_Cost_Basis', 'Transaction_Cost', 'SEDOL', 'Accrual_Interest', 'Long_term_income_loss', 'Short_term_income_loss', 'Ticker_Cusip_Name'],
        rows: Array.from({ length: 12 }, (_, i) => ({
            'CUSTODIAN_NAME': 'Apex Clearing',
            'ACCOUNT_NUMBER': `ACCT${12345 + i}`,
            'AS_OF_DATE': `2023-10-${String(i + 1).padStart(2, '0')}`,
            'TRADE_DATE': `2023-10-${String(i + 1).padStart(2, '0')}`,
            'SETTLEMENT_DATE': `2023-10-${String(i + 2).padStart(2, '0')}`,
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
            'AS_OF_DATE': `2023-10-${String(i + 1).padStart(2, '0')}`,
            'TRADE_DATE': `2023-10-${String(i + 1).padStart(2, '0')}`,
            'SETTLEMENT_DATE': `2023-10-${String(i + 2).padStart(2, '0')}`,
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
            'AS_OF_DATE': `2023-10-${String(i + 1).padStart(2, '0')}`,
            'TRADE_DATE': `2023-10-${String(i + 1).padStart(2, '0')}`,
            'SETTLEMENT_DATE': `2023-10-${String(i + 2).padStart(2, '0')}`,
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
            'AS_OF_DATE': `2023-${String(i + 1).padStart(2, '0')}-01`,
            'NARRATION': 'INTEREST INCOME',
            'AMOUNT': `${(50 + i * 5).toFixed(2)}`,
            'TICKER': 'VMFXX'
        }))
    },
    { 
        name: 'Foreign_Dividend', 
        columns: ['CUSTODIAN_NAME', 'ACCOUNT_NUMBER', 'AS_OF_DATE', 'NARRATION', 'Foreign Withholding', 'Currency', 'Amount', 'Ticker or Security Name'],
        rows: Array.from({ length: 12 }, (_, i) => ({
            'CUSTODIAN_NAME': 'Interactive Brokers',
            'ACCOUNT_NUMBER': `ACCT${97531 + i}`,
            'AS_OF_DATE': `2023-${String(i + 1).padStart(2, '0')}-15`,
            'NARRATION': 'FOREIGN DIVIDEND',
            'Foreign Withholding': `${(15 + i * 0.5).toFixed(2)}`,
            'Currency': 'EUR',
            'Amount': `${(100 + i * 2).toFixed(2)}`,
            'Ticker or Security Name': 'SHELL PLC'
        }))
    },
    { 
        name: 'Depository_Bank_ADR_Fee', 
        columns: ['CUSTODIAN_NAME', 'ACCOUNT_NUMBER', 'AS_OF_DATE', 'CUSIP', 'FEE_AMOUNT', 'FEE_DESCRIPTION', 'TICKER'],
        rows: Array.from({ length: 12 }, (_, i) => ({
            'CUSTODIAN_NAME': 'Citibank',
            'ACCOUNT_NUMBER': `ACCT${86420 + i}`,
            'AS_OF_DATE': `2023-${String(i + 1).padStart(2, '0')}-31`,
            'CUSIP': `CUSIP${24680 - i}`,
            'FEE_AMOUNT': '2.50',
            'FEE_DESCRIPTION': 'ADR CUSTODY FEE',
            'TICKER': 'RIO'
        }))
    },
    {
        name: 'Cash_In_Lieu_of_Shares',
        columns: ['CUSTODIAN_NAME', 'ACCOUNT_NUMBER', 'AS_OF_DATE', 'NARRATION', 'AMOUNT', 'REASON or COMMENT'],
        rows: Array.from({ length: 12 }, (_, i) => ({
            'CUSTODIAN_NAME': 'E*TRADE',
            'ACCOUNT_NUMBER': `ACCT${11223 + i}`,
            'AS_OF_DATE': `2023-${String(i + 1).padStart(2, '0')}-20`,
            'NARRATION': 'CASH IN LIEU OF FRACTIONAL SHARES',
            'AMOUNT': `${(25.50 + i).toFixed(2)}`,
            'REASON or COMMENT': 'Post-Split Liquidation'
        }))
    },
    {
        name: 'Bank_Interest',
        columns: ['CUSTODIAN_NAME', 'ACCOUNT_NUMBER', 'AS_OF_DATE', 'INTEREST_AMOUNT', 'CURRENCY'],
        rows: Array.from({ length: 12 }, (_, i) => ({
            'CUSTODIAN_NAME': 'Bank of America',
            'ACCOUNT_NUMBER': `ACCT${33445 + i}`,
            'AS_OF_DATE': `2023-${String(i + 1).padStart(2, '0')}-01`,
            'INTEREST_AMOUNT': `${(12.34 + i * 0.5).toFixed(2)}`,
            'CURRENCY': 'USD'
        }))
    },
    {
        name: 'Advisory_Program_Fee',
        columns: ['CUSTODIAN_NAME', 'ACCOUNT_NUMBER', 'AS_OF_DATE', 'FEE_AMOUNT', 'FEE_DESCRIPTION'],
        rows: Array.from({ length: 12 }, (_, i) => ({
            'CUSTODIAN_NAME': 'Morgan Stanley',
            'ACCOUNT_NUMBER': `ACCT${55667 + i}`,
            'AS_OF_DATE': `2023-${String(i + 1).padStart(2, '0')}-28`,
            'FEE_AMOUNT': `${(150.00 + i * 10).toFixed(2)}`,
            'FEE_DESCRIPTION': 'QUARTERLY ADVISORY FEE'
        }))
    }
];

export const mockHoldingTypes: MockTable[] = [
    { 
        name: 'Holdings', 
        columns: ['Security ID', 'Description', 'Quantity', 'Market Value', 'Portfolio %'],
        rows: Array.from({ length: 12 }, (_, i) => {
            const tickers = ['AAPL', 'GOOGL', 'MSFT', 'NVDA', 'AMZN', 'TSLA', 'JPM', 'V', 'JNJ', 'WMT', 'PG', 'UNH'];
            const descriptions = ['Apple Inc.', 'Alphabet Inc.', 'Microsoft Corp.', 'NVIDIA Corp.', 'Amazon.com, Inc.', 'Tesla, Inc.', 'JPMorgan Chase & Co.', 'Visa Inc.', 'Johnson & Johnson', 'Walmart Inc.', 'Procter & Gamble Co.', 'UnitedHealth Group Inc.'];
            const quantity = 100 + i * 5;
            const marketValue = 15000 + i * 500;
            const portfolio = 5 + i * 0.2;
            return {
                'Security ID': tickers[i],
                'Description': descriptions[i],
                'Quantity': `${quantity}`,
                'Market Value': `${marketValue.toFixed(2)}`,
                'Portfolio %': `${portfolio.toFixed(1)}`
            }
        })
    },
];

export const getMockDataWithErrors = (mockData: MockTable[]) => {
    return mockData.map(table => {
        const newRows = table.rows.map((row, index) => {
            const newRow = { ...row };
            if (index < 4) { // Add errors to the first 4 rows
                const errorColumn = table.columns[index % table.columns.length];
                const originalValue = newRow[errorColumn];
                if (table.name === 'Holdings' && errorColumn === 'Quantity') {
                    newRow[errorColumn] = { value: 'INVALID_QNTY', error: 'Invalid data format: Expected a number.' };
                } else if (errorColumn.includes('_DATE')) {
                     newRow[errorColumn] = { value: '2023/13/45', error: 'Invalid date format.' };
                } else if (errorColumn.includes('AMOUNT') || errorColumn.includes('PRICE')) {
                     newRow[errorColumn] = { value: `ABC${originalValue}`, error: 'Invalid numeric value.' };
                } else if (errorColumn === 'TICKER') {
                     newRow[errorColumn] = { value: 12345, error: 'Invalid ticker symbol: Expected a string.' };
                } else {
                     newRow[errorColumn] = { value: originalValue, error: 'Unspecified data validation error.' };
                }
            }
            return newRow;
        });
        return { ...table, rows: newRows };
    });
};
