'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Download, BookOpen, Search } from "lucide-react";
import { useState } from 'react';
import { UploadDialog } from "@/app/_components/UploadDialog";


import { notesData } from "@/lib/data";

export default function NotesPage() {
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term


  const handleUpload = (file) => {
    // Placeholder for actual upload logic
    console.log('Uploading note:', file.name);
    // You would typically call an API endpoint here
    setUploadDialogOpen(false);
    // Show a success toast message (implementation depends on your toast library)
  };



  return (
    <div className="container mx-auto py-12 px-4">
      <section className="mb-8">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl mb-2">
              Class Notes Repository
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse and share notes for your courses.
            </p>
          </div>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" /> Upload Note
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

      {Object.keys(notesData).length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {Object.entries(notesData).map(([year, subjects]) => (
            <AccordionItem value={year} key={year} className="border rounded-lg px-4 bg-white dark:bg-zinc-900">
              <AccordionTrigger className="text-xl font-bold hover:no-underline">
                {year}
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <Accordion type="multiple" className="w-full">
                  {Object.entries(subjects).map(([subject, notes]) => {
                    // Filter notes based on search term if needed, or filter subjects
                    // For simplicity, we'll show all for now, or you can implement deep filtering
                    if (searchTerm && !subject.toLowerCase().includes(searchTerm.toLowerCase())) {
                      return null;
                    }

                    return (
                      <AccordionItem value={subject} key={subject} className="border-b-0 mb-2">
                        <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline hover:text-accent transition-colors py-2">
                          <span className="flex items-center gap-3">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                            {subject}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pl-4 border-l-2 border-accent ml-2 py-2">
                            {notes.map((note) => (
                              <Card key={note.id} className="shadow-sm">
                                <CardContent className="pt-4 flex justify-between items-center flex-wrap gap-2">
                                  <div className="flex-1 min-w-[200px]">
                                    <p className="font-medium">{note.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Uploaded by {note.uploader} on {note.date}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => window.open(note.fileUrl, '_blank')}
                                      className="inline-flex items-center justify-center rounded-md border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                                    >
                                      <Download className="mr-2 h-4 w-4" /> Download
                                    </button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
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
          No notes found.
        </p>
      )}

      <UploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={handleUpload}
        uploadType="Note"
        accept=".pdf,.doc,.docx,.txt,.md"
      />
    </div>
  );
}
