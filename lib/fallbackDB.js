// In-memory fallback database using global to persist across HMR
let communitiesDB = global._communitiesDB || [
    {
        _id: "1",
        name: "CodeCraft Hub",
        description: "A community for passionate developers to share ideas, build projects, and prepare for competitive hackathons and coding challenges.",
        lead: "Sarah Jenkins",
        leaderId: "3",
        managers: [],
        members: ["1", "2"],
        memberCount: 148,
        category: "Technical",
        image: "https://picsum.photos/seed/codecraft/600/400",
        tags: ["Coding", "Hackathons", "Web Dev", "Open Source"],
        status: "approved",
        rules: [
            "Be respectful and collaborative to all members",
            "No spamming, pirated content, or unauthorized promotion",
            "Keep technical discussions focused and productive",
            "Help peers with code reviews and bug debugging"
        ],
        announcements: [
            {
                title: "Welcome to CodeCraft Hub!",
                content: "We are excited to kick off our spring coding cohort. Check out our GitHub project boards!",
                date: "2026-04-20T10:00:00Z",
                author: "Sarah Jenkins"
            },
            {
                title: "Spring Hackathon Preparation",
                content: "Form teams of 2 to 4 for the upcoming 24hr Hackathon in May. Mentorship slots available!",
                date: "2026-04-25T14:30:00Z",
                author: "Sarah Jenkins"
            }
        ]
    },
    {
        _id: "2",
        name: "Robotics & AI Society",
        description: "Designing autonomous robots, drone mechanics, computer vision algorithms, and embedded IoT sensors for national competitions.",
        lead: "Michael Chang",
        leaderId: "4",
        managers: ["3"],
        members: ["1"],
        memberCount: 112,
        category: "Engineering",
        image: "https://picsum.photos/seed/robotics/600/400",
        tags: ["Hardware", "AI", "Sensors", "Arduino", "Robotics"],
        status: "approved",
        rules: [
            "Handle laboratory equipment and robotics kits with care",
            "Follow safety protocols in hardware testing rooms",
            "Document code and circuit schematics on GitHub"
        ],
        announcements: [
            {
                title: "RoboCup 2026 Registration Open",
                content: "Team registrations for line follower and maze solver competitions are now live.",
                date: "2026-03-15T09:00:00Z",
                author: "Michael Chang"
            }
        ]
    },
    {
        _id: "3",
        name: "CyberSec Alliance",
        description: "Learn penetration testing, capture-the-flag (CTF) challenges, network defense, and ethical hacking techniques in lab sandboxes.",
        lead: "Dr. Vikram Seth",
        leaderId: "7",
        managers: [],
        members: ["2"],
        memberCount: 94,
        category: "Security",
        image: "https://picsum.photos/seed/cybersec/600/400",
        tags: ["Cybersecurity", "CTF", "Linux", "Ethical Hacking", "Cryptography"],
        status: "approved",
        rules: [
            "All testing must be performed only on designated sandbox servers",
            "Strict adherence to university cyber ethics guidelines",
            "Share writeups after CTF events conclude"
        ],
        announcements: [
            {
                title: "Weekly CTF Challenge #4",
                content: "Web exploitation and SQL injection challenge is live on our local CTF portal.",
                date: "2026-04-01T12:00:00Z",
                author: "Dr. Vikram Seth"
            }
        ]
    },
    {
        _id: "4",
        name: "Cloud & DevOps Guild",
        description: "Exploring Kubernetes, Docker containers, CI/CD pipelines, AWS/GCP cloud deployments, and scalable backend infrastructure.",
        lead: "Alex Turner",
        leaderId: "5",
        managers: [],
        members: [],
        memberCount: 76,
        category: "Technical",
        image: "https://picsum.photos/seed/clouddevops/600/400",
        tags: ["Cloud", "DevOps", "Docker", "Kubernetes", "AWS"],
        status: "approved",
        rules: [
            "Share reusable Terraform scripts and Docker configurations",
            "Clean up test cloud instances after labs"
        ],
        announcements: [
            {
                title: "Free AWS Cloud Credits",
                content: "Students participating in cloud research can claim $100 AWS credits this month.",
                date: "2026-04-10T16:00:00Z",
                author: "Alex Turner"
            }
        ]
    },
    {
        _id: "5",
        name: "UI/UX & Frontend Designers",
        description: "A community focused on modern web design, Figma prototyping, Tailwind CSS animations, design systems, and user accessibility.",
        lead: "Prof. Priya Das",
        leaderId: "8",
        managers: [],
        members: ["2"],
        memberCount: 83,
        category: "Design",
        image: "https://picsum.photos/seed/uiuxdesign/600/400",
        tags: ["Design", "UI/UX", "Figma", "Frontend", "React"],
        status: "approved",
        rules: [
            "Provide constructive design critiques",
            "Share open-source UI design kits and inspiration"
        ],
        announcements: [
            {
                title: "Design Critique Night",
                content: "Join us this Friday at 5 PM for live Figma portfolio reviews and design feedback.",
                date: "2026-04-12T11:00:00Z",
                author: "Prof. Priya Das"
            }
        ]
    }
];
global._communitiesDB = communitiesDB;

