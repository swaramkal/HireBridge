import { db, candidatesTable, companiesTable, jobsTable, applicationsTable } from "@workspace/db";
import { logger } from "./lib/logger";

export async function seedIfEmpty(): Promise<void> {
  const existing = await db.select().from(candidatesTable).limit(1);
  if (existing.length > 0) return;

  logger.info("Database is empty — seeding sample data");

  const [c1, c2, c3, c4] = await db
    .insert(candidatesTable)
    .values([
      {
        fullName: "Swaramkal",
        email: "swaramkal@gmail.com",
        phone: "+91 98765 43210",
        location: "Bangalore, Karnataka",
        qualification: "B.Tech Computer Science",
        skills: "React, Node.js, TypeScript, PostgreSQL",
        objective: "Passionate full-stack developer with 3 years of experience building scalable web applications.",
        status: "approved",
      },
      {
        fullName: "Priya Nair",
        email: "priya.nair@email.com",
        phone: "+91 87654 32109",
        location: "Mumbai, Maharashtra",
        qualification: "MBA Finance",
        skills: "Financial Analysis, Excel, Python, SAP",
        objective: "Results-driven finance professional with expertise in data analysis and financial modeling.",
        status: "approved",
      },
      {
        fullName: "Ravi Kumar",
        email: "ravi.kumar@email.com",
        phone: "+91 76543 21098",
        location: "Chennai, Tamil Nadu",
        qualification: "B.Sc Computer Science",
        skills: "Python, Django, MySQL, Docker",
        objective: "Backend developer specializing in Python and cloud infrastructure.",
        status: "pending",
      },
      {
        fullName: "Sneha Reddy",
        email: "sneha.reddy@email.com",
        phone: "+91 65432 10987",
        location: "Hyderabad, Telangana",
        qualification: "B.Tech Electronics",
        skills: "Python, Machine Learning, TensorFlow, Data Analysis",
        objective: "ML engineer passionate about building intelligent systems.",
        status: "approved",
      },
    ])
    .returning();

  const [comp1, comp2, comp3] = await db
    .insert(companiesTable)
    .values([
      {
        name: "TechNova Solutions",
        email: "hr@technova.io",
        industry: "Information Technology",
        description: "We build cutting-edge cloud infrastructure and SaaS platforms for enterprise clients.",
        website: "technova.io",
        status: "approved",
      },
      {
        name: "FinEdge Capital",
        email: "careers@finedge.com",
        industry: "Finance & Banking",
        description: "A leading fintech firm specializing in algorithmic trading and wealth management.",
        website: "finedge.com",
        status: "approved",
      },
      {
        name: "BridgeConnect HR",
        email: "info@bridgeconnect.com",
        industry: "Human Resources",
        description: "India's leading HR consulting firm specializing in executive placements and talent management.",
        website: "bridgeconnect.com",
        status: "pending",
      },
    ])
    .returning();

  const [j1, j2, j3, j4, j5] = await db
    .insert(jobsTable)
    .values([
      {
        title: "Senior React Developer",
        companyId: comp1.id,
        companyName: comp1.name,
        skills: "React, TypeScript, Node.js, GraphQL",
        type: "IT",
        description: "Lead frontend development for our enterprise SaaS product.",
        location: "Bangalore",
        salary: "18-25 LPA",
      },
      {
        title: "Backend Engineer - Node.js",
        companyId: comp1.id,
        companyName: comp1.name,
        skills: "Node.js, PostgreSQL, Docker, Kubernetes",
        type: "IT",
        description: "Build and maintain scalable microservices.",
        location: "Remote",
        salary: "15-22 LPA",
      },
      {
        title: "Financial Analyst",
        companyId: comp2.id,
        companyName: comp2.name,
        skills: "Excel, Python, Financial Modeling, Bloomberg",
        type: "NonIT",
        description: "Analyze financial data and build models for trading strategies.",
        location: "Mumbai",
        salary: "12-18 LPA",
      },
      {
        title: "HR Executive",
        companyId: comp3.id,
        companyName: comp3.name,
        skills: "Recruitment, HRMS, Communication, Talent Acquisition",
        type: "NonIT",
        description: "Handle end-to-end recruitment for our clients across industries.",
        location: "Pune",
        salary: "4-6 LPA",
      },
      {
        title: "Full Stack Developer",
        companyId: comp1.id,
        companyName: comp1.name,
        skills: "React, Node.js, MongoDB, AWS",
        type: "IT",
        description: "Join our product team to build modern web applications.",
        location: "Bangalore",
        salary: "12-18 LPA",
      },
    ])
    .returning();

  await db.insert(applicationsTable).values([
    {
      candidateId: c1.id,
      jobId: j1.id,
      candidateName: c1.fullName,
      jobTitle: j1.title,
      companyName: comp1.name,
      status: "reviewed",
    },
    {
      candidateId: c1.id,
      jobId: j5.id,
      candidateName: c1.fullName,
      jobTitle: j5.title,
      companyName: comp1.name,
      status: "pending",
    },
    {
      candidateId: c4.id,
      jobId: j2.id,
      candidateName: c4.fullName,
      jobTitle: j2.title,
      companyName: comp1.name,
      status: "accepted",
    },
    {
      candidateId: c2.id,
      jobId: j3.id,
      candidateName: c2.fullName,
      jobTitle: j3.title,
      companyName: comp2.name,
      status: "pending",
    },
  ]);

  logger.info("Seeding complete");
}
