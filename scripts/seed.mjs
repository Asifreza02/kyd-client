import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Teacher from '../models/Teachers.js';
import Event from '../models/Event.js';
import Note from '../models/Note.js';
import PYQ from '../models/PYQ.js';
import Community from '../models/Community.js';

dotenv.config({ path: '.env.local' });

const sampleTeachers = [
    {
        id: 1,
        name: "Dr. Dharampal Singh",
        title: "Professor & HOD",
        email: "d.singh@jisuniversity.edu",
        phone: "+91 98765-43210",
        office: "Floor 9, Room 1003",
        research: "Artificial Intelligence, Machine Learning, Deep Learning",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dharampal",
        initials: "DS",
        department: "BTech"
    },
    {
        id: 2,
        name: "Dr. Sandip Roy",
        title: "Associate Professor",
        email: "s.roy@jisuniversity.edu",
        phone: "+91 98765-43211",
        office: "Floor 9, Room 1006",
        research: "Data Structures, Competitive Programming, Graph Algorithms",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sandip",
        initials: "SR",
        department: "BTech"
    },
    {
        id: 3,
        name: "Dr. Anya Sharma",
        title: "Assistant Professor",
        email: "a.sharma@jisuniversity.edu",
        phone: "+91 98765-43212",
        office: "Floor 7, Room 8005",
        research: "Software Engineering, Cloud Computing, Web Architecture",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anya",
        initials: "AS",
        department: "BCA"
    },
    {
        id: 4,
        name: "Dr. Marcus Green",
        title: "Professor",
        email: "m.green@university.edu",
        phone: "+1 555-0199",
        office: "Pharmacy Wing, Lab 1",
        research: "Pharmacokinetics, Drug Delivery Systems",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
        initials: "MG",
        department: "BPharm"
    },
    {
        id: 5,
        name: "Prof. Laura Jones",
        title: "Associate Professor",
        email: "l.jones@university.edu",
        phone: "+1 555-0198",
        office: "Building C, Room 404",
        research: "Database Management Systems, Distributed Networks",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura",
        initials: "LJ",
        department: "BCA"
    },
    {
        id: 6,
        name: "Dr. David Khan",
        title: "Senior Lecturer",
        email: "d.khan@university.edu",
        phone: "+1 555-0197",
        office: "Pharmacy Wing, Office 5",
        research: "Medicinal Chemistry, Pharmacology",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        initials: "DK",
        department: "BPharm"
    },
    {
        id: 7,
        name: "Dr. Vikram Seth",
        title: "Professor",
        email: "v.seth@jisuniversity.edu",
        phone: "+91 98765-43215",
        office: "Floor 8, Room 9002",
        research: "Cybersecurity, Ethical Hacking, Blockchain Technology",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
        initials: "VS",
        department: "BTech"
    },
    {
        id: 8,
        name: "Prof. Priya Das",
        title: "Assistant Professor",
        email: "p.das@jisuniversity.edu",
        phone: "+91 98765-43216",
        office: "Floor 7, Room 7004",
        research: "Human-Computer Interaction, UI/UX Design, Front-End Systems",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        initials: "PD",
        department: "BCA"
    }
];

const sampleEvents = [
    {
        title: "TechFest 2026",
        category: "Departmental",
        date: "2026-05-15",
        time: "10:00 AM - 5:00 PM",
        location: "Main Auditorium",
        description: "Annual technical festival featuring coding competitions, hackathons, robotics challenges, and guest lectures from industry leaders.",
        image: "https://picsum.photos/seed/techfest2026/800/400",
        organizer: "Department of Computer Science",
        status: "approved",
        submittedBy: "admin"
    },
    {
        title: "Spring Cultural Gala",
        category: "Cultural",
        date: "2026-04-20",
        time: "6:00 PM - 10:00 PM",
        location: "Open Air Theatre",
        description: "A spectacular celebration featuring live music band performances, drama, classical & hip-hop dance, and food stalls.",
        image: "https://picsum.photos/seed/culturalgala/800/400",
        organizer: "Cultural Club",
        status: "approved",
        submittedBy: "admin"
    },
    {
        title: "AI & Future of Cloud Workshop",
        category: "Departmental",
        date: "2026-04-05",
        time: "11:00 AM - 3:00 PM",
        location: "Lab Block C, Room 302",
        description: "Hands-on workshop on training Large Language Models, Prompt Engineering, and deploying AI APIs to cloud platforms.",
        image: "https://picsum.photos/seed/aiworkshop/800/400",
        organizer: "CodeCraft Hub",
        status: "approved",
        submittedBy: "admin"
    },
    {
        title: "Inter-Department Cricket Tournament",
        category: "Sports",
        date: "2026-03-10",
        time: "9:00 AM - 4:00 PM",
        location: "College Ground",
        description: "Knockout cricket tournament featuring 8 department teams competing for the annual trophy.",
        image: "https://picsum.photos/seed/cricket2026/800/400",
        organizer: "Sports Committee",
        status: "approved",
        submittedBy: "admin"
    },
    {
        title: "Alumni Meet 2026",
        category: "Others",
        date: "2026-06-05",
        time: "5:00 PM - 9:00 PM",
        location: "Banquet Hall",
        description: "Networking session, dinner, and career guidance panel with past graduates working at Google, Microsoft, and Amazon.",
        image: "https://picsum.photos/seed/alumni2026/800/400",
        organizer: "Alumni Association",
        status: "approved",
        submittedBy: "admin"
    }
];

