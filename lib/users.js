// In-memory mock database for users
export let usersDB = [
    {
        id: "1",
        name: "Admin User",
        rollNumber: "admin",
        role: "admin",
        permissions: ["manage_users", "manage_communities", "manage_events"]
    },
    {
        id: "2",
        name: "Test User",
        rollNumber: "123456",
        role: "user",
        permissions: []
    },
    {
        id: "3",
        name: "Sarah Jenkins",
        rollNumber: "654321",
        role: "user",
        permissions: ["manage_communities"]
    },
    {
        id: "4",
        name: "John Doe",
        rollNumber: "111222",
        role: "user",
        permissions: []
    }
];

export function getUser(rollNumber) {
    return usersDB.find(u => u.rollNumber === rollNumber);
}

export function updateUserPermissions(id, permissions) {
    const userIndex = usersDB.findIndex(u => u.id === id);
    if (userIndex !== -1) {
        usersDB[userIndex].permissions = permissions;
        return usersDB[userIndex];
    }
    return null;
}

export function updateUserRole(id, role) {
    const userIndex = usersDB.findIndex(u => u.id === id);
    if (userIndex !== -1) {
        usersDB[userIndex].role = role;
        return usersDB[userIndex];
    }
    return null;
}

export function registerUser({ name, rollNumber, password }) {
    // Check if roll number already exists
    const existing = usersDB.find(u => u.rollNumber === rollNumber);
    if (existing) {
        return { error: 'A user with this roll number already exists.' };
    }

    const newUser = {
        id: String(Date.now()),
        name,
        rollNumber,
        password, // stored in-memory only
        role: 'user',
        permissions: []
    };
    usersDB.push(newUser);
    return { user: newUser };
}
