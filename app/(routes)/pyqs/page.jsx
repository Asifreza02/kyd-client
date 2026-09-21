'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Download, FileText, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from 'react';
import { UploadDialog } from "@/app/_components/UploadDialog";

export default function PyqsPage() {
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPyqs = async () => {
      try {
        const res = await fetch('/api/pyqs');
        if (!res.ok) throw new Error('Failed to fetch PYQs');
        const data = await res.json();
        // Only show approved PYQs on user-facing page
        setPyqs(data.filter(p => !p.status || p.status === 'approved'));
      } catch (error) {
        console.error('Error fetching PYQs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPyqs();
  }, []);

  const handleUpload = (file) => {
    // Placeholder for actual upload logic
    console.log('Uploading PYQ:', file.name);
    setUploadDialogOpen(false);
  };

  // Group PYQs by subject for display
  const groupedPyqs = pyqs.reduce((acc, pyq) => {
    const subject = pyq.subject || 'Uncategorized';
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(pyq);
    return acc;
  }, {});

  // Filter subjects by search term
  const filteredSubjects = Object.entries(groupedPyqs).filter(([subject]) => {
    if (!searchTerm) return true;
    return subject.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
            placeholder="Search subjects..."
            className="w-full max-w-sm pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredSubjects.length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {filteredSubjects.map(([subject, subjectPyqs]) => (
            <AccordionItem value={subject} key={subject} className="border rounded-lg px-4 bg-white dark:bg-zinc-900">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  {subject}
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    ({subjectPyqs.length} {subjectPyqs.length === 1 ? 'paper' : 'papers'})
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-4 border-l-2 border-accent ml-2 py-2">
                  {subjectPyqs.map((pyq) => (
                    <Card key={pyq._id || pyq.id} className="shadow-sm">
                      <CardContent className="pt-4 flex justify-between items-center flex-wrap gap-2">
                        <div className="flex-1 min-w-[200px]">
                          <p className="font-medium">{pyq.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {pyq.year ? `Year: ${pyq.year}` : ''}
                            {pyq.submittedBy ? ` · by ${pyq.submittedBy}` : ''}
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
                  ))}
                </div>
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
