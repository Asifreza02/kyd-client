import React from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="my-10">
      <section className="text-center mb-12">
        <h1 className=" text-2xl md:text-3xl font-bold tracking-tight mb-2 lg:text-5xl text-cyan-700 text-center">
          Welcome to KnowYourDepartment
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground ">
          presented by
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-8 text-cyan-800"> JIS University</h1>
        <p className="text-md md:text-2xl ">
          Your central place to find information about teachers, class notes, and previous year questions for your department.
        </p>
      </section>
      <section className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-4 md:mx-10 my-20">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-slate-100">
          <CardHeader>
            <Users className="h-10 w-10  mb-6 text-cyan-700" />
            <CardTitle className="text-2xl">Teacher Directory</CardTitle>
            <CardDescription className="text-lg">Find contact information, office hours, and research interests of department faculty.</CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => window.location.href = '/teachers'}
              className="inline-flex w-full h-12 text-xl items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              View Teachers <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-slate-100">
          <CardHeader>
            <BookOpen className="h-10 w-10 text-cyan-700 mb-4" />
            <CardTitle className="text-2xl">Class Notes</CardTitle>
            <CardDescription className="text-lg">Access shared class notes organized by course. Upload your notes to help others.</CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => window.location.href = '/notes'}
              className="inline-flex w-full h-12 text-xl items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Browse Notes <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-slate-100">
          <CardHeader>
            <FileText className="h-10 w-10 text-cyan-700 mb-4" />
            <CardTitle className="text-2xl">PYQ Archive</CardTitle>
            <CardDescription className="text-lg">Explore previous year question papers to aid your exam preparation. Upload papers you have.</CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => window.location.href = '/pyqs'}
              className="inline-flex w-full h-12 text-xl items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Find PYQs <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default Hero
