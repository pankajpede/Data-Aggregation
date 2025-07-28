
'use client';

import { useState, useMemo } from 'react';
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
import { ArrowLeft, ArrowRight, Check, ChevronRight, Download, FileUp, Loader2, Sparkles, UploadCloud, ChevronsRight, ChevronsDown } from 'lucide-react';
import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';


type ColumnConfig = {
  originalHeader: string;
  newHeader: string;
  included: boolean;
  tableId: string;
};

const STEPS = [
  { id: 1, name: 'Upload PDF' },
  { id: 2, name: 'Preview & Select' },
  { id: 3, name: 'Configure Columns' },
  { id: 4, name: 'Visualize & Export' },
];

export default function ExtractPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTableIds, setSelectedTableIds] = useState<string[]>([]);
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<string[]>([]);
  const [selectedHoldingTypes, setSelectedHoldingTypes] = useState<string[]>([]);

  const { toast } = useToast();

  const selectedTables = useMemo(() => {
    return mockExtractedData.tables.filter(t => selectedTableIds.includes(t.id)) || [];
  }, [selectedTableIds]);

  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>([]);

  const finalTables = useMemo(() => {
    return selectedTables.map(table => {
      const tableConfig = columnConfig.filter(c => c.tableId === table.id);
      const finalHeaders = tableConfig.filter(c => c.included).map(c => c.newHeader);
      
      const originalHeaderIndices = tableConfig
        .map((c, i) => (c.included ? table.headers.indexOf(c.originalHeader) : -1))
        .filter(i => i !== -1);

      const finalRows = table.rows.map(row => 
        originalHeaderIndices.map(index => row[index])
      );

      return {
        id: table.id,
        name: table.name,
        headers: finalHeaders,
        rows: finalRows
      }
    });
  }, [selectedTables, columnConfig]);

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
  
  const handleProceedToConfig = () => {
    if (selectedTables.length === 0) {
      toast({ variant: 'destructive', title: 'No tables selected', description: 'Please select at least one table to continue.' });
      return;
    }
    const initialConfig = selectedTables.flatMap(table => (
        table.headers.map(header => ({
            originalHeader: header,
            newHeader: header,
            included: true,
            tableId: table.id
        }))
    ));
    setColumnConfig(initialConfig);
    setCurrentStep(3);
  };
  
  const handleColumnConfigChange = (index: number, field: keyof ColumnConfig, value: string | boolean) => {
    const newConfig = [...columnConfig];
    (newConfig[index] as any)[field] = value;
    setColumnConfig(newConfig);
  };

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

  const exportData = (format: 'csv' | 'json', table: typeof finalTables[0]) => {
    const dataToExport = table.rows.map(row => {
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
    } else if (format === 'csv') {
      const csvRows = [
        table.headers.join(','),
        ...table.rows.map(row => row.join(','))
      ];
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
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

  const StepIndicator = () => (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {STEPS.map((step, index) => (
          <li key={step.name} className="md:flex-1">
            {currentStep > step.id ? (
              <div className="group flex w-full flex-col border-l-4 border-primary py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-primary transition-colors">{step.name}</span>
              </div>
            ) : currentStep === step.id ? (
              <div
                className="flex w-full flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current="step"
              >
                <span className="text-sm font-medium text-primary">{step.name}</span>
              </div>
            ) : (
              <div className="group flex w-full flex-col border-l-4 border-border py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-muted-foreground transition-colors">{step.name}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Upload your Document</CardTitle>
              <CardDescription>Upload a PDF file to extract tables from. Max file size: 25MB.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 p-8">
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
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
        return (
            <Card className="w-full max-w-4xl">
              <CardHeader>
                <CardTitle>Preview & Select Tables</CardTitle>
                <CardDescription>We found {mockExtractedData.tables.length} tables. Select the data you want to extract.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockExtractedData.tables.map((table: ExtractedTable) => (
                  <Collapsible key={table.id} className="rounded-lg border bg-card p-4 has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:border-primary">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id={table.id} 
                        onCheckedChange={(checked) => handleTableSelection(table.id, !!checked)} 
                        checked={selectedTableIds.includes(table.id)}
                      />
                      <CollapsibleTrigger className="flex-1">
                        <div className="flex items-center justify-between">
                            <Label htmlFor={table.id} className="text-lg font-semibold cursor-pointer">{table.name}</Label>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Expand</span>
                                <ChevronsRight className="h-4 w-4" />
                            </div>
                        </div>
                      </CollapsibleTrigger>
                    </div>
  
                    <CollapsibleContent>
                        {table.name === 'Transactions' ? (
                            <div className="p-4 mt-4 border-t">
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
                                    {type.columns.map(col => (
                                    <div key={col} className="flex items-center space-x-2">
                                        <Checkbox id={`col-${type.name}-${col}`} />
                                        <Label htmlFor={`col-${type.name}-${col}`} className="font-light text-sm">{col}</Label>
                                    </div>
                                    ))}
                                </CollapsibleContent>
                                </Collapsible>
                            ))}
                            </div>
                        ) : table.name === 'Holdings' ? (
                          <div className="p-4 mt-4 border-t">
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
                                  {type.columns.map(col => (
                                    <div key={col} className="flex items-center space-x-2">
                                      <Checkbox id={`col-${type.name}-${col}`} />
                                      <Label htmlFor={`col-${type.name}-${col}`} className="font-light text-sm">{col}</Label>
                                    </div>
                                  ))}
                                </CollapsibleContent>
                              </Collapsible>
                            ))}
                          </div>
                        ) : (
                            <div className="max-h-60 overflow-auto rounded-md border mt-4">
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
        case 3:
          if (!selectedTables) return null;
          return (
            <div className="w-full space-y-6">
            {selectedTables.map(table => (
              <Card key={table.id} className="w-full">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <CardTitle>{table.name}: Configure Columns</CardTitle>
                      <CardDescription>Select columns to include and rename them as needed.</CardDescription>
                    </div>
                    <Button onClick={() => handleAiLabel(table)} disabled={isAiLoading}>
                      {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                      AI-Label Columns
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                      <Table>
                      <TableHeader>
                          <TableRow>
                          <TableHead className="w-12">Include</TableHead>
                          <TableHead>Original Header</TableHead>
                          <TableHead>New Header</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {columnConfig.filter(c => c.tableId === table.id).map((config, index) => {
                            const originalIndex = columnConfig.findIndex(c => c.tableId === config.tableId && c.originalHeader === config.originalHeader);
                            return (
                                <TableRow key={originalIndex}>
                                    <TableCell>
                                    <Checkbox
                                        checked={config.included}
                                        onCheckedChange={(checked) => handleColumnConfigChange(originalIndex, 'included', !!checked)}
                                    />
                                    </TableCell>
                                    <TableCell className="font-medium text-muted-foreground">{config.originalHeader}</TableCell>
                                    <TableCell>
                                    <Input
                                        value={config.newHeader}
                                        onChange={(e) => handleColumnConfigChange(originalIndex, 'newHeader', e.target.value)}
                                    />
                                    </TableCell>
                                </TableRow>
                            )
                          })}
                      </TableBody>
                      </Table>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          );
      case 4:
        return (
            <div className="w-full space-y-6">
                {finalTables.map(table => (
                <Card key={table.id} className="w-full">
                    <CardHeader>
                        <CardTitle>{table.name}</CardTitle>
                        <CardDescription>Here is your finalized table. You can now export it in your desired format.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {table.headers.map(h => <TableHead key={h}>{h}</TableHead>)}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {table.rows.map((row, i) => (
                                    <TableRow key={i}>{row.map((cell, j) => <TableCell key={j}>{cell}</TableCell>)}</TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-end">
                            <Button variant="outline" onClick={() => exportData('json', table)}><Download className="mr-2 h-4 w-4" /> Export as JSON</Button>
                            <Button onClick={() => exportData('csv', table)}><Download className="mr-2 h-4 w-4" /> Export as CSV</Button>
                        </div>
                    </CardContent>
                </Card>
                ))}
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full items-center">
      <div className="w-full max-w-4xl space-y-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
        </Link>
        <StepIndicator />
        <div className="mt-8 flex justify-center">
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
        <div className="flex justify-between w-full max-w-4xl mx-auto">
          {currentStep > 1 && currentStep < 4 && (
            <Button variant="outline" onClick={() => setCurrentStep(s => s - 1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
          )}
          {currentStep === 4 && (
             <Button variant="outline" onClick={resetWizard}>
                <FileUp className="mr-2 h-4 w-4" /> Start New Extraction
            </Button>
          )}
          <div />
          {currentStep === 2 && (
            <Button onClick={handleProceedToConfig} disabled={selectedTableIds.length === 0}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {currentStep === 3 && (
             <Button onClick={() => setCurrentStep(4)}>
              Finalize & View Tables <Check className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
