// ═══════════════════════════════════════════════════════════════
//   Seed Data — 12 realistic Indian tech jobs
// ═══════════════════════════════════════════════════════════════

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const seedJobs = [
  {
    id: 'job-001',
    title: 'Senior Product Designer',
    company: 'Razorpay',
    companyLogo: null,
    location: 'Bangalore',
    type: 'Remote',
    experience: 'Senior',
    salaryMin: 1800000,
    salaryMax: 2400000,
    currency: 'INR',
    tags: ['Figma', 'Design Systems', 'User Research', 'Prototyping'],
    description: `<h3>About the Role</h3>
<p>We're looking for a Senior Product Designer to join Razorpay's design team and help shape the future of financial infrastructure in India. You'll work closely with product managers, engineers, and stakeholders to design intuitive experiences for complex fintech products.</p>

<h3>Responsibilities</h3>
<ul>
<li>Lead end-to-end design for key product areas, from discovery through delivery</li>
<li>Build and maintain scalable design systems that ensure consistency across the platform</li>
<li>Conduct user research and usability testing to validate design decisions</li>
<li>Mentor junior designers and contribute to design culture at Razorpay</li>
</ul>

<h3>Requirements</h3>
<ul>
<li>5+ years of product design experience, preferably in fintech or B2B SaaS</li>
<li>Expert proficiency in Figma and modern prototyping tools</li>
<li>Strong portfolio demonstrating systems thinking and user-centred design</li>
<li>Excellent communication and collaboration skills</li>
</ul>`,
    postedAt: daysAgo(2),
    employerId: 'emp-001',
  },
  {
    id: 'job-002',
    title: 'Frontend Engineer (React)',
    company: 'CRED',
    companyLogo: null,
    location: 'Bangalore',
    type: 'Full-time',
    experience: 'Mid',
    salaryMin: 1400000,
    salaryMax: 2000000,
    currency: 'INR',
    tags: ['React', 'TypeScript', 'GraphQL', 'Performance'],
    description: `<h3>About the Role</h3>
<p>CRED is building India's most exclusive community for creditworthy individuals. As a Frontend Engineer, you'll be responsible for building delightful, high-performance web experiences that our members love.</p>

<h3>Responsibilities</h3>
<ul>
<li>Build pixel-perfect, responsive UIs using React and TypeScript</li>
<li>Optimize web performance and Core Web Vitals across all pages</li>
<li>Collaborate with the design team to implement complex animations and micro-interactions</li>
<li>Write clean, testable code with strong TypeScript types and unit tests</li>
</ul>

<h3>Requirements</h3>
<ul>
<li>3+ years of professional experience with React and modern JavaScript</li>
<li>Proficiency in TypeScript, GraphQL, and state management patterns</li>
<li>Experience with performance optimization and accessibility best practices</li>
<li>Passion for building beautiful, user-centric interfaces</li>
</ul>`,
    postedAt: daysAgo(5),
    employerId: 'emp-002',
  },
  {
    id: 'job-003',
    title: 'Backend Engineer (Node.js)',
    company: 'Zepto',
    companyLogo: null,
    location: 'Mumbai',
    type: 'Full-time',
    experience: 'Mid',
    salaryMin: 1600000,
    salaryMax: 2200000,
    currency: 'INR',
    tags: ['Node.js', 'PostgreSQL', 'Redis', 'Microservices', 'Docker'],
    description: `<h3>About the Role</h3>
<p>Zepto is revolutionizing quick commerce in India. We're looking for a Backend Engineer to build and scale the systems that power 10-minute grocery delivery. You'll work on high-throughput, low-latency services that handle millions of orders.</p>

<h3>Responsibilities</h3>
<ul>
<li>Design and build scalable APIs and microservices using Node.js</li>
<li>Optimize database queries and implement caching strategies for high-performance systems</li>
<li>Build real-time order tracking and routing systems</li>
<li>Ensure system reliability through monitoring, alerting, and incident response</li>
</ul>

<h3>Requirements</h3>
<ul>
<li>3+ years of backend engineering experience with Node.js or similar</li>
<li>Strong understanding of PostgreSQL, Redis, and message queues</li>
<li>Experience with containerization (Docker) and CI/CD pipelines</li>
<li>Ability to work in a fast-paced, high-growth environment</li>
</ul>`,
    postedAt: daysAgo(3),
    employerId: 'emp-003',
  },
  {
    id: 'job-004',
    title: 'Product Manager',
    company: 'Swiggy',
    companyLogo: null,
    location: 'Bangalore',
    type: 'Full-time',
    experience: 'Senior',
    salaryMin: 2200000,
    salaryMax: 3000000,
    currency: 'INR',
    tags: ['Product Strategy', 'Analytics', 'A/B Testing', 'Cross-functional'],
    description: `<h3>About the Role</h3>
<p>Swiggy is India's leading on-demand delivery platform. As a Senior Product Manager, you'll own the strategy and execution for one of our core product verticals, driving impact for millions of users and thousands of merchant partners.</p>

<h3>Responsibilities</h3>
<ul>
<li>Define product vision and roadmap aligned with company OKRs</li>
<li>Conduct market analysis, competitive research, and customer interviews</li>
<li>Drive cross-functional collaboration across engineering, design, data, and ops teams</li>
<li>Set up experimentation frameworks and make data-driven decisions using A/B tests</li>
</ul>

<h3>Requirements</h3>
<ul>
<li>5+ years of product management experience, preferably in consumer tech or marketplace</li>
<li>Strong analytical skills with proficiency in SQL and data visualization tools</li>
<li>Proven track record of shipping impactful products at scale</li>
<li>MBA or equivalent experience preferred</li>
</ul>`,
    postedAt: daysAgo(7),
    employerId: 'emp-004',
  },
  {
    id: 'job-005',
    title: 'Data Scientist',
    company: 'Meesho',
    companyLogo: null,
    location: 'Bangalore',
    type: 'Remote',
    experience: 'Mid',
    salaryMin: 1500000,
    salaryMax: 2100000,
    currency: 'INR',
    tags: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
    description: `<h3>About the Role</h3>
<p>Meesho is democratizing e-commerce for the next billion users. As a Data Scientist, you'll build ML models that power product recommendations, pricing optimization, and fraud detection — impacting the shopping experience for over 150 million users.</p>

<h3>Responsibilities</h3>
<ul>
<li>Build and deploy ML models for recommendations, search ranking, and personalization</li>
<li>Analyze large-scale datasets to uncover insights and business opportunities</li>
<li>Design and run experiments to validate hypotheses and measure impact</li>
<li>Collaborate with product and engineering teams to productionize models</li>
</ul>

<h3>Requirements</h3>
<ul>
<li>3+ years of experience in applied machine learning or data science</li>
<li>Proficiency in Python, SQL, and ML frameworks (TensorFlow/PyTorch)</li>
<li>Experience with recommendation systems, NLP, or computer vision is a plus</li>
<li>Strong statistical reasoning and problem-solving skills</li>
</ul>`,
    postedAt: daysAgo(10),
    employerId: 'emp-005',
  },
  {
    id: 'job-006',
    title: 'DevOps Engineer',
    company: 'Groww',
    companyLogo: null,
    location: 'Bangalore',
    type: 'Full-time',
    experience: 'Senior',
    salaryMin: 1800000,
    salaryMax: 2600000,
    currency: 'INR',
    tags: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Monitoring'],
    description: `<h3>About the Role</h3>
<p>Groww is India's fastest growing investment platform. As a Senior DevOps Engineer, you'll design and manage cloud infrastructure that serves millions of investors. You'll be responsible for ensuring 99.99% uptime for mission-critical financial systems.</p>

<h3>Responsibilities</h3>
<ul>
<li>Design and maintain scalable cloud infrastructure on AWS using Terraform</li>
<li>Manage Kubernetes clusters and implement GitOps workflows</li>
<li>Build and optimize CI/CD pipelines for rapid, safe deployments</li>
<li>Implement comprehensive monitoring, alerting, and incident response systems</li>
</ul>

<h3>Requirements</h3>
<ul>
<li>5+ years of DevOps/SRE experience with strong AWS expertise</li>
<li>Hands-on experience with Kubernetes, Docker, and Infrastructure as Code</li>
<li>Strong scripting skills (Bash, Python) and understanding of networking</li>
<li>Experience in fintech or regulated industries is a plus</li>
</ul>`,
    postedAt: daysAgo(1),
    employerId: 'emp-006',
  },
  {
    id: 'job-007',
    title: 'iOS Developer (Swift)',
    company: 'PhonePe',
    companyLogo: null,
    location: 'Bangalore',
    type: 'Full-time',
    experience: 'Mid',
    salaryMin: 1600000,
    salaryMax: 2200000,
    currency: 'INR',
    tags: ['Swift', 'SwiftUI', 'UIKit', 'Core Data'],
    description: `<h3>About the Role</h3>
<p>PhonePe processes over 4 billion transactions monthly. As an iOS Developer, you'll build features used by hundreds of millions of users, crafting smooth, reliable experiences for India's largest UPI payments app.</p>

<h3>Responsibilities</h3>
<ul>
<li>Build and maintain iOS features using Swift and SwiftUI</li>
<li>Optimize app performance, reduce crash rates, and improve startup times</li>
<li>Implement secure payment flows adhering to RBI and NPCI guidelines</li>
<li>Collaborate with cross-platform teams for consistent feature releases</li>
</ul>

<h3>Requirements</h3>
<ul>
<li>3+ years of professional iOS development experience</li>
<li>Strong proficiency in Swift, SwiftUI, and UIKit</li>
<li>Experience with Core Data, networking frameworks, and push notifications</li>
<li>Knowledge of app architecture patterns (MVVM, Clean Architecture)</li>
</ul>`,
    postedAt: daysAgo(12),
    employerId: 'emp-007',
  },
  {
    id: 'job-008',
    title: 'UX Researcher',
    company: 'Freshworks',
    companyLogo: null,
    location: 'Chennai',
    type: 'Full-time',
    experience: 'Entry',
    salaryMin: 800000,
    salaryMax: 1200000,
    currency: 'INR',
    tags: ['User Research', 'Usability Testing', 'Surveys', 'Qualitative Analysis'],
    description: `<h3>About the Role</h3>
<p>Freshworks builds enterprise SaaS products used by over 60,000 businesses worldwide. As a UX Researcher, you'll conduct foundational and evaluative research to inform product decisions and ensure our enterprise tools are intuitive and delightful.</p>

<h3>Responsibilities</h3>
<ul>
<li>Plan and conduct user interviews, usability tests, and surveys</li>
<li>Synthesize research findings into actionable design recommendations</li>
<li>Build and maintain research repositories and participant databases</li>
<li>Present insights to stakeholders and advocate for user needs</li>
</ul>

<h3>Requirements</h3>
<ul>
<li>0–2 years of experience in UX research or a related field</li>
<li>Understanding of qualitative and quantitative research methods</li>
<li>Excellent written and verbal communication skills</li>
<li>Bachelor's degree in Psychology, HCI, Design, or a related field</li>
</ul>`,
    postedAt: daysAgo(15),
    employerId: 'emp-008',
  },
  {
    id: 'job-009',
    title: 'Full Stack Developer',
    company: 'Postman',
    companyLogo: null,
    location: 'Bangalore',
    type: 'Remote',
    experience: 'Mid',
    salaryMin: 1400000,
    salaryMax: 2000000,
    currency: 'INR',
    tags: ['React', 'Node.js', 'MongoDB', 'REST APIs', 'Jest'],
    description: `<h3>About the Role</h3>
<p>Postman is the world's leading API development platform, used by over 20 million developers. As a Full Stack Developer, you'll build features across the web app, contributing to tools that simplify API development for teams worldwide.</p>

<h3>Responsibilities</h3>
<ul>
<li>Develop full-stack features using React frontend and Node.js backend</li>
<li>Design and implement RESTful APIs and database schemas</li>
<li>Write comprehensive tests using Jest and integration testing frameworks</li>
<li>Participate in code reviews and contribute to engineering best practices</li>
</ul>

<h3>Requirements</h3>
<ul>
<li>3+ years of full stack development experience</li>
<li>Proficiency in React, Node.js, and MongoDB/PostgreSQL</li>
<li>Experience building and documenting REST APIs</li>
<li>Familiarity with CI/CD, testing practices, and agile methodologies</li>
</ul>`,
    postedAt: daysAgo(8),
    employerId: 'emp-009',
  },
  {
    id: 'job-010',
    title: 'Engineering Manager',
    company: 'BrowserStack',
    companyLogo: null,
    location: 'Mumbai',
    type: 'Full-time',
    experience: 'Lead',
    salaryMin: 3500000,
    salaryMax: 5000000,
    currency: 'INR',
    tags: ['Engineering Leadership', 'Agile', 'System Design', 'Team Building', 'Mentoring'],
    description: `<h3>About the Role</h3>
<p>BrowserStack is the world's leading testing infrastructure platform, trusted by over 50,000 companies. As an Engineering Manager, you'll lead a team of 8–12 engineers, driving technical strategy and execution for our core testing platform.</p>

<h3>Responsibilities</h3>
<ul>
<li>Lead, mentor, and grow a high-performing engineering team</li>
<li>Drive technical architecture decisions and ensure code quality standards</li>
<li>Partner with product and design to plan sprints, roadmaps, and OKRs</li>
<li>Establish engineering best practices, processes, and a strong team culture</li>
</ul>

<h3>Requirements</h3>
<ul>
<li>8+ years of software engineering experience, with 3+ in people management</li>
<li>Strong system design and architecture skills</li>
<li>Experience hiring, onboarding, and growing engineering teams</li>
<li>Excellent communication, stakeholder management, and conflict resolution skills</li>
</ul>`,
    postedAt: daysAgo(4),
    employerId: 'emp-010',
  },
  {
    id: 'job-011',
    title: 'React Native Developer',
    company: 'Urban Company',
    companyLogo: null,
    location: 'Delhi',
    type: 'Full-time',
    experience: 'Mid',
    salaryMin: 1200000,
    salaryMax: 1800000,
    currency: 'INR',
    tags: ['React Native', 'JavaScript', 'Redux', 'Native Modules'],
    description: `<h3>About the Role</h3>
<p>Urban Company is India's leading home services marketplace. As a React Native Developer, you'll build and maintain the consumer and professional apps used by millions, delivering seamless booking and service experiences.</p>

<h3>Responsibilities</h3>
<ul>
<li>Develop and maintain cross-platform mobile features using React Native</li>
<li>Bridge native modules for platform-specific functionality</li>
<li>Optimize app performance including bundle size, rendering, and navigation</li>
<li>Work with backend engineers to design and integrate APIs</li>
</ul>

<h3>Requirements</h3>
<ul>
<li>3+ years of experience in React Native mobile development</li>
<li>Strong JavaScript/TypeScript fundamentals and state management expertise</li>
<li>Experience with native module bridging (iOS/Android)</li>
<li>Published apps on App Store and Google Play</li>
</ul>`,
    postedAt: daysAgo(20),
    employerId: 'emp-011',
  },
  {
    id: 'job-012',
    title: 'Machine Learning Engineer',
    company: 'Sarvam AI',
    companyLogo: null,
    location: 'Bangalore',
    type: 'Full-time',
    experience: 'Senior',
    salaryMin: 2000000,
    salaryMax: 3000000,
    currency: 'INR',
    tags: ['PyTorch', 'NLP', 'Transformers', 'MLOps', 'Python'],
    description: `<h3>About the Role</h3>
<p>Sarvam AI is building foundational AI models for Indian languages. As a Machine Learning Engineer, you'll work on cutting-edge NLP research and engineering — training large language models, building inference pipelines, and shipping AI products that serve a billion Indians.</p>

<h3>Responsibilities</h3>
<ul>
<li>Train and fine-tune large language models for Indian language understanding</li>
<li>Build robust ML pipelines using PyTorch and distributed training frameworks</li>
<li>Implement efficient inference systems for production deployment</li>
<li>Contribute to research in multilingual NLP, ASR, and TTS systems</li>
</ul>

<h3>Requirements</h3>
<ul>
<li>5+ years of ML engineering experience with deep learning focus</li>
<li>Expert proficiency in PyTorch and the Hugging Face ecosystem</li>
<li>Publications or significant contributions in NLP, ASR, or related fields</li>
<li>Experience with MLOps practices and large-scale distributed training</li>
</ul>`,
    postedAt: daysAgo(6),
    employerId: 'emp-012',
  },
];

// Mutable copy for CRUD operations
export let jobs = [...seedJobs];

// Applications store
export let applications = [];

// Seed users for auth
export const seedUsers = [
  {
    id: 'user-jobseeker-1',
    name: 'Arjun Mehta',
    email: 'arjun@example.com',
    password: 'password123',
    role: 'jobseeker',
  },
  {
    id: 'user-employer-1',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'password123',
    role: 'employer',
  },
];

// Reset helpers (useful for tests)
export function resetJobs() {
  jobs = [...seedJobs];
}

export function resetApplications() {
  applications = [];
}
