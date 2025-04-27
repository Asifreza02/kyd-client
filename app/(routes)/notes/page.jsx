'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Download, BookOpen, Search } from "lucide-react";
import { useState } from 'react';
import { UploadDialog } from "@/app/_components/UploadDialog";


// Sample data - replace with actual data fetching later
const notesData = {
  "CS101 - Introduction to Computer Science": [
    { id: 1, name: "Lecture 1 Notes - Basics", uploader: "Alice", date: "2024-01-15", fileUrl: "#" },
    { id: 2, name: "Lecture 2 Notes - Variables", uploader: "Bob", date: "2024-01-22", fileUrl: "#" },
  ],
  "MA201 - Calculus II": [
    { id: 3, name: "Integration Techniques", uploader: "Charlie", date: "2024-02-01", fileUrl: "#" },
    { id: 4, name: "Series and Sequences", uploader: "Alice", date: "2024-02-08", fileUrl: "#" },
  ],
   "PHY101 - Physics I": [
    { id: 5, name: "Kinematics Summary", uploader: "David", date: "2024-01-20", fileUrl: "#" },
  ],
};

export default function NotesPage() {
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const allCourses = Object.keys(notesData);

  const handleUpload = (file) => {
    // Placeholder for actual upload logic
    console.log('Uploading note:', file.name);
    // You would typically call an API endpoint here
    setUploadDialogOpen(false);
    // Show a success toast message (implementation depends on your toast library)
  };

  // Filter courses based on search term
  const filteredCourses = allCourses.filter(course =>
    course.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {filteredCourses.length > 0 ? (
        <Accordion type="multiple" className="w-full">
          {filteredCourses.map((course) => {
             const courseNotes = notesData[course];
             // Skip rendering if a course somehow has no notes after filtering courses
             if (!courseNotes || courseNotes.length === 0) {
                return null;
             }
            return (
              <AccordionItem value={course} key={course}>
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline hover:text-accent transition-colors">
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-muted-foreground"/>
                        {course}
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-4 border-l-2 border-accent ml-2 py-2">
                    {courseNotes.map((note) => (
                        <Card key={note.id} className="shadow-sm">
                          <CardContent className="pt-4 flex justify-between items-center flex-wrap gap-2">
                            <div className="flex-1 min-w-[200px]">
                              <p className="font-medium">{note.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Uploaded by {note.uploader} on {note.date}
                              </p>
                            </div>
                            <a href={note.fileUrl} download={note.name} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" /> Download
                              </Button>
                            </a>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
            })}
        </Accordion>
      ) : (
         <p className="text-center text-muted-foreground italic mt-8">
            No courses found matching your search criteria.
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
