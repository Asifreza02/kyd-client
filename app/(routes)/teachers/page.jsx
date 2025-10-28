'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, Building, FlaskConical, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"


// Sample data - replace with actual data fetching later
const allTeachers = [
  {
    id: 1,
    name: "Dr. Dharampal Singh",
    title: "Professor",
    email: "d.singh@jisuniversity.edu",
    phone: "123-456-7890",
    office: "Floor 9, Room 1003",
    research: "Artificial Intelligence, Machine Learning",
    avatarUrl: "https://picsum.photos/seed/teacher1/100/100",
    initials: "ER",
    department: "BTech",
  },
  {
    id: 2,
    name: "Dr. Sandip Roy",
    title: "Associate Professor",
    email: "s.roy@jisuniversity.edu",
    phone: "123-456-7891",
    office: "Floor 9, Room 1006",
    research: "Data Structures, Algorithms",
    avatarUrl: "https://picsum.photos/seed/teacher2/100/100",
    initials: "SC",
    department: "BTech",
  },
  {
    id: 3,
    name: "Dr. Anya Sharma",
    title: "Assistant Professor",
    email: "a.sharma@jisuniversity.edu",
    phone: "123-456-7892",
    office: "Floor 7, Room 8005",
    research: "Software Engineering, Web Development",
    avatarUrl: "https://picsum.photos/seed/teacher3/100/100",
    initials: "AS",
    department: "BCA",
  },
  {
    id: 4,
    name: "Dr. Marcus Green",
    title: "Professor",
    email: "m.green@university.edu",
    phone: "123-456-7893",
    office: "Pharmacy Wing, Lab 1",
    research: "Pharmacokinetics, Drug Delivery",
    avatarUrl: "https://picsum.photos/seed/teacher4/100/100",
    initials: "MG",
    department: "BPharm",
  },
   {
    id: 5,
    name: "Prof. Laura Jones",
    title: "Associate Professor",
    email: "l.jones@university.edu",
    phone: "123-456-7894",
    office: "Building C, Room 404",
    research: "Database Management, Networking",
    avatarUrl: "https://picsum.photos/seed/teacher5/100/100",
    initials: "LJ",
    department: "BCA",
  },
   {
    id: 6,
    name: "Dr. David Khan",
    title: "Senior Lecturer",
    email: "d.khan@university.edu",
    phone: "123-456-7895",
    office: "Pharmacy Wing, Office 5",
    research: "Medicinal Chemistry",
    avatarUrl: "https://picsum.photos/seed/teacher6/100/100",
    initials: "DK",
    department: "BPharm",
  },
];

const departments = ["All", "BTech", "BPharm", "BCA"];

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

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
                    <Filter className="h-4 w-4 text-muted-foreground"/>
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
        {filteredTeachers.length > 0 ? (
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