const sampleNotes = [
    {
        title: "Data Structures & Algorithms Complete Notes",
        subject: "Data Structures",
        fileUrl: "https://example.com/notes/dsa-complete.pdf",
        status: "approved",
        submittedBy: "Alice Johnson"
    },
    {
        title: "Operating Systems - Process Management & Deadlocks",
        subject: "Operating Systems",
        fileUrl: "https://example.com/notes/os-unit2.pdf",
        status: "approved",
        submittedBy: "Eve Smith"
    },
    {
        title: "Machine Learning - Neural Networks & SVM Summary",
        subject: "Machine Learning",
        fileUrl: "https://example.com/notes/ml-summary.pdf",
        status: "approved",
        submittedBy: "Dr. Dharampal Singh"
    },
    {
        title: "Database Management Systems - Normalization & SQL Queries",
        subject: "Database Management",
        fileUrl: "https://example.com/notes/dbms-sql.pdf",
        status: "approved",
        submittedBy: "Prof. Laura Jones"
    },
    {
        title: "Calculus & Linear Algebra Formula Sheet",
        subject: "Mathematics I",
        fileUrl: "https://example.com/notes/maths1-cheatsheet.pdf",
        status: "approved",
        submittedBy: "Charlie Brown"
    }
];

const samplePYQs = [
    {
        title: "YCS 3001 Data Structures Midterm Exam 2024",
        year: "2024",
        subject: "Data Structures",
        fileUrl: "https://example.com/pyq/dsa-midterm-2024.pdf",
        status: "approved",
        submittedBy: "admin"
    },
    {
        title: "YCS 5001 Operating Systems Final Exam 2023",
        year: "2023",
        subject: "Operating Systems",
        fileUrl: "https://example.com/pyq/os-final-2023.pdf",
        status: "approved",
        submittedBy: "admin"
    },
    {
        title: "YCS 7001 Machine Learning Midterm 2023",
        year: "2023",
        subject: "Machine Learning",
        fileUrl: "https://example.com/pyq/ml-midterm-2023.pdf",
        status: "approved",
        submittedBy: "admin"
    },
    {
        title: "YMA 1001 Mathematics I End Sem 2022",
        year: "2022",
        subject: "Mathematics I",
        fileUrl: "https://example.com/pyq/maths-final-2022.pdf",
        status: "approved",
        submittedBy: "admin"
    }
];

const sampleCommunities = [
    {
        name: "CodeCraft Hub",
        description: "A community for passionate developers to share ideas, build open-source projects, and prepare for competitive hackathons.",
        lead: "Sarah Jenkins",
        memberCount: 142,
        category: "Technical",
        image: "https://picsum.photos/seed/codecraft/600/400",
        tags: ["Coding", "Hackathons", "Web Dev"],
        status: "approved",
        rules: [
            "Be respectful to all members",
            "No spamming or self-promotion",
            "Help peers debug and build"
        ],
        announcements: [
            {
                title: "Welcome to CodeCraft Hub!",
                content: "Join our discord channel and check out the upcoming hackathon project guidelines.",
                date: new Date().toISOString(),
                author: "Sarah Jenkins"
            }
        ]
    },
    {
        name: "Robotics & AI Society",
        description: "Designing autonomous robots, IoT sensors, and computer vision systems for inter-university competitions.",
        lead: "Michael Chang",
        memberCount: 95,
        category: "Engineering",
        image: "https://picsum.photos/seed/robotics/600/400",
        tags: ["Hardware", "AI", "Sensors", "Arduino"],
        status: "approved"
    },
    {
        name: "CyberSec Alliance",
        description: "Learn penetration testing, capture-the-flag (CTF) challenges, and ethical hacking techniques in safe environments.",
        lead: "Dr. Vikram Seth",
        memberCount: 88,
        category: "Security",
        image: "https://picsum.photos/seed/cybersec/600/400",
        tags: ["Cybersecurity", "CTF", "Linux", "Ethical Hacking"],
        status: "approved"
    }
];

async function seed() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in .env.local");
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB successfully!");

        // Clear existing data
        await Teacher.deleteMany({});
        await Event.deleteMany({});
        await Note.deleteMany({});
        await PYQ.deleteMany({});
        await Community.deleteMany({});

        // Insert new expanded data
        await Teacher.insertMany(sampleTeachers);
        console.log(`Seeded ${sampleTeachers.length} Teachers`);

        await Event.insertMany(sampleEvents);
        console.log(`Seeded ${sampleEvents.length} Events`);

        await Note.insertMany(sampleNotes);
        console.log(`Seeded ${sampleNotes.length} Notes`);

        await PYQ.insertMany(samplePYQs);
        console.log(`Seeded ${samplePYQs.length} PYQs`);

        await Community.insertMany(sampleCommunities);
        console.log(`Seeded ${sampleCommunities.length} Communities`);

        console.log("✅ Database seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
}

seed();
