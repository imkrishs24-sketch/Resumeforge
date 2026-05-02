export interface ResumeTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  atsOptimized: boolean;
  accentColor: string;
  headerBg: string;
  layout: "single" | "two-col" | "sidebar";
  sampleText: string;
}

export const TEMPLATES: ResumeTemplate[] = [
  {
    id: "modern",
    name: "Modern",
    category: "Modern",
    description: "Clean sidebar layout with a bold accent color header.",
    atsOptimized: true,
    accentColor: "#7c3aed",
    headerBg: "#4c1d95",
    layout: "sidebar",
    sampleText: `ALEX MORGAN
alex.morgan@email.com | (555) 012-3456 | linkedin.com/in/alexmorgan | San Francisco, CA

PROFESSIONAL SUMMARY
Results-driven professional with 6+ years of experience delivering high-impact solutions. Proven track record of increasing team productivity by 35% and reducing operational costs through strategic process improvements.

EXPERIENCE
Senior Product Manager | Acme Corp | 2021 – Present
- Led cross-functional team of 12 to ship 4 major product features, growing MAU by 28%
- Defined and executed product roadmap aligned with $5M annual revenue targets
- Reduced customer churn by 18% through data-driven feature prioritization

Product Manager | StartupXYZ | 2018 – 2021
- Launched mobile app reaching 100K downloads in first 3 months
- Collaborated with engineering to cut release cycle from 6 weeks to 2 weeks

EDUCATION
B.S. Computer Science | UC Berkeley | 2018

SKILLS
Product Strategy, Agile/Scrum, SQL, Figma, JIRA, A/B Testing, Stakeholder Management`,
  },
  {
    id: "minimal",
    name: "Minimal",
    category: "Minimal",
    description: "Ultra-clean single column with elegant typography.",
    atsOptimized: true,
    accentColor: "#374151",
    headerBg: "#111827",
    layout: "single",
    sampleText: `JAMIE SCOTT
jamie.scott@email.com  ·  (555) 234-5678  ·  New York, NY

EXPERIENCE

Marketing Director  |  BrandCo  |  2020 – Present
Oversaw $2M annual marketing budget across digital, print, and event channels. Grew organic traffic 210% via SEO-first content strategy. Built and managed a team of 8 marketing professionals.

Senior Marketing Manager  |  RetailGroup  |  2017 – 2020
Launched 12 seasonal campaigns generating $8.4M in attributed revenue. Reduced CAC by 22% through channel mix optimization.

Content Manager  |  MediaHouse  |  2015 – 2017
Produced 200+ long-form articles ranking on page 1 for competitive keywords.

EDUCATION
M.B.A. Marketing  |  NYU Stern  |  2015
B.A. Communications  |  Boston University  |  2013

SKILLS
Brand Strategy, Content Marketing, SEO/SEM, Google Analytics, HubSpot, Copywriting`,
  },
  {
    id: "professional",
    name: "Professional",
    category: "Professional",
    description: "Traditional format trusted by Fortune 500 recruiters.",
    atsOptimized: true,
    accentColor: "#1e40af",
    headerBg: "#1e3a8a",
    layout: "single",
    sampleText: `MORGAN TAYLOR
Morgan.Taylor@email.com | 555-345-6789 | LinkedIn: linkedin.com/in/morgantaylor | Chicago, IL

OBJECTIVE
Accomplished finance professional with 8 years of experience in financial analysis, budgeting, and strategic planning, seeking a Senior Financial Analyst role at a growth-stage company.

PROFESSIONAL EXPERIENCE

Senior Financial Analyst | GlobalBank | January 2020 – Present
• Managed $120M investment portfolio with 14.2% annual return, outperforming benchmark by 3.1%
• Prepared monthly financial reports and variance analysis for C-suite review
• Led implementation of new FP&A software reducing close cycle from 10 days to 4 days

Financial Analyst | RegionalBank | June 2016 – December 2019
• Built DCF and LBO models for 20+ M&A transactions totaling $2.3B in deal value
• Automated monthly reporting process saving 40 hours of manual work per month

EDUCATION
M.S. Finance | University of Chicago Booth School of Business | 2016
B.S. Accounting | University of Illinois | 2014 | GPA: 3.8/4.0

CERTIFICATIONS
CFA Level III | CPA

SKILLS
Financial Modeling, Excel (Advanced), Bloomberg Terminal, SQL, SAP, Python (Pandas)`,
  },
  {
    id: "executive",
    name: "Executive",
    category: "Executive",
    description: "Commanding two-column design built for senior leaders.",
    atsOptimized: false,
    accentColor: "#92400e",
    headerBg: "#78350f",
    layout: "two-col",
    sampleText: `JORDAN REEVES
Chief Technology Officer
jordan.reeves@email.com | 555-456-7890 | San Jose, CA | linkedin.com/in/jordanreeves

EXECUTIVE PROFILE
Visionary technology leader with 18 years of experience scaling engineering organizations from startup to IPO. Track record of building and managing $50M+ technology budgets, 200+ person engineering teams, and delivering platforms serving 50M+ users.

LEADERSHIP EXPERIENCE

Chief Technology Officer | TechUnicorn Inc. | 2018 – Present
- Scaled engineering team from 25 to 180 engineers across 4 global offices
- Architected platform migration to microservices reducing infrastructure costs by $4.2M annually
- Led $180M Series C raise, serving as technical diligence lead with investors
- Grew platform to 50M users with 99.99% uptime SLA

VP of Engineering | GrowthCo | 2014 – 2018
- Built and led 80-person engineering organization
- Delivered 3 major platform launches contributing to 3x revenue growth

BOARD & ADVISORY
- Technical Advisor, Y Combinator Portfolio Company (2021–present)
- Board Member, Tech Diversity Initiative (2020–present)

EDUCATION
M.S. Computer Science | Stanford University | 2006
B.S. Electrical Engineering | MIT | 2004`,
  },
  {
    id: "ats-friendly",
    name: "ATS-Friendly",
    category: "ATS-Friendly",
    description: "Maximally parseable — zero formatting traps for ATS systems.",
    atsOptimized: true,
    accentColor: "#065f46",
    headerBg: "#064e3b",
    layout: "single",
    sampleText: `SAM CHEN
sam.chen@email.com
555-567-8901
Seattle, WA
linkedin.com/in/samchen

WORK EXPERIENCE

Software Engineer | Amazon | 2021 to Present
- Developed and maintained 3 high-traffic microservices handling 50,000 requests per second
- Reduced API latency by 40% through query optimization and caching strategies
- Mentored 2 junior engineers and conducted 30+ technical interviews
- Technologies: Java, Python, AWS, DynamoDB, Kafka, Docker

Software Engineer | Microsoft | 2018 to 2021
- Built REST APIs consumed by 5M+ users monthly
- Improved test coverage from 45% to 92%, reducing production incidents by 60%
- Technologies: C#, .NET, Azure, SQL Server, React

EDUCATION

Bachelor of Science in Computer Science
University of Washington
Graduated 2018
GPA 3.7

TECHNICAL SKILLS
Programming: Java, Python, C#, JavaScript, TypeScript
Cloud: AWS, Azure, GCP
Databases: PostgreSQL, DynamoDB, Redis, MongoDB
Tools: Docker, Kubernetes, Jenkins, Git, Terraform`,
  },
  {
    id: "software-engineer",
    name: "Software Engineer",
    category: "Software Engineer",
    description: "Technical-first layout built for engineering roles.",
    atsOptimized: true,
    accentColor: "#0369a1",
    headerBg: "#0c4a6e",
    layout: "single",
    sampleText: `RILEY KIM
riley.kim@dev.io | GitHub: github.com/rileykim | (555) 678-9012 | Remote

SUMMARY
Full-stack engineer with 5 years building scalable web applications. Specialize in React, Node.js, and cloud-native architectures. Passionate about clean code, performance, and developer experience.

TECHNICAL EXPERIENCE

Senior Software Engineer | FinTech Startup | 2022 – Present
- Architected and shipped real-time trading dashboard processing 10K events/second using React + WebSockets
- Reduced frontend bundle size by 58% through code splitting and lazy loading
- Built CI/CD pipeline reducing deployment time from 45 minutes to 8 minutes
- Stack: TypeScript, React, Next.js, Node.js, PostgreSQL, Redis, AWS

Software Engineer | SaaS Platform | 2019 – 2022
- Developed REST and GraphQL APIs serving 2M+ daily active users
- Migrated monolith to microservices architecture, improving deployment frequency by 400%
- Stack: JavaScript, Vue.js, Express, MongoDB, Docker, GCP

OPEN SOURCE
- contributor to open-source state management library (2.1K GitHub stars)
- maintainer of developer tooling CLI used by 800+ developers

EDUCATION
B.S. Software Engineering | Georgia Tech | 2019

SKILLS
TypeScript, JavaScript, React, Next.js, Node.js, Python, PostgreSQL, Redis, AWS, Docker, Kubernetes`,
  },
  {
    id: "student",
    name: "Student",
    category: "Student",
    description: "Education-forward layout for new graduates and interns.",
    atsOptimized: true,
    accentColor: "#7e22ce",
    headerBg: "#581c87",
    layout: "single",
    sampleText: `CASEY PARK
casey.park@university.edu | (555) 789-0123 | linkedin.com/in/caseypark | Boston, MA

EDUCATION
Bachelor of Science in Data Science | Boston University | Expected May 2025
GPA: 3.82 / 4.0 | Dean's List (All Semesters)
Relevant Coursework: Machine Learning, Data Structures, Statistical Analysis, Database Systems

EXPERIENCE

Data Science Intern | TechCorp | Summer 2024
- Built predictive model for customer churn achieving 89% accuracy using Python (scikit-learn)
- Analyzed 2M+ row dataset to identify $1.2M revenue opportunity, presented to VP of Analytics
- Automated weekly reporting pipeline saving 8 hours of manual work per week

Research Assistant | BU Data Lab | 2023 – Present
- Assisting Professor Smith with NLP research on social media sentiment analysis
- Co-authored paper accepted to undergraduate research conference

PROJECTS
Stock Price Predictor | Python, LSTM, Pandas, yFinance
- Built LSTM neural network forecasting stock prices with 76% directional accuracy

Campus Event App | React, Node.js, MongoDB
- Developed full-stack app with 400+ active student users

SKILLS
Python, R, SQL, Machine Learning, TensorFlow, Pandas, NumPy, Tableau, Excel, Git`,
  },
  {
    id: "creative",
    name: "Creative",
    category: "Creative",
    description: "Bold header band for design and creative professionals.",
    atsOptimized: false,
    accentColor: "#be185d",
    headerBg: "#9d174d",
    layout: "sidebar",
    sampleText: `AVERY BROOKS
Creative Director
avery.brooks@design.io | (555) 890-1234 | Portfolio: averybrooks.design | Los Angeles, CA

ABOUT
Award-winning creative director with 10 years crafting brand identities and visual narratives for global companies. Expert in translating complex ideas into compelling visual experiences that drive measurable business results.

EXPERIENCE

Creative Director | DesignStudio LA | 2020 – Present
- Led rebranding of 3 Fortune 500 clients, each resulting in 20%+ brand awareness lift
- Directed team of 6 designers, 2 copywriters, and 3 motion artists
- Won 4 Cannes Lions and 2 D&AD Pencils for campaign work
- Drove $3.2M in new business through award-winning pitch work

Senior Art Director | AgencyNYC | 2016 – 2020
- Concepted and executed 50+ integrated campaigns across digital, OOH, and broadcast
- Collaborated with P&G, Nike, and Apple on global product launches

EDUCATION
B.F.A. Graphic Design | Art Center College of Design | 2014

AWARDS
Cannes Lions Gold (2023, 2022), D&AD Yellow Pencil (2021), One Show Pencil (2020)

SKILLS
Brand Strategy, Art Direction, Adobe CC, Figma, Motion Design, Campaign Concepting, Team Leadership`,
  },
  {
    id: "corporate",
    name: "Corporate",
    category: "Corporate",
    description: "Classic structured layout for traditional industries.",
    atsOptimized: true,
    accentColor: "#1f2937",
    headerBg: "#111827",
    layout: "single",
    sampleText: `TAYLOR NGUYEN
taylor.nguyen@email.com | (555) 901-2345 | LinkedIn | New York, NY

PROFESSIONAL EXPERIENCE

Vice President, Operations | Global Corp | 2019 – Present
Oversee daily operations across 4 regional offices with combined P&L of $45M. Lead a team of 3 directors and 40 indirect reports. Achieved 98.4% SLA compliance across all service lines. Reduced operating costs by $3.1M through vendor consolidation and process standardization.

Director, Operations | MidMarket Co | 2015 – 2019
Managed operations for $22M business unit. Implemented ERP system reducing order processing time by 65%. Negotiated vendor contracts saving $850K annually. Promoted from Senior Manager within 18 months.

Senior Operations Manager | SmallCo | 2012 – 2015
Supervised 15 direct reports across logistics, procurement, and facilities functions.

EDUCATION
M.B.A., Operations Management | Columbia Business School | 2012
B.S., Industrial Engineering | Cornell University | 2010

CERTIFICATIONS
PMP (Project Management Professional) | Six Sigma Black Belt | APICS CPIM

CORE COMPETENCIES
Operations Management, P&L Oversight, Process Improvement, Team Leadership, Vendor Relations, ERP Systems`,
  },
  {
    id: "elegant",
    name: "Elegant",
    category: "Elegant",
    description: "Refined serif-inspired design for law, finance, and consulting.",
    atsOptimized: false,
    accentColor: "#92400e",
    headerBg: "#451a03",
    layout: "single",
    sampleText: `MORGAN HAYES
morgan.hayes@legal.com  |  (555) 012-3456  |  Washington, D.C.

PROFESSIONAL EXPERIENCE

Associate Attorney | Prestige Law LLP | 2020 – Present
Advise Fortune 100 clients on complex M&A transactions and securities offerings. Led due diligence for $820M acquisition closing. Drafted and negotiated transaction documents for 15+ deals totaling $2.1B in aggregate value. Recognized as Rising Star in 2023 Legal 500 rankings.

Law Clerk | U.S. District Court, D.C. Circuit | 2019 – 2020
Assisted Judge Williams in preparing opinions for federal civil litigation matters. Researched and drafted bench memoranda for complex securities fraud and antitrust cases.

EDUCATION
J.D., cum laude | Georgetown University Law Center | 2019
Law Review Editor | Moot Court Champion
B.A., Political Science, summa cum laude | Yale University | 2016

BAR ADMISSIONS
District of Columbia | New York | U.S. District Court for the District of Columbia

PUBLICATIONS
"Navigating Material Adverse Change Clauses Post-Pandemic" — Harvard Business Law Review, 2022`,
  },
];
