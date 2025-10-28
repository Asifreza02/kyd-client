'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Download, FileText, Search } from "lucide-react";
import { useState } from 'react';
import { UploadDialog } from "@/app/_components/UploadDialog";

// Sample data - replace with actual data fetching later
const pyqsData = {
  "CS101 - Introduction to Computer Science": [
    { id: 1, name: "Midterm Exam - Fall 2023", year: 2023, type: "Midterm", fileUrl: "#" }
  ],
  "MA201 - Calculus II": [
    { id: 3, name: "Quiz 1 - Spring 2024", year: 2024, type: "Quiz", fileUrl: "#" },
    { id: 4, name: "Final Exam - Fall 2022", year: 2022, type: "Final", fileUrl: "#" }
  ],
  "PHY101 - Physics I": []
};


export default function PyqsPage() {
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const allCourses = Object.keys(pyqsData);

 const handleUpload = (file) => {
    // Placeholder for actual upload logic
    console.log('Uploading PYQ:', file.name);
    // You would typically call an API endpoint here
    setUploadDialogOpen(false);
    // Show a success toast message
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

       {filteredCourses.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {filteredCourses.map((course) => {
              const coursePyqs = pyqsData[course];
              // Only render the accordion item if there are PYQs for this course
              if (!coursePyqs || coursePyqs.length === 0) {
                 return null;
              }
              return (
                <AccordionItem value={course} key={course}>
                  <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline hover:text-accent transition-colors">
                      <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground"/>
                           {course}
                      </div>
                  </AccordionTrigger>
                  <AccordionContent>
                     <div className="space-y-4 pl-4 border-l-2 border-accent ml-2 py-2">
                      {coursePyqs.length > 0 ? (
                         coursePyqs.map((pyq) => (
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
                         // This case should not happen if the accordion item is rendered, but kept for safety
                         <p className="text-muted-foreground italic">No PYQs uploaded for this course yet.</p>
                      )}
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
        uploadType="PYQ"
        accept=".pdf,.zip"
      />
    </div>
  );
}
