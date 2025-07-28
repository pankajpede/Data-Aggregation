'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { labelColumns } from '@/ai/flows/label-columns';
import { mockExtractedData } from '@/lib/mock-data';
import type { ExtractedTable } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Check, ChevronRight, Download, FileUp, Loader2, Sparkles, UploadCloud } from 'lucide-react';
import Link from 'next/link';

type ColumnConfig = {
  originalHeader: string;
  newHeader: string;
  included: boolean;
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
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>([]);

  const { toast } = useToast();

  const selectedTable = useMemo(() => {
    return mockExtractedData.tables.find(t => t.id === selectedTableId) || null;
  }, [selectedTableId]);

  const finalTableHeaders = useMemo(() => {
    return columnConfig.filter(c => c.included).map(c => c.newHeader);
  }, [columnConfig]);

  const finalTableRows = useMemo(() => {
    if (!selectedTable) return [];
    const includedIndices = columnConfig
      .map((c, i) => (c.included ? i : -1))
      .filter(i => i !== -1);
    
    return selectedTable.rows.map(row => 
      includedIndices.map(index => row[index])
    );
  }, [selectedTable, columnConfig]);

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
      setSelectedTableId(mockExtractedData.tables[0].id);
      setCurrentStep(2);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleSelectTable = () => {
    if (!selectedTable) {
      toast({ variant: 'destructive', title: 'No table selected', description: 'Please select a table to continue.' });
      return;
    }
    const initialConfig = selectedTable.headers.map(header => ({
      originalHeader: header,
      newHeader: header,
      included: true,
    }));
    setColumnConfig(initialConfig);
    setCurrentStep(3);
  };
  
  const handleColumnConfigChange = (index: number, field: keyof ColumnConfig, value: string | boolean) => {
    const newConfig = [...columnConfig];
    (newConfig[index] as any)[field] = value;
    setColumnConfig(newConfig);
  };

  const handleAiLabel = async () => {
    if (!selectedTable) return;
    setIsAiLoading(true);
    try {
      const tableDataString = [selectedTable.headers.join(','), ...selectedTable.rows.map(row => row.join(','))].join('\n');
      const result = await labelColumns({
        tableData: tableDataString,
        columnHeaders: selectedTable.headers,
      });
      const newConfig = [...columnConfig];
      result.columnLabels.forEach((label, index) => {
        if(newConfig[index]) {
          newConfig[index].newHeader = label;
        }
      });
      setColumnConfig(newConfig);
      toast({ title: 'Success', description: 'AI successfully suggested new column labels.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'AI Labeling Failed', description: 'Could not generate labels. Please try again.' });
    } finally {
      setIsAiLoading(false);
    }
  };

  const exportData = (format: 'csv' | 'json') => {
    const dataToExport = finalTableRows.map(row => {
      let obj: {[key: string]: string} = {};
      finalTableHeaders.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });

    if (format === 'json') {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataToExport, null, 2))}`;
      const link = document.createElement('a');
      link.href = jsonString;
      link.download = 'exported_data.json';
      link.click();
    } else if (format === 'csv') {
      const csvRows = [
        finalTableHeaders.join(','),
        ...finalTableRows.map(row => row.join(','))
      ];
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'exported_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setSelectedFile(null);
    setSelectedTableId(null);
    setColumnConfig([]);
  }

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
              <CardTitle>Preview & Select Table</CardTitle>
              <CardDescription>We found {mockExtractedData.tables.length} tables in your document. Select one to proceed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={selectedTableId || ''} onValueChange={setSelectedTableId} className="space-y-4">
                {mockExtractedData.tables.map((table: ExtractedTable) => (
                  <div key={table.id} className="rounded-lg border bg-card p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <RadioGroupItem value={table.id} id={table.id} />
                      <Label htmlFor={table.id} className="text-lg font-semibold">{table.name}</Label>
                    </div>
                    <div className="max-h-60 overflow-auto rounded-md border">
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
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        );
        case 3:
          if (!selectedTable) return null;
          return (
            <Card className="w-full">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <CardTitle>Configure Columns</CardTitle>
                    <CardDescription>Select columns to include and rename them as needed.</CardDescription>
                  </div>
                  <Button onClick={handleAiLabel} disabled={isAiLoading}>
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
                        {columnConfig.map((config, index) => (
                        <TableRow key={index}>
                            <TableCell>
                            <Checkbox
                                checked={config.included}
                                onCheckedChange={(checked) => handleColumnConfigChange(index, 'included', !!checked)}
                            />
                            </TableCell>
                            <TableCell className="font-medium text-muted-foreground">{config.originalHeader}</TableCell>
                            <TableCell>
                            <Input
                                value={config.newHeader}
                                onChange={(e) => handleColumnConfigChange(index, 'newHeader', e.target.value)}
                            />
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
              </CardContent>
            </Card>
          );
      case 4:
        return (
          <Card className="w-full">
            <CardHeader>
                <CardTitle>Visualize & Export</CardTitle>
                <CardDescription>Here is your finalized table. You can now export it in your desired format.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {finalTableHeaders.map(h => <TableHead key={h}>{h}</TableHead>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {finalTableRows.map((row, i) => (
                            <TableRow key={i}>{row.map((cell, j) => <TableCell key={j}>{cell}</TableCell>)}</TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-end">
                    <Button variant="outline" onClick={() => exportData('json')}><Download className="mr-2 h-4 w-4" /> Export as JSON</Button>
                    <Button onClick={() => exportData('csv')}><Download className="mr-2 h-4 w-4" /> Export as CSV</Button>
                </div>
            </CardContent>
          </Card>
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
          {currentStep < 3 && (
            <Button onClick={handleSelectTable} disabled={!selectedTableId}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {currentStep === 3 && (
             <Button onClick={() => setCurrentStep(4)}>
              Finalize & View Table <Check className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
