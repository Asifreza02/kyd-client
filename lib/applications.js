// In-memory mock database for applications
export let applicationsDB = [
    {
        id: "1",
        communityId: "1",
        userId: "2",
        userName: "Test User",
        department: "Computer Science",
        year: "3rd Year",
        reason: "I want to participate in hackathons.",
        status: "pending", // pending, approved, rejected
        appliedAt: new Date().toISOString()
    }
];

export function getApplications() {
    return applicationsDB;
}

export function createApplication(data) {
    const newApplication = {
        id: Date.now().toString(),
        status: "pending",
        appliedAt: new Date().toISOString(),
        ...data
    };
    applicationsDB.push(newApplication);
    return newApplication;
}

export function updateApplicationStatus(id, status) {
    const index = applicationsDB.findIndex(a => a.id === id);
    if (index !== -1) {
        applicationsDB[index].status = status;
        return applicationsDB[index];
    }
    return null;
}
