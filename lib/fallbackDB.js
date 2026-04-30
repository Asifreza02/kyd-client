// In-memory fallback database using global to persist across HMR
let communitiesDB = global._communitiesDB || [
    {
        _id: "1",
        name: "CodeCraft Hub",
        description: "A community for passionate developers to share ideas, build projects, and prepare for hackathons.",
        lead: "Sarah Jenkins",
        leaderId: "3", // From users.js
        managers: [],
        members: ["2"], // Test User
        memberCount: 124,
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
        name: "Robotics Society",
        description: "Designing and building autonomous robots. We participate in national level robotics competitions.",
        lead: "Michael Chang",
        leaderId: "4", // John Doe
        managers: ["3"],
        members: [],
        memberCount: 85,
        category: "Engineering",
        image: "https://picsum.photos/seed/robotics/600/400",
        tags: ["Hardware", "AI", "Sensors"],
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
    { _id: "101", title: "Tech Symposium 2026", date: "2026-10-15", time: "10:00 AM - 5:00 PM", location: "Main Auditorium", category: "Departmental", image: "https://picsum.photos/seed/techsymposium/800/400", organizer: "Department of Computer Science", description: "The annual Tech Symposium brings together students, faculty, and industry experts for a day of innovation, knowledge sharing, and collaboration. This year's theme focuses on 'AI & The Future of Education' featuring keynote speakers from top tech companies, hands-on workshops on machine learning and cloud computing, project exhibitions, and a panel discussion on emerging career opportunities in tech. Don't miss the live coding challenge with exciting prizes!", status: "approved", submittedBy: "admin" },
    { _id: "102", title: "Hackathon Spring 2026", date: "2026-05-20", time: "9:00 AM - 9:00 AM (24hrs)", location: "Lab Block B", category: "Departmental", image: "https://picsum.photos/seed/hackathon2026/800/400", organizer: "CodeCraft Hub", description: "A 24-hour coding marathon where teams of 2-4 will compete to build innovative solutions for real-world problems. Categories include Web Development, Mobile Apps, AI/ML, and IoT. Top 3 teams will receive cash prizes and internship opportunities with our sponsor companies. Food and beverages will be provided throughout the event.", status: "pending", submittedBy: "Sarah Jenkins" },
    { _id: "103", title: "Spring Cultural Gala", date: "2026-04-20", time: "6:00 PM - 10:00 PM", location: "Open Air Theatre", category: "Cultural", image: "https://picsum.photos/seed/culturalgala/800/400", organizer: "Cultural Committee", description: "A spectacular night celebrating the diverse cultural talents of our students. The gala features classical and contemporary dance performances, live music from the college band, stand-up comedy, a fashion show, and theatrical performances. The event concludes with a DJ night and bonfire. This is the most anticipated cultural event of the academic year!", status: "approved", submittedBy: "admin" },
    { _id: "104", title: "Inter-Department Cricket Tournament", date: "2026-03-10", time: "9:00 AM - 4:00 PM", location: "College Ground", category: "Sports", image: "https://picsum.photos/seed/crickettournament/800/400", organizer: "Sports Committee", description: "The annual inter-department cricket showdown returns! Eight departments will compete in a knockout format for the coveted Champions Trophy. Each match is 10 overs per side. The event includes a special exhibition match between faculty and the college cricket team. Refreshments and merchandise stalls will be available at the venue.", status: "approved", submittedBy: "admin" },
    { _id: "105", title: "Alumni Meet 2026", date: "2026-06-05", time: "5:00 PM - 9:00 PM", location: "Banquet Hall", category: "Others", image: "https://picsum.photos/seed/alumnimeet/800/400", organizer: "Alumni Association", description: "Reconnect with fellow graduates and expand your professional network at the annual Alumni Meet. The evening includes keynote addresses from distinguished alumni, networking sessions, a campus nostalgia walk, dinner, and an awards ceremony recognizing outstanding alumni achievements. Current students are welcome to attend and interact with alumni for mentorship and career guidance.", status: "approved", submittedBy: "admin" },
];
global._eventsDB = eventsDB;

let notesDB = global._notesDB || [
    { _id: "201", title: "Data Structures Complete", subject: "Data Structures", fileUrl: "https://example.com/notes", status: "approved", submittedBy: "admin" },
    { _id: "202", title: "DBMS Unit 3 Notes", subject: "Database Management", fileUrl: "https://example.com/dbms", status: "pending", submittedBy: "John Doe" },
];
global._notesDB = notesDB;

let pyqsDB = global._pyqsDB || [
    { _id: "301", title: "OS Midterm 2025", year: "2025", subject: "Operating Systems", fileUrl: "https://example.com/pyq", status: "approved", submittedBy: "admin" },
    { _id: "302", title: "DSA Final 2025", year: "2025", subject: "Data Structures", fileUrl: "https://example.com/dsa-pyq", status: "pending", submittedBy: "Test User" },
];
global._pyqsDB = pyqsDB;

let teachersDB = global._teachersDB || [
    {
        _id: "401",
        id: 401,
        name: "Dr. Alan Turing",
        title: "Professor",
        email: "turing@university.edu",
        phone: "555-0101",
        office: "Room 404",
        research: "Artificial Intelligence, Cryptography",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alan",
        initials: "AT",
        department: "Computer Science"
    }
];
global._teachersDB = teachersDB;

function createFallbackModel(dbArray, populateField = null) {
    return {
        find: (query = {}) => {
            let results = [...dbArray];
            // Apply query filters
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
            // Return a thenable with chainable populate/sort/limit for compatibility
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
            return Promise.resolve(dbArray.find(i => i._id === id) || null);
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
            const index = dbArray.findIndex(i => i._id === id);
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
            const index = dbArray.findIndex(i => i._id === id);
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
