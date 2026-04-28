// In-memory mock database for communities
export let communitiesDB = [
    {
        id: "1",
        name: "CodeCraft Hub",
        description: "A community for passionate developers to share ideas, build projects, and prepare for hackathons.",
        lead: "Sarah Jenkins",
        memberCount: 124,
        category: "Technical",
        image: "https://picsum.photos/seed/codecraft/600/400",
        tags: ["Coding", "Hackathons", "Web Dev"]
    },
    {
        id: "2",
        name: "Robotics Society",
        description: "Designing and building autonomous robots. We participate in national level robotics competitions.",
        lead: "Michael Chang",
        memberCount: 85,
        category: "Engineering",
        image: "https://picsum.photos/seed/robotics/600/400",
        tags: ["Hardware", "AI", "Sensors"]
    },
    {
        id: "3",
        name: "Art & Soul Studio",
        description: "Express yourself through painting, digital art, and photography. We host monthly exhibitions.",
        lead: "Priya Sharma",
        memberCount: 210,
        category: "Cultural",
        image: "https://picsum.photos/seed/art/600/400",
        tags: ["Painting", "Photography", "Design"]
    },
    {
        id: "4",
        name: "Finance & Investment Club",
        description: "Learn about personal finance, stock markets, and cryptocurrency. Real-world trading simulations.",
        lead: "David Miller",
        memberCount: 156,
        category: "Business",
        image: "https://picsum.photos/seed/finance/600/400",
        tags: ["Stocks", "Crypto", "Economics"]
    }
];

export function getCommunities() {
    return communitiesDB;
}

export function createCommunity(data) {
    const newCommunity = {
        id: Date.now().toString(),
        memberCount: 0,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
        ...data
    };
    communitiesDB.push(newCommunity);
    return newCommunity;
}

export function updateCommunity(id, data) {
    const index = communitiesDB.findIndex(c => c.id === id);
    if (index !== -1) {
        if (data.tags && typeof data.tags === 'string') {
            data.tags = data.tags.split(',').map(t => t.trim());
        }
        communitiesDB[index] = { ...communitiesDB[index], ...data };
        return communitiesDB[index];
    }
    return null;
}

export function deleteCommunity(id) {
    const index = communitiesDB.findIndex(c => c.id === id);
    if (index !== -1) {
        communitiesDB.splice(index, 1);
        return true;
    }
    return false;
}
