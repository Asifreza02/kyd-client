export const notesData = {
    "1st Year": {
        "YCS 1001 - Introduction to Computing": [
            { id: 1, name: "Lecture 1 - Computing Basics & Logic", uploader: "Alice", date: "2024-01-15", fileUrl: "#" },
            { id: 2, name: "Lecture 2 - Control Structures & Variables", uploader: "Bob", date: "2024-01-22", fileUrl: "#" },
        ],
        "YMA 1001 - Mathematics I": [
            { id: 3, name: "Calculus & Linear Algebra Formula Sheet", uploader: "Charlie", date: "2024-02-01", fileUrl: "#" },
        ]
    },
    "2nd Year": {
        "YCS 3001 - Data Structures": [
            { id: 4, name: "Trees, Graphs & Dynamic Programming", uploader: "Alice Johnson", date: "2024-03-10", fileUrl: "#" },
        ],
        "YCS 3002 - Algorithms": [
            { id: 5, name: "Sorting & Divide-and-Conquer Algorithms", uploader: "David", date: "2024-03-15", fileUrl: "#" },
        ]
    },
    "3rd Year": {
        "YCS 5001 - Operating Systems": [
            { id: 6, name: "Process Management, Deadlocks & Virtual Memory", uploader: "Eve Smith", date: "2024-08-20", fileUrl: "#" },
        ],
        "YCS 5002 - Database Management Systems": [
            { id: 8, name: "SQL Queries, Normalization & ACID Properties", uploader: "Prof. Laura Jones", date: "2024-09-01", fileUrl: "#" }
        ]
    },
    "4th Year": {
        "YCS 7001 - Machine Learning": [
            { id: 7, name: "Neural Networks, SVM & Deep Learning Intro", uploader: "Dr. Dharampal Singh", date: "2024-09-05", fileUrl: "#" },
        ],
        "YCS 7002 - Cybersecurity & Ethical Hacking": [
            { id: 9, name: "Network Security, Cryptography & PKI", uploader: "Dr. Vikram Seth", date: "2024-10-12", fileUrl: "#" }
        ]
    }
};

export const pyqsData = {
    "1st Year": {
        "YCS 1001 - Introduction to Computing": [
            { id: 1, name: "Midterm Exam 2023", year: 2023, type: "Midterm", fileUrl: "#" },
            { id: 2, name: "Final End Sem Exam 2023", year: 2023, type: "Final", fileUrl: "#" },
        ],
        "YMA 1001 - Mathematics I": [
            { id: 6, name: "Mathematics I End Sem 2022", year: 2022, type: "Final", fileUrl: "#" },
        ]
    },
    "2nd Year": {
        "YCS 3001 - Data Structures": [
            { id: 3, name: "Midterm Exam 2024", year: 2024, type: "Midterm", fileUrl: "#" },
            { id: 7, name: "Final Exam 2023", year: 2023, type: "Final", fileUrl: "#" },
        ]
    },
    "3rd Year": {
        "YCS 5001 - Operating Systems": [
            { id: 4, name: "Final End Sem Exam 2023", year: 2023, type: "Final", fileUrl: "#" },
        ]
    },
    "4th Year": {
        "YCS 7001 - Machine Learning": [
            { id: 5, name: "Midterm Exam 2023", year: 2023, type: "Midterm", fileUrl: "#" },
        ]
    }
};

export const teachersData = [
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
        department: "BTech",
    },
    {
        id: 2,
        name: "Dr. Sandip Roy",
        title: "Associate Professor",
        email: "s.roy@jisuniversity.edu",
        phone: "+91 98765-43211",
        office: "Floor 9, Room 1006",
        research: "Data Structures, Competitive Programming, Graph Theory",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sandip",
        initials: "SR",
        department: "BTech",
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
        department: "BCA",
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
        department: "BPharm",
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
        department: "BCA",
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
        department: "BPharm",
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
        department: "BTech",
    },
    {
        id: 8,
        name: "Prof. Priya Das",
        title: "Assistant Professor",
        email: "p.das@jisuniversity.edu",
        phone: "+91 98765-43216",
        office: "Floor 7, Room 7004",
        research: "Human-Computer Interaction, UI/UX Design",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        initials: "PD",
        department: "BCA",
    }
];

export const eventsData = [
    {
        id: 1,
        title: "TechFest 2026",
        category: "Departmental",
        date: "2026-05-15",
        time: "10:00 AM - 5:00 PM",
        location: "Main Auditorium",
        description: "Annual technical festival featuring coding competitions, hackathons, robotics challenges, and guest lectures.",
        tag: "Future",
        image: "https://picsum.photos/seed/techfest2026/600/400"
    },
    {
        id: 2,
        title: "AI & Future of Cloud Workshop",
        category: "Departmental",
        date: "2026-04-05",
        time: "11:00 AM - 3:00 PM",
        location: "Lab Block C, Room 302",
        description: "Hands-on workshop on training Large Language Models, Prompt Engineering, and cloud API integration.",
        tag: "Upcoming",
        image: "https://picsum.photos/seed/aiworkshop/600/400"
    },
    {
        id: 3,
        title: "Spring Cultural Gala",
        category: "Cultural",
        date: "2026-04-20",
        time: "6:00 PM - 10:00 PM",
        location: "Open Air Theatre",
        description: "A spectacular night celebrating the diverse cultural talents of our students with music, dance, and drama.",
        tag: "Ongoing",
        image: "https://picsum.photos/seed/culturalgala/600/400"
    },
    {
        id: 4,
        title: "Inter-Department Cricket Tournament",
        category: "Sports",
        date: "2026-03-10",
        time: "9:00 AM - 4:00 PM",
        location: "College Ground",
        description: "Knockout cricket tournament featuring 8 department teams competing for the annual trophy.",
        tag: "Past",
        image: "https://picsum.photos/seed/cricket2026/600/400"
    },
    {
        id: 5,
        title: "Alumni Meet 2026",
        category: "Others",
        date: "2026-06-05",
        time: "5:00 PM - 9:00 PM",
        location: "Banquet Hall",
        description: "Networking session, dinner, and career guidance panel with past graduates working at top tech companies.",
        tag: "Future",
        image: "https://picsum.photos/seed/alumni2026/600/400"
    }
];