let applicationsDB = global._applicationsDB || [
    { _id: "app1", communityId: "1", userId: "1", userName: "Admin User", rollNumber: "admin", department: "CS", year: "Staff", reason: "Admin access needed", status: "approved" },
    { _id: "app2", communityId: "2", userId: "1", userName: "Admin User", rollNumber: "admin", department: "CS", year: "Staff", reason: "Admin access needed", status: "approved" },
    { _id: "app3", communityId: "1", userId: "2", userName: "Test User", rollNumber: "123456", department: "CS", year: "2nd Year", reason: "Want to learn coding", status: "approved" },
    { _id: "app4", communityId: "2", userId: "4", userName: "John Doe", rollNumber: "111222", department: "ECE", year: "3rd Year", reason: "Interested in robotics", status: "approved" },
    { _id: "app5", communityId: "3", userId: "2", userName: "Test User", rollNumber: "123456", department: "CS", year: "2nd Year", reason: "Interested in CTFs", status: "approved" },
];
global._applicationsDB = applicationsDB;

let eventsDB = global._eventsDB || [
    {
        _id: "101",
        title: "TechFest 2026 - Innovation Unbounded",
        date: "2026-05-15",
        time: "10:00 AM - 5:00 PM",
        location: "Main Auditorium & Tech Quad",
        category: "Departmental",
        image: "https://picsum.photos/seed/techfest2026/800/400",
        organizer: "Department of Computer Science",
        description: "The annual technical festival featuring 24-hour coding competitions, robotics arena battles, AI model hackathons, and keynote speeches from tech leaders.",
        status: "approved",
        submittedBy: "admin"
    },
    {
        _id: "102",
        title: "AI & Future of Cloud Workshop",
        date: "2026-04-05",
        time: "11:00 AM - 3:00 PM",
        location: "Lab Block C, Room 302",
        category: "Departmental",
        image: "https://picsum.photos/seed/aiworkshop/800/400",
        organizer: "CodeCraft Hub & Google Developer Student Club",
        description: "Interactive hands-on session on fine-tuning LLMs with Gemini API, building agentic AI workflows, and serverless cloud deployment.",
        status: "approved",
        submittedBy: "admin"
    },
    {
        _id: "103",
        title: "Spring Cultural Gala & Music Fest",
        date: "2026-04-20",
        time: "6:00 PM - 10:00 PM",
        location: "Open Air Theatre",
        category: "Cultural",
        image: "https://picsum.photos/seed/culturalgala/800/400",
        organizer: "University Cultural Committee",
        description: "A magical evening celebrating music, classical and fusion dances, acoustic band performances, stand-up comedy, and night food carnivals.",
        status: "approved",
        submittedBy: "admin"
    },
    {
        _id: "104",
        title: "Inter-Department Cricket Championship",
        date: "2026-03-10",
        time: "9:00 AM - 4:00 PM",
        location: "University Sports Ground",
        category: "Sports",
        image: "https://picsum.photos/seed/cricket2026/800/400",
        organizer: "Sports Board",
        description: "The premier inter-department cricket tournament featuring 8 departments battling across knockout rounds for the annual trophy.",
        status: "approved",
        submittedBy: "admin"
    },
    {
        _id: "105",
        title: "Annual Alumni Networking Meet 2026",
        date: "2026-06-05",
        time: "5:00 PM - 9:00 PM",
        location: "Grand Banquet Hall",
        category: "Others",
        image: "https://picsum.photos/seed/alumni2026/800/400",
        organizer: "Alumni Relations Bureau",
        description: "Reconnect with past graduates, explore mentorship opportunities, and attend panels with alumni working at Google, Microsoft, and Amazon.",
        status: "approved",
        submittedBy: "admin"
    },
    {
        _id: "106",
        title: "Capture The Flag (CTF) Cyber Arena",
        date: "2026-04-28",
        time: "2:00 PM - 8:00 PM",
        location: "Virtual Lab Platform & Room 9002",
        category: "Technical",
        image: "https://picsum.photos/seed/ctfarena/800/400",
        organizer: "CyberSec Alliance",
        description: "Solve challenges in web exploitation, binary reverse engineering, forensics, and cryptography. Top teams receive hardware security keys and prizes.",
        status: "approved",
        submittedBy: "Dr. Vikram Seth"
    }
];
global._eventsDB = eventsDB;

