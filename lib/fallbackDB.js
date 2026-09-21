// In-memory fallback database using global to persist across HMR
let communitiesDB = global._communitiesDB || [
    {
        _id: "1",
        name: "CodeCraft Hub",
        description: "A community for passionate developers to share ideas, build projects, and prepare for competitive hackathons.",
        lead: "Sarah Jenkins",
        leaderId: "3",
        managers: [],
        members: ["2"],
        memberCount: 142,
        category: "Technical",
        image: "https://picsum.photos/seed/codecraft/600/400",
        tags: ["Coding", "Hackathons", "Web Dev"],
        status: "approved",
        rules: [
            "Be respectful to all members",
            "No spamming or self-promotion",
            "Keep discussions relevant to development",
            "Help others when you can"
        ],
        announcements: [
            {
                title: "Welcome to CodeCraft Hub!",
                content: "We are excited to have you here. Check out our upcoming projects in the GitHub repo.",
                date: "2026-04-20T10:00:00Z",
                author: "Sarah Jenkins"
            },
            {
                title: "New Hackathon Announced",
                content: "Prepare your teams for the Spring Hackathon starting next month!",
                date: "2026-04-25T14:30:00Z",
                author: "Sarah Jenkins"
            }
        ]
    },
    {
        _id: "2",
        name: "Robotics & AI Society",
        description: "Designing and building autonomous robots, computer vision algorithms, and IoT systems.",
        lead: "Michael Chang",
        leaderId: "4",
        managers: ["3"],
        members: [],
        memberCount: 95,
        category: "Engineering",
        image: "https://picsum.photos/seed/robotics/600/400",
        tags: ["Hardware", "AI", "Sensors", "Arduino"],
        status: "approved"
    },
    {
        _id: "3",
        name: "CyberSec Alliance",
        description: "Learn penetration testing, capture-the-flag (CTF) challenges, and ethical hacking techniques.",
        lead: "Dr. Vikram Seth",
        leaderId: "7",
        managers: [],
        members: ["2"],
        memberCount: 88,
        category: "Security",
        image: "https://picsum.photos/seed/cybersec/600/400",
        tags: ["Cybersecurity", "CTF", "Linux", "Ethical Hacking"],
        status: "approved"
    }
];
global._communitiesDB = communitiesDB;

let applicationsDB = global._applicationsDB || [
    { _id: "app1", communityId: "1", userId: "1", userName: "Admin User", rollNumber: "admin", department: "CS", year: "Staff", reason: "Admin access needed", status: "approved" },
    { _id: "app2", communityId: "2", userId: "1", userName: "Admin User", rollNumber: "admin", department: "CS", year: "Staff", reason: "Admin access needed", status: "approved" },
    { _id: "app3", communityId: "1", userId: "2", userName: "Test User", rollNumber: "123456", department: "CS", year: "2nd Year", reason: "Want to learn coding", status: "pending" },
    { _id: "app4", communityId: "2", userId: "4", userName: "John Doe", rollNumber: "111222", department: "ECE", year: "3rd Year", reason: "Interested in robotics", status: "pending" },
];
global._applicationsDB = applicationsDB;

let eventsDB = global._eventsDB || [
    { _id: "101", title: "TechFest 2026", date: "2026-05-15", time: "10:00 AM - 5:00 PM", location: "Main Auditorium", category: "Departmental", image: "https://picsum.photos/seed/techfest2026/800/400", organizer: "Department of Computer Science", description: "Annual technical festival featuring coding competitions, hackathons, robotics challenges, and guest lectures from industry leaders.", status: "approved", submittedBy: "admin" },
    { _id: "102", title: "AI & Future of Cloud Workshop", date: "2026-04-05", time: "11:00 AM - 3:00 PM", location: "Lab Block C, Room 302", category: "Departmental", image: "https://picsum.photos/seed/aiworkshop/800/400", organizer: "CodeCraft Hub", description: "Hands-on workshop on training Large Language Models, Prompt Engineering, and deploying AI APIs to cloud platforms.", status: "approved", submittedBy: "admin" },
    { _id: "103", title: "Spring Cultural Gala", date: "2026-04-20", time: "6:00 PM - 10:00 PM", location: "Open Air Theatre", category: "Cultural", image: "https://picsum.photos/seed/culturalgala/800/400", organizer: "Cultural Club", description: "A spectacular night celebrating the diverse cultural talents of our students. Features live music, dance, stand-up comedy, and food stalls.", status: "approved", submittedBy: "admin" },
    { _id: "104", title: "Inter-Department Cricket Tournament", date: "2026-03-10", time: "9:00 AM - 4:00 PM", location: "College Ground", category: "Sports", image: "https://picsum.photos/seed/cricket2026/800/400", organizer: "Sports Committee", description: "Knockout cricket tournament featuring 8 department teams competing for the annual trophy.", status: "approved", submittedBy: "admin" },
    { _id: "105", title: "Alumni Meet 2026", date: "2026-06-05", time: "5:00 PM - 9:00 PM", location: "Banquet Hall", category: "Others", image: "https://picsum.photos/seed/alumni2026/800/400", organizer: "Alumni Association", description: "Networking session, dinner, and career guidance panel with past graduates working at top tech companies.", status: "approved", submittedBy: "admin" },
];
global._eventsDB = eventsDB;

let notesDB = global._notesDB || [
    { _id: "201", title: "Data Structures & Algorithms Complete Notes", subject: "Data Structures", fileUrl: "https://example.com/notes/dsa.pdf", status: "approved", submittedBy: "Alice Johnson" },
    { _id: "202", title: "Operating Systems - Process Management", subject: "Operating Systems", fileUrl: "https://example.com/notes/os.pdf", status: "approved", submittedBy: "Eve Smith" },
    { _id: "203", title: "Machine Learning - Neural Networks Intro", subject: "Machine Learning", fileUrl: "https://example.com/notes/ml.pdf", status: "approved", submittedBy: "Dr. Dharampal Singh" },
    { _id: "204", title: "DBMS SQL Queries & Normalization", subject: "Database Management", fileUrl: "https://example.com/notes/dbms.pdf", status: "approved", submittedBy: "Prof. Laura Jones" },
    { _id: "205", title: "Calculus & Linear Algebra Notes", subject: "Mathematics I", fileUrl: "https://example.com/notes/maths.pdf", status: "approved", submittedBy: "Charlie Brown" },
];
global._notesDB = notesDB;

let pyqsDB = global._pyqsDB || [
    { _id: "301", title: "YCS 3001 Data Structures Midterm 2024", year: "2024", subject: "Data Structures", fileUrl: "https://example.com/pyq/dsa2024.pdf", status: "approved", submittedBy: "admin" },
    { _id: "302", title: "YCS 5001 Operating Systems Final 2023", year: "2023", subject: "Operating Systems", fileUrl: "https://example.com/pyq/os2023.pdf", status: "approved", submittedBy: "admin" },
    { _id: "303", title: "YCS 7001 Machine Learning Midterm 2023", year: "2023", subject: "Machine Learning", fileUrl: "https://example.com/pyq/ml2023.pdf", status: "approved", submittedBy: "admin" },
    { _id: "304", title: "YMA 1001 Mathematics I End Sem 2022", year: "2022", subject: "Mathematics I", fileUrl: "https://example.com/pyq/maths2022.pdf", status: "approved", submittedBy: "admin" },
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
        research: "Human-Computer Interaction, UI/UX Design",
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
                newItem.status = newItem.status || 'pending';
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
