'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, Building, FlaskConical, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"


// Sample data - replace with actual data fetching later
// Data is now fetched from API

const departments = ["All", "BTech", "BPharm", "BCA"];

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  const [allTeachers, setAllTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch('/api/teachers');
        if (!res.ok) throw new Error('Failed to fetch teachers');
        const data = await res.json();
        setAllTeachers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = allTeachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.research.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All' || teacher.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="container mx-auto py-12 px-4">
      <section className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">
          Teacher Directory
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Find information about the faculty members in your department.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            type="search"
            placeholder="Search teachers by name or research..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center space-x-4">
            <Label className="flex items-center gap-2 shrink-0">
              <Filter className="h-4 w-4 text-muted-foreground" />
              Filter by Department:
            </Label>
            <RadioGroup
              defaultValue="All"
              onValueChange={setSelectedDepartment}
              className="flex flex-wrap gap-x-4 gap-y-2"
              aria-label="Filter by department"
            >
              {departments.map((dept) => (
                <div key={dept} className="flex items-center space-x-2">
                  <RadioGroupItem value={dept} id={`dept-${dept}`} />
                  <Label htmlFor={`dept-${dept}`} className="font-normal cursor-pointer">{dept}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

      </section>

      <Separator className="my-8" />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
          ))
        ) : filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => (
            <Card key={teacher.id} className="shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={teacher.avatarUrl} alt={teacher.name} />
                  <AvatarFallback>{teacher.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{teacher.name}</CardTitle>
                  <CardDescription>{teacher.title} - {teacher.department}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow pt-0">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-accent" />
                    <a href={`mailto:${teacher.email}`} className="hover:text-primary transition-colors break-all">
                      {teacher.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-accent" />
                    <span>{teacher.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-accent" />
                    <span>{teacher.office}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FlaskConical className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span className="font-medium">Research: <span className="font-normal">{teacher.research}</span></span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground italic">
            No teachers found matching your criteria.
          </p>
        )}
      </section>
    </div>
  );
}