let notesDB = global._notesDB || [
    {
        _id: "201",
        title: "Data Structures & Algorithms Complete Notes",
        subject: "Data Structures",
        fileUrl: "/uploads/notes/dsa-complete-notes.pdf",
        status: "approved",
        submittedBy: "Alice Johnson"
    },
    {
        _id: "202",
        title: "Operating Systems - Process Management & Memory",
        subject: "Operating Systems",
        fileUrl: "/uploads/notes/os-process-management.pdf",
        status: "approved",
        submittedBy: "Eve Smith"
    },
    {
        _id: "203",
        title: "Machine Learning - Neural Networks & SVM Guide",
        subject: "Machine Learning",
        fileUrl: "/uploads/notes/ml-neural-networks.pdf",
        status: "approved",
        submittedBy: "Dr. Dharampal Singh"
    },
    {
        _id: "204",
        title: "DBMS - SQL Queries, Normalization & ACID Properties",
        subject: "Database Management",
        fileUrl: "/uploads/notes/dbms-sql-normalization.pdf",
        status: "approved",
        submittedBy: "Prof. Laura Jones"
    },
    {
        _id: "205",
        title: "Calculus & Linear Algebra Formula Cheatsheet",
        subject: "Mathematics I",
        fileUrl: "/uploads/notes/maths1-calculus.pdf",
        status: "approved",
        submittedBy: "Charlie Brown"
    },
    {
        _id: "206",
        title: "Cybersecurity & Ethical Hacking Essentials",
        subject: "Cybersecurity",
        fileUrl: "/uploads/notes/cybersec-ethical-hacking.pdf",
        status: "approved",
        submittedBy: "Dr. Vikram Seth"
    }
];
global._notesDB = notesDB;

let pyqsDB = global._pyqsDB || [
    {
        _id: "301",
        title: "YCS 3001 Data Structures Midterm Exam 2024",
        year: "2024",
        subject: "Data Structures",
        fileUrl: "/uploads/pyqs/dsa-midterm-2024.pdf",
        status: "approved",
        submittedBy: "admin"
    },
    {
        _id: "302",
        title: "YCS 3001 Data Structures Final End Sem 2023",
        year: "2023",
        subject: "Data Structures",
        fileUrl: "/uploads/pyqs/dsa-final-2023.pdf",
        status: "approved",
        submittedBy: "admin"
    },
    {
        _id: "303",
        title: "YCS 5001 Operating Systems Final Exam 2023",
        year: "2023",
        subject: "Operating Systems",
        fileUrl: "/uploads/pyqs/os-final-2023.pdf",
        status: "approved",
        submittedBy: "admin"
    },
    {
        _id: "304",
        title: "YCS 7001 Machine Learning Midterm Exam 2023",
        year: "2023",
        subject: "Machine Learning",
        fileUrl: "/uploads/pyqs/ml-midterm-2023.pdf",
        status: "approved",
        submittedBy: "admin"
    },
    {
        _id: "305",
        title: "YMA 1001 Mathematics I End Sem Exam 2022",
        year: "2022",
        subject: "Mathematics I",
        fileUrl: "/uploads/pyqs/maths1-endsem-2022.pdf",
        status: "approved",
        submittedBy: "admin"
    }
];
global._pyqsDB = pyqsDB;

