'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Download, FileText, Search } from "lucide-react";
import { useState } from 'react';
import { UploadDialog } from "@/app/_components/UploadDialog";

import { pyqsData } from "@/lib/data";


export default function PyqsPage() {
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term


  const handleUpload = (file) => {
    // Placeholder for actual upload logic
    console.log('Uploading PYQ:', file.name);
    // You would typically call an API endpoint here
    setUploadDialogOpen(false);
    // Show a success toast message
  };




  return (
    <div className="container mx-auto py-12 px-4">
      <section className="mb-8">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl mb-2">
              Previous Year Questions (PYQs)
            </h1>
            <p className="text-lg text-muted-foreground">
              Access past exam papers to help your preparation.
            </p>
          </div>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" /> Upload PYQ
          </Button>
        </div>
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses..." // Updated placeholder
            className="w-full max-w-sm pl-9" // Added padding for the icon
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {Object.keys(pyqsData).length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {Object.entries(pyqsData).map(([year, subjects]) => (
            <AccordionItem value={year} key={year} className="border rounded-lg px-4 bg-white dark:bg-zinc-900">
              <AccordionTrigger className="text-xl font-bold hover:no-underline">
                {year}
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <Accordion type="multiple" className="w-full">
                  {Object.entries(subjects).map(([subject, pyqs]) => {
                    if (searchTerm && !subject.toLowerCase().includes(searchTerm.toLowerCase())) {
                      return null;
                    }

                    return (
                      <AccordionItem value={subject} key={subject} className="border-b-0 mb-2">
                        <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline hover:text-accent transition-colors py-2">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            {subject}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pl-4 border-l-2 border-accent ml-2 py-2">
                            {pyqs.length > 0 ? (
                              pyqs.map((pyq) => (
                                <Card key={pyq.id} className="shadow-sm">
                                  <CardContent className="pt-4 flex justify-between items-center flex-wrap gap-2">
                                    <div className="flex-1 min-w-[200px]">
                                      <p className="font-medium">{pyq.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        Type: {pyq.type} | Year: {pyq.year}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => window.open(pyq.fileUrl, '_blank')}
                                      className="inline-flex items-center justify-center rounded-md border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                                    >
                                      <Download className="mr-2 h-4 w-4" /> Download
                                    </button>
                                  </CardContent>
                                </Card>
                              ))
                            ) : (
                              <p className="text-muted-foreground italic">No PYQs uploaded for this course yet.</p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="text-center text-muted-foreground italic mt-8">
          No PYQs found.
        </p>
      )}
      <UploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={handleUpload}
        uploadType="PYQ"
        accept=".pdf,.zip"
      />
    </div>
  );
}
