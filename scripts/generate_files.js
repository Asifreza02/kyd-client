const fs = require('fs');
const path = require('path');

const notesDir = path.join(__dirname, '../public/uploads/notes');
const pyqsDir = path.join(__dirname, '../public/uploads/pyqs');

fs.mkdirSync(notesDir, { recursive: true });
fs.mkdirSync(pyqsDir, { recursive: true });

function createSimplePdf(title, subtitle, lines) {
    const streamContent = `BT
/F1 18 Tf
50 720 Td
(${title.replace(/[()]/g, '')}) Tj
/F1 13 Tf
0 -30 Td
(${subtitle.replace(/[()]/g, '')}) Tj
/F1 10 Tf
${lines.map(line => `0 -20 Td\n(${line.replace(/[()]/g, '')}) Tj`).join('\n')}
ET`;

    const streamLength = Buffer.byteLength(streamContent, 'utf8');

    let body = `%PDF-1.4\n`;
    const offsets = [];

    offsets.push(body.length);
    body += `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;

    offsets.push(body.length);
    body += `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;

    offsets.push(body.length);
    body += `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`;

    offsets.push(body.length);
    body += `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`;

    offsets.push(body.length);
    body += `5 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`;

    const xrefOffset = body.length;
    body += `xref\n0 6\n0000000000 65535 f \n`;
    for (const offset of offsets) {
        body += `${String(offset).padStart(10, '0')} 00000 n \n`;
    }
    body += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

    return body;
}

// Notes files
const notes = [
    {
        filename: 'dsa-complete-notes.pdf',
        title: 'Know Your Dept - Data Structures & Algorithms',
        subtitle: 'Course: YCS 3001 | Instructor: Dr. Sandip Roy',
        lines: [
            '1. Introduction to Linear and Non-Linear Data Structures',
            '2. Arrays, Linked Lists (Singly, Doubly, Circular)',
            '3. Stacks, Queues, Priority Queues and Deques',
            '4. Trees: Binary Trees, BST, AVL Trees, B-Trees and Heaps',
            '5. Graphs: BFS, DFS, Dijkstra Algorithm, Kruskal and Prim',
            '6. Dynamic Programming: 0/1 Knapsack, LCS, Matrix Chain',
            'Uploaded by: Alice Johnson (2024)'
        ]
    },
    {
        filename: 'os-process-management.pdf',
        title: 'Know Your Dept - Operating Systems Notes',
        subtitle: 'Course: YCS 5001 | 3rd Year Computer Science',
        lines: [
            '1. Process States, PCB, Context Switching and Schedulers',
            '2. CPU Scheduling: FCFS, SJF, Round Robin, Priority',
            '3. Inter-Process Communication (IPC) and Synchronization',
            '4. Critical Section Problem, Mutex, Semaphores and Monitors',
            '5. Deadlocks: Prevention, Avoidance (Bankers Algorithm), Detection',
            '6. Memory Management: Paging, Segmentation, Virtual Memory',
            'Uploaded by: Eve Smith'
        ]
    },
    {
        filename: 'ml-neural-networks.pdf',
        title: 'Know Your Dept - Machine Learning Guide',
        subtitle: 'Course: YCS 7001 | Instructor: Dr. Dharampal Singh',
        lines: [
            '1. Supervised Learning: Linear Regression, Logistic Regression',
            '2. Decision Trees, Random Forests, Support Vector Machines (SVM)',
            '3. Unsupervised Learning: K-Means Clustering, PCA Dimensionality',
            '4. Neural Networks: Perceptrons, Multi-Layer Perceptron (MLP)',
            '5. Backpropagation, Activation Functions, Loss Functions',
            '6. Introduction to Convolutional Neural Networks (CNN) & Transformers',
            'Uploaded by: Dr. Dharampal Singh'
        ]
    },
    {
        filename: 'dbms-sql-normalization.pdf',
        title: 'Know Your Dept - Database Management Systems',
        subtitle: 'Course: YCS 5002 | Instructor: Prof. Laura Jones',
        lines: [
            '1. Relational Model, ER-Diagrams, Relational Algebra',
            '2. SQL: DDL, DML, DQL, Joins, Subqueries and Views',
            '3. Functional Dependencies and Normal Forms (1NF, 2NF, 3NF, BCNF)',
            '4. Transaction Processing and ACID Properties',
            '5. Concurrency Control: 2-Phase Locking, Timestamp Ordering',
            '6. Indexing: B+ Trees and Hashing Techniques',
            'Uploaded by: Prof. Laura Jones'
        ]
    },
    {
        filename: 'maths1-calculus.pdf',
        title: 'Know Your Dept - Mathematics I Formula Sheet',
        subtitle: 'Course: YMA 1001 | 1st Year Engineering',
        lines: [
            '1. Differential Calculus: Partial Derivatives, Maxima & Minima',
            '2. Integral Calculus: Multiple Integrals, Beta and Gamma Functions',
            '3. Linear Algebra: Matrix Rank, Eigenvalues, Eigenvectors',
            '4. Vector Calculus: Gradient, Divergence, Curl, Gauss Theorem',
            '5. Ordinary Differential Equations (First and Second Order)',
            'Uploaded by: Charlie Brown'
        ]
    },
    {
        filename: 'cybersec-ethical-hacking.pdf',
        title: 'Know Your Dept - Cybersecurity & Network Defense',
        subtitle: 'Course: YCS 7002 | Instructor: Dr. Vikram Seth',
        lines: [
            '1. OSI Security Architecture, Attack Models and Threats',
            '2. Cryptography: Symmetric (AES, DES) and Asymmetric (RSA, ECC)',
            '3. Network Security: Firewalls, IDS/IPS, VPN, SSL/TLS Handshake',
            '4. Web Application Security: OWASP Top 10, SQLi, XSS, CSRF',
            '5. Penetration Testing Methodologies & Ethical Hacking Standards',
            'Uploaded by: Dr. Vikram Seth'
        ]
    }
];

