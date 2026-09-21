'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Download, BookOpen, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from 'react';
import { UploadDialog } from "@/app/_components/UploadDialog";

export default function NotesPage() {
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch('/api/notes');
        if (!res.ok) throw new Error('Failed to fetch notes');
        const data = await res.json();
        // Only show approved notes on user-facing page
        setNotes(data.filter(n => !n.status || n.status === 'approved'));
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleUpload = (file) => {
    // Placeholder for actual upload logic
    console.log('Uploading note:', file.name);
    setUploadDialogOpen(false);
  };

  // Group notes by subject for display
  const groupedNotes = notes.reduce((acc, note) => {
    const subject = note.subject || 'Uncategorized';
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(note);
    return acc;
  }, {});

  // Filter subjects by search term
  const filteredSubjects = Object.entries(groupedNotes).filter(([subject]) => {
    if (!searchTerm) return true;
    return subject.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
          {filteredSubjects.map(([subject, subjectNotes]) => (
            <AccordionItem value={subject} key={subject} className="border rounded-lg px-4 bg-white dark:bg-zinc-900">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <span className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  {subject}
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    ({subjectNotes.length} {subjectNotes.length === 1 ? 'note' : 'notes'})
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-4 border-l-2 border-accent ml-2 py-2">
                  {subjectNotes.map((note) => (
                    <Card key={note._id || note.id} className="shadow-sm">
                      <CardContent className="pt-4 flex justify-between items-center flex-wrap gap-2">
                        <div className="flex-1 min-w-[200px]">
                          <p className="font-medium">{note.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {note.submittedBy ? `Submitted by ${note.submittedBy}` : ''}
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
