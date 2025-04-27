import React from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="my-10">
         <section className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4 text-cyan-700">
          Welcome to KnowYourDepartment
        </h1>
        <p className="text-xl text-muted-foreground">
          Your central place to find information about teachers, class notes, and previous year questions for your department.
        </p>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-slate-100">
          <CardHeader>
            <Users className="h-10 w-10  mb-4 text-cyan-700" />
            <CardTitle>Teacher Directory</CardTitle>
            <CardDescription>Find contact information, office hours, and research interests of department faculty.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/teachers" passHref legacyBehavior>
              <Button className="w-full" variant="outline">
                View Teachers <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-slate-100">
          <CardHeader>
            <BookOpen className="h-10 w-10 text-cyan-700 mb-4" />
            <CardTitle>Class Notes</CardTitle>
            <CardDescription>Access shared class notes organized by course. Upload your notes to help others.</CardDescription>
          </CardHeader>
          <CardContent>
             <Link href="/notes" passHref legacyBehavior>
               <Button className="w-full" variant="outline">
                 Browse Notes <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
             </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-slate-100">
          <CardHeader>
            <FileText className="h-10 w-10 text-cyan-700 mb-4" />
            <CardTitle>PYQ Archive</CardTitle>
            <CardDescription>Explore previous year question papers to aid your exam preparation. Upload papers you have.</CardDescription>
          </CardHeader>
          <CardContent>
             <Link href="/pyqs" passHref legacyBehavior>
               <Button className="w-full" variant="outline">
                 Find PYQs <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
             </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default Hero