let teachersDB = global._teachersDB || [
    {
        _id: "401",
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
        _id: "402",
        id: 2,
        name: "Dr. Sandip Roy",
        title: "Associate Professor",
        email: "s.roy@jisuniversity.edu",
        phone: "+91 98765-43211",
        office: "Floor 9, Room 1006",
        research: "Data Structures, Competitive Programming, Graph Theory",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sandip",
        initials: "SR",
        department: "BTech"
    },
    {
        _id: "403",
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
        _id: "404",
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
        _id: "405",
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
        _id: "406",
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
        _id: "407",
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
        _id: "408",
        id: 8,
        name: "Prof. Priya Das",
        title: "Assistant Professor",
        email: "p.das@jisuniversity.edu",
        phone: "+91 98765-43216",
        office: "Floor 7, Room 7004",
        research: "Human-Computer Interaction, UI/UX Design, Figma",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        initials: "PD",
        department: "BCA"
    }
];
global._teachersDB = teachersDB;

function createFallbackModel(dbArray, populateField = null) {
    return {
        find: (query = {}) => {
            let results = [...dbArray];
            const queryKeys = Object.keys(query);
            if (queryKeys.length > 0) {
                results = results.filter(item =>
                    queryKeys.every(k => item[k] === query[k])
                );
            }
            if (populateField && populateField === 'communityId') {
                results = results.map(item => {
                    const commId = typeof item.communityId === 'object' ? item.communityId._id : item.communityId;
                    const comm = communitiesDB.find(c => c._id === commId);
                    return { ...item, communityId: comm ? { _id: comm._id, name: comm.name, lead: comm.lead } : null };
                });
            }
            const result = Promise.resolve(results);
            result.populate = () => result;
            result.sort = () => result;
            result.limit = () => result;
            result.lean = () => result;
            return result;
        },
        findOne: (query) => {
            const keys = Object.keys(query);
            const found = dbArray.find(item => keys.every(k => item[k] === query[k]));
            return Promise.resolve(found || null);
        },
        findById: (id) => {
            return Promise.resolve(dbArray.find(i => i._id === id || i.id == id) || null);
        },
        create: (data) => {
            const newItem = { _id: Date.now().toString(), ...data };
            if (dbArray === eventsDB || dbArray === notesDB || dbArray === pyqsDB) {
                newItem.status = newItem.status || 'approved';
            }
            dbArray.push(newItem);
            return Promise.resolve(newItem);
        },
        findByIdAndUpdate: (id, data) => {
            const index = dbArray.findIndex(i => i._id === id || i.id == id);
            if (index !== -1) {
                const updatedItem = { ...dbArray[index] };
                for (const key in data) {
                    if (key === '$push') {
                        for (const arrayField in data.$push) {
                            if (!updatedItem[arrayField]) updatedItem[arrayField] = [];
                            updatedItem[arrayField].push(data.$push[arrayField]);
                        }
                    } else if (key === '$inc') {
                        for (const numField in data.$inc) {
                            updatedItem[numField] = (updatedItem[numField] || 0) + data.$inc[numField];
                        }
                    } else {
                        updatedItem[key] = data[key];
                    }
                }
                dbArray[index] = updatedItem;
                return Promise.resolve(updatedItem);
            }
            return Promise.resolve(null);
        },
        findByIdAndDelete: (id) => {
            const index = dbArray.findIndex(i => i._id === id || i.id == id);
            if (index !== -1) {
                dbArray.splice(index, 1);
                return Promise.resolve(true);
            }
            return Promise.resolve(null);
        }
    };
}

export const fallbackCommunityDB = createFallbackModel(communitiesDB);
export const fallbackApplicationDB = createFallbackModel(applicationsDB, 'communityId');
export const fallbackEventDB = createFallbackModel(eventsDB);
export const fallbackNoteDB = createFallbackModel(notesDB);
export const fallbackPYQDB = createFallbackModel(pyqsDB);
export const fallbackTeacherDB = createFallbackModel(teachersDB);
