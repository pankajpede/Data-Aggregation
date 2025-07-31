
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { labelColumns } from '@/ai/flows/label-columns';
import { mockExtractedData, mockTransactionTypes, mockHoldingTypes } from '@/lib/mock-data';
import type { ExtractedTable } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Check, ChevronRight, Download, FileUp, Loader2, Sparkles, UploadCloud, ChevronsRight, PlusCircle, ArrowUpDown, MoreVertical, ChevronLeft, ChevronsLeft, ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


type ColumnConfig = {
  originalHeader: string;
  newHeader: string;
  included: boolean;
  tableId: string;
  options: string[];
};

const STEPS = [
  { id: 1, name: 'Upload PDF' },
  { id: 2, name: 'Data as Reported' },
  { id: 3, name: 'Map & Configure' },
  { id: 4, name: 'Analyze & Export' },
];

type SortConfig = {
    key: string;
    direction: 'ascending' | 'descending';
};

export default function ExtractPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTableIds, setSelectedTableIds] = useState<string[]>([]);
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<string[]>([]);
  const [selectedHoldingTypes, setSelectedHoldingTypes] = useState<string[]>([]);
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [editingColumnIndex, setEditingColumnIndex] = useState<number | null>(null);
  
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const [sortConfigs, setSortConfigs] = useState<Record<string, SortConfig | null>>({});
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});
  const [rowsPerPage, setRowsPerPage] = useState<Record<string, number>>({});

  const [step2SearchQueries, setStep2SearchQueries] = useState<Record<string, string>>({});
  const [step2SortConfigs, setStep2SortConfigs] = useState<Record<string, SortConfig | null>>({});
  const [step2CurrentPage, setStep2CurrentPage] = useState<Record<string, number>>({});
  const [step2RowsPerPage, setStep2RowsPerPage] = useState<Record<string, number>>({});


  const { toast } = useToast();

  const selectedTables = useMemo(() => {
    return mockExtractedData.tables.filter(t => selectedTableIds.includes(t.id)) || [];
  }, [selectedTableIds]);

  useEffect(() => {
    const initialConfig: ColumnConfig[] = [];
    mockExtractedData.tables.forEach(table => {
        const allHeaders = new Set<string>();
        
        if (table.name === 'Transactions') {
            mockTransactionTypes.forEach(type => type.columns.forEach(col => allHeaders.add(col)));
        } else if (table.name === 'Holdings') {
            mockHoldingTypes.forEach(type => type.columns.forEach(col => allHeaders.add(col)));
        } else {
            table.headers.forEach(header => allHeaders.add(header));
        }

        allHeaders.forEach(header => {
            if (!initialConfig.some(c => c.tableId === table.id && c.originalHeader === header)) {
                initialConfig.push({
                    originalHeader: header,
                    newHeader: header,
                    included: true,
                    tableId: table.id,
                    options: [header]
                });
            }
        });
    });
    setColumnConfig(initialConfig);
  }, []);

  const finalTables = useMemo(() => {
    const tables: (ExtractedTable & { parent: string })[] = [];
    selectedTables.forEach(table => {
      const tableConfig = columnConfig.filter(c => c.tableId === table.id);

      if (table.name === 'Transactions') {
        selectedTransactionTypes.forEach(txnType => {
          const typeInfo = mockTransactionTypes.find(t => t.name === txnType)!;
          const includedHeaders = typeInfo.columns.filter(col => {
            const config = tableConfig.find(c => c.originalHeader === col);
            return config?.included;
          });

          if (includedHeaders.length > 0) {
            const finalHeaders = includedHeaders.map(originalHeader => {
              return tableConfig.find(c => c.originalHeader === originalHeader)!.newHeader;
            });

            // Use specific mock rows for each subtype
            const finalRows = typeInfo.rows.map(rowObj => 
                includedHeaders.map(header => rowObj[header] ?? '')
            );
            
            tables.push({
              id: `${table.id}-${txnType}`,
              name: txnType,
              parent: table.name,
              headers: finalHeaders,
              rows: finalRows
            });
          }
        });
      } else if (table.name === 'Holdings') {
         selectedHoldingTypes.forEach(holdingType => {
          const typeInfo = mockHoldingTypes.find(t => t.name === holdingType)!;
          const includedHeaders = typeInfo.columns.filter(col => {
            const config = tableConfig.find(c => c.originalHeader === col);
            return config?.included;
          });

           if (includedHeaders.length > 0) {
            const finalHeaders = includedHeaders.map(originalHeader => {
              return tableConfig.find(c => c.originalHeader === originalHeader)!.newHeader;
            });
            const finalRows = typeInfo.rows.map(rowObj =>
              includedHeaders.map(header => rowObj[header] ?? '')
            );
             tables.push({
              id: `${table.id}-${holdingType}`,
              name: holdingType,
              parent: table.name,
              headers: finalHeaders,
              rows: finalRows
            });
          }
        });
      } else {
        const includedHeaders = table.headers.filter(header => {
          const config = tableConfig.find(c => c.originalHeader === header);
          return config?.included;
        });

        if(includedHeaders.length > 0) {
           const finalHeaders = includedHeaders.map(originalHeader => {
              return tableConfig.find(c => c.originalHeader === originalHeader)!.newHeader;
            });
           const finalRows = table.rows.map(row =>
              includedHeaders.map(header => {
                const originalIndex = table.headers.indexOf(header);
                return row[originalIndex] ?? '';
              })
            );
          tables.push({ ...table, parent: 'General', headers: finalHeaders, rows: finalRows });
        }
      }
    });
    return tables;
  }, [selectedTables, columnConfig, selectedTransactionTypes, selectedHoldingTypes]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({ variant: 'destructive', title: 'No file selected', description: 'Please choose a PDF file to upload.' });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setCurrentStep(2);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleProceedToFinalStep = () => {
    if (selectedTables.length === 0) {
      toast({ variant: 'destructive', title: 'No tables selected', description: 'Please select at least one table to continue.' });
      return;
    }
    setCurrentStep(4);
  };
  
  const handleProceedToMap = () => {
      setCurrentStep(3);
  };

  const handleColumnConfigChange = (index: number, field: keyof ColumnConfig, value: string | boolean) => {
    const newConfig = [...columnConfig];
    if (newConfig[index]) {
        (newConfig[index] as any)[field] = value;
        setColumnConfig(newConfig);
    }
  };
  
  const handleColumnRename = (index: number, value: string) => {
    if (value === 'add_new') {
        setEditingColumnIndex(index);
        setIsModalOpen(true);
    } else {
        handleColumnConfigChange(index, 'newHeader', value);
    }
  };

  const handleAddNewColumnName = () => {
      if (editingColumnIndex === null || !newColumnName) return;
      const newConfig = [...columnConfig];
      const currentOptions = newConfig[editingColumnIndex].options;
      if(!currentOptions.includes(newColumnName)) {
        newConfig[editingColumnIndex].options = [...currentOptions, newColumnName];
      }
      newConfig[editingColumnIndex].newHeader = newColumnName;
      setColumnConfig(newConfig);
      toast({ title: "Success", description: "New column name added successfully." });
      setIsModalOpen(false);
      setNewColumnName('');
      setEditingColumnIndex(null);
  }

  const handleAiLabel = async (table: ExtractedTable) => {
    setIsAiLoading(true);
    try {
      const tableDataString = [table.headers.join(','), ...table.rows.map(row => row.join(','))].join('\n');
      const result = await labelColumns({
        tableData: tableDataString,
        columnHeaders: table.headers,
      });
      
      setColumnConfig(prevConfig => {
        const newConfig = [...prevConfig];
        result.columnLabels.forEach((label, index) => {
          const configIndex = newConfig.findIndex(c => c.tableId === table.id && c.originalHeader === table.headers[index]);
          if(configIndex > -1) {
            newConfig[configIndex].newHeader = label;
          }
        });
        return newConfig;
      });

      toast({ title: 'Success', description: `AI successfully suggested new labels for ${table.name}.` });
    } catch (error) {
      toast({ variant: 'destructive', title: 'AI Labeling Failed', description: 'Could not generate labels. Please try again.' });
    } finally {
      setIsAiLoading(false);
    }
  };

  const exportData = (format: 'csv' | 'json' | 'excel', table: {name: string, headers: string[], rows: (string[] | Record<string,string>)[]}) => {
    
    const rowsAsArrays = table.rows.map(row => {
        if (Array.isArray(row)) return row;
        return table.headers.map(header => row[header] ?? '');
    });

    const dataToExport = rowsAsArrays.map(row => {
      let obj: {[key: string]: string} = {};
      table.headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });

    const filename = `${table.name.replace(/\s+/g, '_').toLowerCase()}_exported_data`;

    if (format === 'json') {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataToExport, null, 2))}`;
      const link = document.createElement('a');
      link.href = jsonString;
      link.download = `${filename}.json`;
      link.click();
    } else if (format === 'csv' || format === 'excel') {
      const csvRows = [
        table.headers.join(','),
        ...rowsAsArrays.map(row => row.join(','))
      ];
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.${format === 'excel' ? 'xls' : 'csv'}`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setSelectedFile(null);
    setSelectedTableIds([]);
    setColumnConfig([]);
    setSelectedTransactionTypes([]);
    setSelectedHoldingTypes([]);
  }

  const handleTableSelection = (tableId: string, checked: boolean) => {
    setSelectedTableIds(prev => {
        if(checked) {
            return [...prev, tableId];
        } else {
            return prev.filter(id => id !== tableId);
        }
    })
  }

  const handleTransactionTypeSelection = (typeName: string, checked: boolean) => {
    setSelectedTransactionTypes(prev => {
      if (checked) {
        return [...prev, typeName];
      } else {
        return prev.filter(name => name !== typeName);
      }
    });
  };

  const handleHoldingTypeSelection = (typeName: string, checked: boolean) => {
    setSelectedHoldingTypes(prev => {
      if (checked) {
        return [...prev, typeName];
      } else {
        return prev.filter(name => name !== typeName);
      }
    });
  };

  const handleSearchChange = (tableId: string, query: string) => {
    setSearchQueries(prev => ({...prev, [tableId]: query}));
    setCurrentPage(prev => ({ ...prev, [tableId]: 1 }));
  };

  const handleSort = (tableId: string, key: string) => {
    setSortConfigs(prev => {
        const currentSort = prev[tableId];
        let direction: 'ascending' | 'descending' = 'ascending';
        if(currentSort && currentSort.key === key && currentSort.direction === 'ascending') {
            direction = 'descending';
        }
        return { ...prev, [tableId]: { key, direction } };
    });
  };

  const getPaginatedAndSortedData = useCallback((table: typeof finalTables[0]) => {
    const rpp = rowsPerPage[table.id] || 5;
    const query = searchQueries[table.id] || '';
    const sortConfig = sortConfigs[table.id];
    const page = currentPage[table.id] || 1;

    let filteredRows = table.rows as string[][];

    if (query) {
      filteredRows = (table.rows as string[][]).filter(row =>
        row.some(cell => cell.toLowerCase().includes(query.toLowerCase()))
      );
    }

    if (sortConfig) {
      const headerIndex = table.headers.indexOf(sortConfig.key);
      if(headerIndex > -1) {
        filteredRows.sort((a, b) => {
          if (a[headerIndex] < b[headerIndex]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[headerIndex] > b[headerIndex]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        });
      }
    }
    
    const totalPages = Math.ceil(filteredRows.length / rpp);
    const paginatedRows = filteredRows.slice((page - 1) * rpp, page * rpp);
    
    return { paginatedRows, totalPages, totalRows: filteredRows.length };
  }, [searchQueries, sortConfigs, currentPage, rowsPerPage]);

  const getStep2PaginatedAndSortedData = useCallback((table: {name: string, columns: string[], rows: Record<string, string>[]}) => {
    const tableId = table.name;
    const rpp = step2RowsPerPage[tableId] || 5;
    const query = step2SearchQueries[tableId] || '';
    const sortConfig = step2SortConfigs[tableId];
    const page = step2CurrentPage[tableId] || 1;

    let filteredRows = table.rows;

    if (query) {
        filteredRows = table.rows.filter(row =>
            Object.values(row).some(cell => String(cell).toLowerCase().includes(query.toLowerCase()))
        );
    }

    if (sortConfig) {
        filteredRows.sort((a, b) => {
            const valA = a[sortConfig.key];
            const valB = b[sortConfig.key];
            if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
    }

    const totalPages = Math.ceil(filteredRows.length / rpp);
    const paginatedRows = filteredRows.slice((page - 1) * rpp, page * rpp);

    return { paginatedRows, totalPages, totalRows: filteredRows.length };
  }, [step2SearchQueries, step2SortConfigs, step2CurrentPage, step2RowsPerPage]);


  const StepIndicator = () => (
    <div className="flex">
      <div className="p-1 rounded-lg bg-muted flex items-center gap-2">
        {STEPS.map((step) => (
          <button
            key={step.id}
            onClick={() => currentStep > step.id && setCurrentStep(step.id)}
            disabled={currentStep < step.id}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${currentStep === step.id ? 'bg-background text-foreground shadow-sm' : ''}
              ${currentStep > step.id ? 'text-muted-foreground hover:bg-background/50' : 'text-muted-foreground/50 cursor-not-allowed'}
            `}
          >
            {step.name}
          </button>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Upload your Document</CardTitle>
              <CardDescription>Upload a PDF file to extract tables from. Max file size: 25MB.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent/50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">{selectedFile ? selectedFile.name : 'PDF (MAX. 25MB)'}</p>
                        </div>
                        <Input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf" />
                    </label>
                </div> 
              <Button onClick={handleUpload} disabled={isLoading || !selectedFile} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
                {isLoading ? 'Processing...' : 'Upload & Extract'}
              </Button>
            </CardContent>
          </Card>
        );
    case 2:
      const holdingsData = mockHoldingTypes[0];
      return (
        <div className="w-full max-w-6xl">
            <Tabs defaultValue="transaction">
            <TabsList>
                <TabsTrigger value="transaction">Transactions</TabsTrigger>
                <TabsTrigger value="holding">Holdings</TabsTrigger>
            </TabsList>
            <TabsContent value="transaction" className="space-y-4">
                {mockTransactionTypes.map(transactionType => {
                    const { paginatedRows, totalPages, totalRows } = getStep2PaginatedAndSortedData(transactionType);
                    const page = step2CurrentPage[transactionType.name] || 1;
                    const rpp = step2RowsPerPage[transactionType.name] || 5;

                    const renderPageNumbers = () => {
                        const pageNumbers = [];
                        const maxPagesToShow = 5;
                        let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
                        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
                        if(endPage - startPage + 1 < maxPagesToShow) {
                            startPage = Math.max(1, endPage - maxPagesToShow + 1);
                        }
                        for (let i = startPage; i <= endPage; i++) {
                            pageNumbers.push(
                                <Button key={i} variant={i === page ? 'default' : 'ghost'} size="icon" onClick={() => setStep2CurrentPage(prev => ({...prev, [transactionType.name]: i}))} className="h-8 w-8">{i}</Button>
                            );
                        }
                        return pageNumbers;
                    };

                    return (
                    <Card key={transactionType.name}>
                        <CardHeader>
                            <CardTitle>{transactionType.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between py-2">
                                <Input 
                                    placeholder="Search table..."
                                    value={step2SearchQueries[transactionType.name] || ''}
                                    onChange={(e) => {
                                        setStep2SearchQueries(prev => ({...prev, [transactionType.name]: e.target.value}));
                                        setStep2CurrentPage(prev => ({ ...prev, [transactionType.name]: 1 }));
                                    }}
                                    className="max-w-sm h-9"
                                />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /><span className="sr-only">Export options</span></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onSelect={() => exportData('json', {name: transactionType.name, headers: transactionType.columns, rows: transactionType.rows})}>JSON</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => exportData('csv', {name: transactionType.name, headers: transactionType.columns, rows: transactionType.rows})}>CSV</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => exportData('excel', {name: transactionType.name, headers: transactionType.columns, rows: transactionType.rows})}>Excel</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="overflow-x-auto rounded-md border">
                                <Table>
                                <TableHeader>
                                    <TableRow>
                                    {transactionType.columns.map(h => 
                                        <TableHead key={h}>
                                            <Button variant="ghost" onClick={() => setStep2SortConfigs(prev => ({...prev, [transactionType.name]: {key: h, direction: prev[transactionType.name]?.direction === 'ascending' ? 'descending' : 'ascending'}}))} className="px-0 h-auto hover:bg-transparent text-xs">
                                                {h}
                                                <ArrowUpDown className="ml-2 h-3 w-3" />
                                            </Button>
                                        </TableHead>
                                    )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedRows.map((row, i) => (
                                    <TableRow key={i}>
                                        {transactionType.columns.map(col => <TableCell key={col} className="py-2 px-3 text-xs">{row[col]}</TableCell>)}
                                    </TableRow>
                                    ))}
                                </TableBody>
                                </Table>
                            </div>
                            <div className="flex items-center justify-between space-x-2 py-2 text-sm text-muted-foreground">
                                <div><span className="font-medium text-xs">{((page - 1) * rpp) + 1}-{Math.min(page * rpp, totalRows)}</span> of <span className="font-medium text-xs">{totalRows}</span> rows</div>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs">Rows per page</span>
                                    <Select value={String(rpp)} onValueChange={(value) => { setStep2RowsPerPage(prev => ({...prev, [transactionType.name]: Number(value)})); setStep2CurrentPage(prev => ({...prev, [transactionType.name]: 1})); }}>
                                        <SelectTrigger className="h-7 w-14 text-xs"><SelectValue placeholder={rpp} /></SelectTrigger>
                                        <SelectContent>{[5, 10, 20, 50].map(val => (<SelectItem key={val} value={String(val)} className="text-xs">{val}</SelectItem>))}</SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Button variant="outline" size="icon" onClick={() => setStep2CurrentPage(prev => ({...prev, [transactionType.name]: 1}))} disabled={page <= 1} className="h-7 w-7"><ChevronsLeft className="h-4 w-4" /><span className="sr-only">First page</span></Button>
                                    <Button variant="outline" size="icon" onClick={() => setStep2CurrentPage(prev => ({...prev, [transactionType.name]: page - 1}))} disabled={page <= 1} className="h-7 w-7"><ChevronLeft className="h-4 w-4" /><span className="sr-only">Previous page</span></Button>
                                    {renderPageNumbers()}
                                    <Button variant="outline" size="icon" onClick={() => setStep2CurrentPage(prev => ({...prev, [transactionType.name]: page + 1}))} disabled={page >= totalPages} className="h-7 w-7"><ChevronRight className="h-4 w-4" /><span className="sr-only">Next page</span></Button>
                                    <Button variant="outline" size="icon" onClick={() => setStep2CurrentPage(prev => ({...prev, [transactionType.name]: totalPages}))} disabled={page >= totalPages} className="h-7 w-7"><ChevronsRight className="h-4 w-4" /><span className="sr-only">Last page</span></Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )})}
            </TabsContent>
            <TabsContent value="holding">
                {(() => {
                    const { paginatedRows, totalPages, totalRows } = getStep2PaginatedAndSortedData(holdingsData);
                    const page = step2CurrentPage[holdingsData.name] || 1;
                    const rpp = step2RowsPerPage[holdingsData.name] || 5;

                    const renderPageNumbers = () => {
                        const pageNumbers = [];
                        const maxPagesToShow = 5;
                        let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
                        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
                        if(endPage - startPage + 1 < maxPagesToShow) {
                            startPage = Math.max(1, endPage - maxPagesToShow + 1);
                        }
                        for (let i = startPage; i <= endPage; i++) {
                            pageNumbers.push(
                                <Button key={i} variant={i === page ? 'default' : 'ghost'} size="icon" onClick={() => setStep2CurrentPage(prev => ({...prev, [holdingsData.name]: i}))} className="h-8 w-8">{i}</Button>
                            );
                        }
                        return pageNumbers;
                    };
                    return (
                        <Card>
                        <CardHeader><CardTitle>Holdings</CardTitle></CardHeader>
                        <CardContent>
                             <div className="flex items-center justify-between py-2">
                                <Input 
                                    placeholder="Search table..."
                                    value={step2SearchQueries[holdingsData.name] || ''}
                                    onChange={(e) => {
                                        setStep2SearchQueries(prev => ({...prev, [holdingsData.name]: e.target.value}));
                                        setStep2CurrentPage(prev => ({ ...prev, [holdingsData.name]: 1 }));
                                    }}
                                    className="max-w-sm h-9"
                                />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /><span className="sr-only">Export options</span></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onSelect={() => exportData('json', {name: holdingsData.name, headers: holdingsData.columns, rows: holdingsData.rows})}>JSON</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => exportData('csv', {name: holdingsData.name, headers: holdingsData.columns, rows: holdingsData.rows})}>CSV</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => exportData('excel', {name: holdingsData.name, headers: holdingsData.columns, rows: holdingsData.rows})}>Excel</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="overflow-x-auto rounded-md border">
                                <Table>
                                <TableHeader>
                                    <TableRow>
                                    {holdingsData.columns.map(h => 
                                        <TableHead key={h}>
                                             <Button variant="ghost" onClick={() => setStep2SortConfigs(prev => ({...prev, [holdingsData.name]: {key: h, direction: prev[holdingsData.name]?.direction === 'ascending' ? 'descending' : 'ascending'}}))} className="px-0 h-auto hover:bg-transparent text-xs">
                                                {h}
                                                <ArrowUpDown className="ml-2 h-3 w-3" />
                                            </Button>
                                        </TableHead>
                                    )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedRows.map((row, i) => (
                                    <TableRow key={i}>
                                        {holdingsData.columns.map(col => <TableCell key={col} className="py-2 px-3 text-xs">{row[col]}</TableCell>)}
                                    </TableRow>
                                    ))}
                                </TableBody>
                                </Table>
                            </div>
                             <div className="flex items-center justify-between space-x-2 py-2 text-sm text-muted-foreground">
                                <div><span className="font-medium text-xs">{((page - 1) * rpp) + 1}-{Math.min(page * rpp, totalRows)}</span> of <span className="font-medium text-xs">{totalRows}</span> rows</div>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs">Rows per page</span>
                                    <Select value={String(rpp)} onValueChange={(value) => { setStep2RowsPerPage(prev => ({...prev, [holdingsData.name]: Number(value)})); setStep2CurrentPage(prev => ({...prev, [holdingsData.name]: 1})); }}>
                                        <SelectTrigger className="h-7 w-14 text-xs"><SelectValue placeholder={rpp} /></SelectTrigger>
                                        <SelectContent>{[5, 10, 20, 50].map(val => (<SelectItem key={val} value={String(val)} className="text-xs">{val}</SelectItem>))}</SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Button variant="outline" size="icon" onClick={() => setStep2CurrentPage(prev => ({...prev, [holdingsData.name]: 1}))} disabled={page <= 1} className="h-7 w-7"><ChevronsLeft className="h-4 w-4" /><span className="sr-only">First page</span></Button>
                                    <Button variant="outline" size="icon" onClick={() => setStep2CurrentPage(prev => ({...prev, [holdingsData.name]: page - 1}))} disabled={page <= 1} className="h-7 w-7"><ChevronLeft className="h-4 w-4" /><span className="sr-only">Previous page</span></Button>
                                    {renderPageNumbers()}
                                    <Button variant="outline" size="icon" onClick={() => setStep2CurrentPage(prev => ({...prev, [holdingsData.name]: page + 1}))} disabled={page >= totalPages} className="h-7 w-7"><ChevronRight className="h-4 w-4" /><span className="sr-only">Next page</span></Button>
                                    <Button variant="outline" size="icon" onClick={() => setStep2CurrentPage(prev => ({...prev, [holdingsData.name]: totalPages}))} disabled={page >= totalPages} className="h-7 w-7"><ChevronsRight className="h-4 w-4" /><span className="sr-only">Last page</span></Button>
                                </div>
                            </div>
                        </CardContent>
                        </Card>
                    )
                })()}
            </TabsContent>
            </Tabs>
        </div>
    );
      case 3:
        return (
            <Card className="w-full max-w-4xl">
              <CardHeader>
                <CardTitle className="text-lg">Map & Configure</CardTitle>
                <CardDescription>We found {mockExtractedData.tables.length} tables. Select the data you want to extract and configure the columns.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockExtractedData.tables.map((table: ExtractedTable) => (
                  <Collapsible key={table.id} className="rounded-lg border bg-card p-3 has-[[data-state=checked]]:bg-accent/20 has-[[data-state=checked]]:border-primary/50">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id={table.id} 
                        onCheckedChange={(checked) => handleTableSelection(table.id, !!checked)} 
                        checked={selectedTableIds.includes(table.id)}
                      />
                      <CollapsibleTrigger className="flex-1">
                        <div className="flex items-center justify-between">
                            <Label htmlFor={table.id} className="text-base font-semibold cursor-pointer">{table.name}</Label>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Expand</span>
                                <ChevronsRight className="h-4 w-4" />
                            </div>
                        </div>
                      </CollapsibleTrigger>
                    </div>
  
                    <CollapsibleContent>
                        {table.name === 'Transactions' ? (
                            <div className="p-4 mt-3 border-t">
                            {mockTransactionTypes.map(type => (
                                <Collapsible key={type.name} className="py-2">
                                <div className="flex items-center space-x-3">
                                    <Checkbox 
                                        id={`txn-${type.name}`} 
                                        onCheckedChange={(checked) => handleTransactionTypeSelection(type.name, !!checked)}
                                        checked={selectedTransactionTypes.includes(type.name)}
                                    />
                                    <CollapsibleTrigger className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor={`txn-${type.name}`} className="font-normal cursor-pointer">{type.name}</Label>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>View Columns</span>
                                                <ChevronRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent className="pl-8 mt-2 space-y-2">
                                    {type.columns.map((col) => {
                                        const configIndex = columnConfig.findIndex(c => c.tableId === table.id && c.originalHeader === col);
                                        const config = configIndex !== -1 ? columnConfig[configIndex] : null;

                                        return (
                                        <div key={col} className="grid grid-cols-2 items-center gap-4 py-1">
                                            <div className='flex items-center gap-2'>
                                                <Checkbox 
                                                    id={`col-${type.name}-${col}`} 
                                                    checked={!!config?.included}
                                                    onCheckedChange={(checked) => {
                                                        if (configIndex > -1) {
                                                            handleColumnConfigChange(configIndex, 'included', !!checked)
                                                        }
                                                    }}
                                                />
                                                <Label htmlFor={`col-${type.name}-${col}`} className="font-light text-sm">{col}</Label>
                                            </div>
                                            {config && (
                                                <Select value={config.newHeader} onValueChange={(value) => handleColumnRename(configIndex, value)}>
                                                    <SelectTrigger className="h-8">
                                                        <SelectValue placeholder="Select a name" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {config.options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                                        <SelectItem value="add_new">
                                                          <div className="flex items-center gap-2">
                                                            <PlusCircle className="h-4 w-4" />
                                                            <span>Add New...</span>
                                                          </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>
                                        )
                                    })}
                                </CollapsibleContent>
                                </Collapsible>
                            ))}
                            </div>
                        ) : table.name === 'Holdings' ? (
                          <div className="p-4 mt-3 border-t">
                            {mockHoldingTypes.map(type => (
                              <Collapsible key={type.name} className="py-2">
                                <div className="flex items-center space-x-3">
                                  <Checkbox
                                    id={`holding-${type.name}`}
                                    onCheckedChange={(checked) => handleHoldingTypeSelection(type.name, !!checked)}
                                    checked={selectedHoldingTypes.includes(type.name)}
                                  />
                                  <CollapsibleTrigger className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <Label htmlFor={`holding-${type.name}`} className="font-normal cursor-pointer">{type.name}</Label>
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>View Columns</span>
                                        <ChevronRight className="h-4 w-4" />
                                      </div>
                                    </div>
                                  </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent className="pl-8 mt-2 space-y-2">
                                  {type.columns.map(col => {
                                    const configIndex = columnConfig.findIndex(c => c.tableId === table.id && c.originalHeader === col);
                                    const config = configIndex !== -1 ? columnConfig[configIndex] : null;
                                    
                                    return (
                                      <div key={col} className="grid grid-cols-2 items-center gap-4 py-1">
                                        <div className='flex items-center gap-2'>
                                          <Checkbox 
                                            id={`col-holding-${type.name}-${col}`} 
                                            checked={!!config?.included}
                                            onCheckedChange={(checked) => {
                                                if (configIndex > -1) {
                                                    handleColumnConfigChange(configIndex, 'included', !!checked)
                                                }
                                            }}
                                          />
                                          <Label htmlFor={`col-holding-${type.name}-${col}`} className="font-light text-sm">{col}</Label>
                                        </div>
                                        {config && (
                                            <Select value={config.newHeader} onValueChange={(value) => handleColumnRename(configIndex, value)}>
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="Select a name" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {config.options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                                    <SelectItem value="add_new">
                                                      <div className="flex items-center gap-2">
                                                        <PlusCircle className="h-4 w-4" />
                                                        <span>Add New...</span>
                                                      </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                      </div>
                                    )
                                  })}
                                </CollapsibleContent>
                              </Collapsible>
                            ))}
                          </div>
                        ) : (
                            <div className="max-h-60 overflow-auto rounded-md border mt-3">
                            <Table>
                                <TableHeader>
                                <TableRow>
                                    {table.headers.map((h, i) => <TableHead key={i}>{h}</TableHead>)}
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {table.rows.slice(0, 3).map((row, i) => (
                                    <TableRow key={i}>
                                    {row.map((cell, j) => <TableCell key={j}>{cell}</TableCell>)}
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            </div>
                        )}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CardContent>
            </Card>
          );
      case 4:
        const groupedTables = finalTables.reduce((acc, table) => {
            if (!acc[table.parent]) {
                acc[table.parent] = [];
            }
            acc[table.parent].push(table);
            return acc;
        }, {} as Record<string, typeof finalTables>);
        
        const tabList = Object.keys(groupedTables);

        return (
            <div className="w-full max-w-6xl">
               <Tabs defaultValue={tabList.length > 0 ? tabList[0] : ''}>
                <TabsList>
                  {tabList.map(parentName => (
                    <TabsTrigger key={parentName} value={parentName}>
                      {parentName}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {Object.entries(groupedTables).map(([parentName, tables]) => (
                  <TabsContent key={parentName} value={parentName} className="space-y-4">
                    {tables.map(table => {
                      const { paginatedRows, totalPages, totalRows } = getPaginatedAndSortedData(table);
                      const page = currentPage[table.id] || 1;
                      const rpp = rowsPerPage[table.id] || 5;

                      const renderPageNumbers = () => {
                        const pageNumbers = [];
                        const maxPagesToShow = 5;
                        let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
                        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
                        if(endPage - startPage + 1 < maxPagesToShow) {
                          startPage = Math.max(1, endPage - maxPagesToShow + 1);
                        }

                        for (let i = startPage; i <= endPage; i++) {
                          pageNumbers.push(
                            <Button
                              key={i}
                              variant={i === page ? 'default' : 'ghost'}
                              size="icon"
                              onClick={() => setCurrentPage(prev => ({...prev, [table.id]: i}))}
                              className="h-8 w-8"
                            >
                              {i}
                            </Button>
                          );
                        }
                        return pageNumbers;
                      };

                      return(
                      <Card key={table.id}>
                        <CardHeader>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <CardTitle className="text-lg">{table.name}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                           <div className="flex items-center justify-between py-2">
                                <Input 
                                    placeholder="Search table..."
                                    value={searchQueries[table.id] || ''}
                                    onChange={(e) => handleSearchChange(table.id, e.target.value)}
                                    className="max-w-sm h-9"
                                />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <MoreVertical className="h-4 w-4" />
                                            <span className="sr-only">Export options</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onSelect={() => exportData('json', table)}>
                                            JSON
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => exportData('csv', table)}>
                                            CSV
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => exportData('excel', table)}>
                                            Excel
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                          <div className="overflow-x-auto rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  {table.headers.map(h => (
                                    <TableHead key={h}>
                                      <Button variant="ghost" onClick={() => handleSort(table.id, h)} className="px-0 h-auto hover:bg-transparent text-xs">
                                        {h}
                                        <ArrowUpDown className="ml-2 h-3 w-3" />
                                      </Button>
                                    </TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {paginatedRows.map((row, i) => (
                                  <TableRow key={i}>
                                    {row.map((cell, j) => (
                                      <TableCell key={j} className="py-2 px-3 text-xs">{cell}</TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                            <div className="flex items-center justify-between space-x-2 py-2 text-sm text-muted-foreground">
                                <div>
                                    <span className="font-medium text-xs">{((page - 1) * rpp) + 1}-{Math.min(page * rpp, totalRows)}</span> of <span className="font-medium text-xs">{totalRows}</span> rows
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs">Rows per page</span>
                                  <Select
                                      value={String(rpp)}
                                      onValueChange={(value) => {
                                          setRowsPerPage(prev => ({...prev, [table.id]: Number(value)}));
                                          setCurrentPage(prev => ({...prev, [table.id]: 1}));
                                      }}
                                  >
                                      <SelectTrigger className="h-7 w-14 text-xs">
                                          <SelectValue placeholder={rpp} />
                                      </SelectTrigger>
                                      <SelectContent>
                                          {[5, 10, 20, 50].map(val => (
                                              <SelectItem key={val} value={String(val)} className="text-xs">{val}</SelectItem>
                                          ))}
                                      </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => setCurrentPage(prev => ({...prev, [table.id]: 1}))}
                                      disabled={page <= 1}
                                      className="h-7 w-7"
                                    >
                                      <ChevronsLeft className="h-4 w-4" />
                                      <span className="sr-only">First page</span>
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => setCurrentPage(prev => ({...prev, [table.id]: page - 1}))}
                                      disabled={page <= 1}
                                      className="h-7 w-7"
                                    >
                                      <ChevronLeft className="h-4 w-4" />
                                      <span className="sr-only">Previous page</span>
                                    </Button>
                                    {renderPageNumbers()}
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => setCurrentPage(prev => ({...prev, [table.id]: page + 1}))}
                                      disabled={page >= totalPages}
                                      className="h-7 w-7"
                                    >
                                      <ChevronRight className="h-4 w-4" />
                                      <span className="sr-only">Next page</span>
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => setCurrentPage(prev => ({...prev, [table.id]: totalPages}))}
                                      disabled={page >= totalPages}
                                      className="h-7 w-7"
                                    >
                                      <ChevronsRight className="h-4 w-4" />
                                      <span className="sr-only">Last page</span>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                      </Card>
                    )})}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full items-center p-4 sm:p-6">
      <div className="w-full max-w-6xl space-y-4">
        <div className="flex justify-between items-center">
            <StepIndicator />
             <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/">
                    <Button variant="ghost" size="icon" aria-label="Back to Dashboard">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Back to Dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
        </div>
        <div className="mt-4 flex justify-center">
           <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-between w-full max-w-6xl mx-auto">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={() => setCurrentStep(s => s - 1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
          ) : <div />}
          {currentStep === 4 && (
             <Button variant="outline" onClick={resetWizard}>
                <FileUp className="mr-2 h-4 w-4" /> Start New Extraction
            </Button>
          )}
          {currentStep === 2 && (
            <Button onClick={handleProceedToMap}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {currentStep === 3 && (
            <Button onClick={handleProceedToFinalStep} disabled={selectedTableIds.length === 0}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add New Column Name</DialogTitle>
                <DialogDescription>
                    Enter a new name for the column. This will be added to the list of available options.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <Input 
                    id="new-column-name"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    placeholder="e.g. Transaction Amount (EUR)"
                />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleAddNewColumnName}>Save</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
