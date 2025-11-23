import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Teacher from '../models/Teachers.js';

dotenv.config({ path: '.env.local' });

const sampleTeachers = [
    {
        id: 1,
        name: "Dr. Alice Johnson",
        title: "Professor",
        email: "alice.johnson@university.edu",
        phone: "+1 (555) 123-4567",
        office: "Room 301, Science Building",
        research: "Quantum Computing, Artificial Intelligence",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
        initials: "AJ",
        department: "Computer Science"
    },
    {
        id: 2,
        name: "Dr. Bob Smith",
        title: "Associate Professor",
        email: "bob.smith@university.edu",
        phone: "+1 (555) 987-6543",
        office: "Room 204, Engineering Hall",
        research: "Machine Learning, Data Mining",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
        initials: "BS",
        department: "Computer Science"
    },
    {
        id: 3,
        name: "Dr. Carol Williams",
        title: "Assistant Professor",
        email: "carol.williams@university.edu",
        phone: "+1 (555) 555-5555",
        office: "Room 105, Tech Center",
        research: "Cybersecurity, Network Security",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
        initials: "CW",
        department: "Computer Science"
    }
];

async function seed() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in .env.local");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        await Teacher.deleteMany({});
        console.log("Cleared existing teachers");

        await Teacher.insertMany(sampleTeachers);
        console.log("Seeded teachers");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

seed();