// PYQs files
const pyqs = [
    {
        filename: 'dsa-midterm-2024.pdf',
        title: 'KYD Exam Paper - Data Structures (Midterm 2024)',
        subtitle: 'Course Code: YCS 3001 | Time: 2 Hours | Max Marks: 50',
        lines: [
            'Q1 (10 Marks): Implement an AVL Tree insertion with rotations.',
            'Q2 (10 Marks): Compare Quick Sort and Merge Sort complexities.',
            'Q3 (15 Marks): Explain Dijkstras Shortest Path algorithm with graph.',
            'Q4 (15 Marks): Solve 0/1 Knapsack problem using Dynamic Programming.',
            'Department of Computer Science - JIS University'
        ]
    },
    {
        filename: 'dsa-final-2023.pdf',
        title: 'KYD Exam Paper - Data Structures (Final 2023)',
        subtitle: 'Course Code: YCS 3001 | Time: 3 Hours | Max Marks: 70',
        lines: [
            'Section A: 10 Objective/Short Questions (20 Marks)',
            'Section B: Long Questions (Answer any 5 out of 7 - 50 Marks)',
            'Topics: B+ Trees, Topological Sort, Red-Black Trees, Graph Traversal',
            'Department of Computer Science - Final Examination'
        ]
    },
    {
        filename: 'os-final-2023.pdf',
        title: 'KYD Exam Paper - Operating Systems (Final 2023)',
        subtitle: 'Course Code: YCS 5001 | Time: 3 Hours | Max Marks: 70',
        lines: [
            'Q1: Explain Bankers Algorithm for Deadlock Avoidance with example.',
            'Q2: Compare Paging vs Segmentation. Calculate effective memory access.',
            'Q3: Discuss Dining Philosophers Problem and its Semaphore solution.',
            'Q4: Explain Page Replacement algorithms (FIFO, LRU, Optimal).',
            'Department of Computer Science - Final Examination'
        ]
    },
    {
        filename: 'ml-midterm-2023.pdf',
        title: 'KYD Exam Paper - Machine Learning (Midterm 2023)',
        subtitle: 'Course Code: YCS 7001 | Time: 2 Hours | Max Marks: 50',
        lines: [
            'Q1: Derive the cost function and gradient descent for Linear Regression.',
            'Q2: Explain Support Vector Machines with soft margin and kernel trick.',
            'Q3: Differentiate between L1 (Lasso) and L2 (Ridge) Regularization.',
            'Q4: Explain Multi-Layer Perceptron backpropagation algorithm.',
            'Department of Computer Science - Midterm Examination'
        ]
    },
    {
        filename: 'maths1-endsem-2022.pdf',
        title: 'KYD Exam Paper - Mathematics I (End Sem 2022)',
        subtitle: 'Course Code: YMA 1001 | Time: 3 Hours | Max Marks: 70',
        lines: [
            'Q1: Find the Eigenvalues and Eigenvectors of given 3x3 Matrix.',
            'Q2: Verify Cayley-Hamilton Theorem for matrix A.',
            'Q3: Evaluate double integral over the given region.',
            'Q4: State and prove Stokes Theorem with application.',
            'Department of Basic Sciences - End Semester Examination'
        ]
    }
];

// Write notes
for (const note of notes) {
    const pdf = createSimplePdf(note.title, note.subtitle, note.lines);
    fs.writeFileSync(path.join(notesDir, note.filename), pdf, 'binary');
    console.log('Created note PDF:', note.filename);
}

// Write PYQs
for (const pyq of pyqs) {
    const pdf = createSimplePdf(pyq.title, pyq.subtitle, pyq.lines);
    fs.writeFileSync(path.join(pyqsDir, pyq.filename), pdf, 'binary');
    console.log('Created PYQ PDF:', pyq.filename);
}

console.log('All sample documents successfully created!');
