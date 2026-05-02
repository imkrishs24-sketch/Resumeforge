export interface ResumeExample {
  id: string;
  role: string;
  industry: string;
  description: string;
  content: string;
}

export const EXAMPLES: ResumeExample[] = [
  {
    id: "software-engineer",
    role: "Software Engineer",
    industry: "Technology",
    description: "Full-stack engineer with React and Node.js expertise",
    content: `ALEX JOHNSON
alex.johnson@email.com | (555) 100-2000 | github.com/alexjohnson | Seattle, WA

SUMMARY
Full-stack Software Engineer with 4 years of experience building scalable web applications. Proficient in React, TypeScript, Node.js, and AWS. Passionate about clean architecture and developer tooling.

EXPERIENCE

Software Engineer II | CloudCo | 2022 – Present
- Developed React dashboard reducing customer support tickets by 34%
- Designed REST API handling 100K+ daily requests with 99.9% uptime
- Implemented automated testing suite increasing code coverage from 40% to 88%
- Technologies: TypeScript, React, Node.js, PostgreSQL, Redis, AWS Lambda

Software Engineer | WebAgency | 2020 – 2022
- Built 15+ client websites generating $2.4M in combined revenue
- Reduced average page load time by 52% through performance optimization

EDUCATION
B.S. Computer Science | University of Washington | 2020

SKILLS
TypeScript, JavaScript, React, Node.js, Python, PostgreSQL, MongoDB, AWS, Docker, Git`,
  },
  {
    id: "data-analyst",
    role: "Data Analyst",
    industry: "Analytics",
    description: "Data analyst with Python and SQL proficiency",
    content: `PRIYA KUMAR
priya.kumar@email.com | (555) 200-3000 | linkedin.com/in/priyakumar | Austin, TX

SUMMARY
Data Analyst with 3 years of experience transforming complex datasets into actionable business insights. Expert in Python, SQL, and Tableau. Proven ability to influence product decisions through data storytelling.

EXPERIENCE

Senior Data Analyst | RetailCorp | 2022 – Present
- Built revenue forecasting model with 91% accuracy, informing $15M inventory decisions
- Designed 8 executive dashboards in Tableau tracking 40+ KPIs
- Identified customer segmentation opportunity worth $2.1M in incremental revenue
- Automated weekly reporting pipeline saving 12 hours per week

Data Analyst | InsuranceCo | 2021 – 2022
- Analyzed claims data to identify $800K in fraudulent activity
- Developed churn prediction model with 85% precision

EDUCATION
B.S. Statistics | UT Austin | 2021

SKILLS
Python (Pandas, NumPy, scikit-learn), SQL, R, Tableau, Power BI, Excel, A/B Testing, Statistics`,
  },
  {
    id: "teacher",
    role: "Teacher",
    industry: "Education",
    description: "High school STEM teacher with curriculum development experience",
    content: `CHRISTOPHER WADE
c.wade@email.com | (555) 300-4000 | Chicago, IL

SUMMARY
Dedicated high school Mathematics and Computer Science teacher with 7 years of experience. Consistently achieves student test scores 20% above district average. Skilled in differentiated instruction, project-based learning, and EdTech integration.

EXPERIENCE

High School Math & CS Teacher | Lincoln High School | 2017 – Present
- Teach AP Calculus BC, Algebra II, and Introduction to Computer Science
- AP pass rate: 89% (district average: 67%) over 3 consecutive years
- Developed coding curriculum adopted by 4 other schools in the district
- Founded after-school robotics club growing from 8 to 45 students
- Received "Teacher of the Year" award in 2022

Student Teacher | Jefferson Middle School | 2016 – 2017
- Completed full-time student teaching placement under Master Teacher supervision

EDUCATION
M.Ed. Curriculum & Instruction | DePaul University | 2017
B.S. Mathematics | University of Illinois | 2016

CERTIFICATIONS
Illinois Professional Educator License | AP Calculus Certified | Google Certified Educator

SKILLS
Curriculum Development, Differentiated Instruction, Google Classroom, Canvas LMS, Python, Scratch`,
  },
  {
    id: "nurse",
    role: "Registered Nurse",
    industry: "Healthcare",
    description: "ICU nurse with critical care and patient management skills",
    content: `JESSICA TORRES
jessica.torres@email.com | (555) 400-5000 | Houston, TX
License: TX RN #1234567

SUMMARY
Compassionate and skilled Registered Nurse with 6 years of experience in ICU and critical care settings. Proven ability to manage high-acuity patients, mentor junior staff, and maintain exceptional patient satisfaction scores.

EXPERIENCE

ICU Registered Nurse | Houston Medical Center | 2019 – Present
- Manage 2–3 critically ill patients per shift in 24-bed surgical ICU
- Achieved 97% patient satisfaction score, highest on unit (2023)
- Trained and onboarded 12 new nurses, reducing orientation time by 2 weeks
- Charge nurse responsibilities 2× per week for 20-nurse team

Registered Nurse, Med/Surg | Community Hospital | 2018 – 2019
- Provided care for 6–7 patients per shift in 32-bed medical-surgical unit

EDUCATION
Bachelor of Science in Nursing | University of Houston | 2018
GPA: 3.7 / 4.0

CERTIFICATIONS
CCRN (Critical Care Registered Nurse) | BLS, ACLS, PALS | NIH Stroke Scale

SKILLS
Critical Care, Ventilator Management, Hemodynamic Monitoring, EPIC, Patient Education`,
  },
  {
    id: "marketing",
    role: "Marketing Manager",
    industry: "Marketing",
    description: "Digital marketing manager with paid media and SEO expertise",
    content: `SAM ALLEN
sam.allen@email.com | (555) 500-6000 | New York, NY

SUMMARY
Performance-driven Marketing Manager with 5 years of experience leading B2B and B2C campaigns. Expert in digital marketing, paid media, and marketing analytics. Track record of delivering 3–5x ROAS across channels.

EXPERIENCE

Marketing Manager | SaaS Company | 2021 – Present
- Own $1.8M annual digital advertising budget across Google, Meta, and LinkedIn
- Reduced CAC by 31% through audience optimization and creative testing
- Grew organic search traffic 180% in 12 months through SEO content strategy
- Launched email nurture program achieving 42% open rate (industry avg: 21%)

Digital Marketing Specialist | eCommerce Brand | 2019 – 2021
- Managed $600K paid social budget, achieving 4.2x ROAS
- Built influencer program generating $450K in attributed revenue

EDUCATION
B.S. Marketing | Penn State | 2019

CERTIFICATIONS
Google Ads Certified | Meta Blueprint Certified | HubSpot Content Marketing

SKILLS
Google Ads, Meta Ads, SEO, HubSpot, Salesforce, Marketo, SQL, Google Analytics 4, Copywriting`,
  },
  {
    id: "project-manager",
    role: "Project Manager",
    industry: "Management",
    description: "PMP-certified project manager with Agile expertise",
    content: `DREW MARTIN
drew.martin@email.com | (555) 600-7000 | Denver, CO

SUMMARY
PMP-certified Project Manager with 8 years of experience delivering complex technology and operational projects on time and within budget. Expert in Agile and waterfall methodologies. Strong stakeholder management across all levels.

EXPERIENCE

Senior Project Manager | TechFirm | 2020 – Present
- Led portfolio of 6 concurrent projects totaling $12M budget
- Delivered company's largest ERP implementation ($4.2M) 3 weeks early and 8% under budget
- Improved team velocity by 40% through Agile transformation initiative
- Managed cross-functional teams of 25+ across 3 time zones

Project Manager | ConsultingCo | 2016 – 2020
- Managed 20+ projects for Fortune 500 clients with 96% on-time delivery rate
- Built PMO framework adopted company-wide, reducing project failure rate by 28%

EDUCATION
B.S. Business Administration | University of Denver | 2016

CERTIFICATIONS
PMP (Project Management Professional) | CSM (Certified ScrumMaster) | ITIL Foundation

SKILLS
Project Management, Agile/Scrum, JIRA, MS Project, Stakeholder Management, Risk Management, Budgeting`,
  },
  {
    id: "customer-service",
    role: "Customer Service Rep",
    industry: "Customer Service",
    description: "Customer success specialist with CRM and escalation experience",
    content: `NINA BROOKS
nina.brooks@email.com | (555) 700-8000 | Phoenix, AZ

SUMMARY
Customer Service professional with 4 years of experience in high-volume contact center and SaaS customer success environments. Consistent top performer maintaining 95%+ CSAT. Skilled in conflict resolution, CRM management, and team training.

EXPERIENCE

Senior Customer Service Representative | SaaS Platform | 2021 – Present
- Handle 60+ customer interactions daily via phone, email, and live chat
- Maintain 96.2% CSAT score (team average: 88%) for 18 consecutive months
- Resolved 100% of escalated cases within 24-hour SLA
- Trained 8 new team members on product knowledge and support procedures

Customer Service Representative | Retail Chain | 2020 – 2021
- Managed returns, complaints, and escalations for high-traffic store
- Recognized as "Employee of the Month" 3 times for exceptional service

EDUCATION
A.S. Business Management | Phoenix College | 2020

SKILLS
Zendesk, Salesforce Service Cloud, Intercom, Conflict Resolution, CRM, Live Chat, Product Training`,
  },
  {
    id: "accountant",
    role: "Accountant",
    industry: "Finance",
    description: "CPA with public accounting and financial reporting background",
    content: `RYAN PATEL
ryan.patel@email.com | (555) 800-9000 | Boston, MA

SUMMARY
Certified Public Accountant with 5 years of experience in public accounting and corporate finance. Expert in GAAP financial reporting, tax compliance, and audit preparation. Strong analytical skills with advanced Excel and ERP proficiency.

EXPERIENCE

Senior Accountant | Manufacturing Corp | 2022 – Present
- Manage monthly close process for $85M revenue company, reducing close time by 3 days
- Prepare consolidated financial statements in compliance with US GAAP
- Lead annual audit process coordinating with Big 4 auditors
- Identified $340K in tax savings opportunities through R&D tax credit analysis

Staff Accountant | KPMG | 2019 – 2022
- Performed audits for 8 publicly-traded clients across manufacturing and retail sectors
- Prepared federal and state tax returns for entities with $10M–$500M revenue

EDUCATION
B.S. Accounting | Northeastern University | 2019
GPA: 3.9 / 4.0

CERTIFICATIONS
CPA (Certified Public Accountant) | CMA (Certified Management Accountant)

SKILLS
GAAP, Financial Reporting, Tax Compliance, Excel (Advanced), QuickBooks, SAP, Audit, Budgeting`,
  },
  {
    id: "student",
    role: "Recent Graduate",
    industry: "Entry Level",
    description: "Business graduate seeking first professional role",
    content: `JORDAN LEE
jordan.lee@email.com | (555) 900-0100 | Columbus, OH | linkedin.com/in/jordanlee

EDUCATION
Bachelor of Business Administration, Marketing | Ohio State University | May 2024
GPA: 3.78 / 4.0 | Dean's List (6 semesters) | Beta Gamma Sigma Honor Society

EXPERIENCE

Marketing Intern | StartupCo | Summer 2023
- Assisted with social media management growing Instagram following by 2,200 followers in 10 weeks
- Analyzed campaign performance data and prepared weekly reports for marketing director
- Contributed to email marketing campaign achieving 38% open rate

Brand Ambassador | Ohio State Athletics | 2022 – 2024
- Represented university brand at 20+ on-campus and community events
- Developed promotional content reaching 5,000+ students per week

CAMPUS LEADERSHIP
Vice President | American Marketing Association, OSU Chapter | 2023 – 2024
- Organized 12 professional development events with 200+ total attendees
- Secured 4 corporate sponsors for annual marketing summit

PROJECTS
Consumer Behavior Research Study | Professor Smith, Marketing Dept.
- Analyzed purchasing behavior of 500+ Gen Z consumers, presented findings at undergraduate symposium

SKILLS
Microsoft Office (Advanced), Google Analytics, Canva, HubSpot (certified), Social Media, Public Speaking`,
  },
  {
    id: "sales",
    role: "Sales Representative",
    industry: "Sales",
    description: "B2B SaaS sales rep with quota-crushing track record",
    content: `TYLER ROSS
tyler.ross@email.com | (555) 010-1100 | Chicago, IL

SUMMARY
High-performing B2B SaaS Sales Representative with 4 years of experience consistently exceeding quota. Expert in full-cycle enterprise sales, outbound prospecting, and C-suite engagement. Average deal size $45K ARR.

EXPERIENCE

Account Executive | SaaS Company | 2022 – Present
- 143% of quota in 2023 ($1.8M against $1.26M target), ranked #2 of 28 AEs
- 127% of quota in 2022, promoted from SDR in 6 months (fastest in company history)
- Average sales cycle: 47 days (team average: 71 days)
- Closed 3 enterprise deals >$200K ARR including largest deal in company history ($380K)

Sales Development Representative | SaaS Company | 2021 – 2022
- Generated $2.1M in pipeline through outbound prospecting
- Booked 42 qualified meetings per month (quota: 25)

Sales Associate | Insurance Firm | 2020 – 2021
- Exceeded monthly sales targets by average of 35%

EDUCATION
B.S. Business, Sales & Marketing | Indiana University | 2020

SKILLS
Salesforce, Outreach, HubSpot, LinkedIn Sales Navigator, Cold Calling, Negotiation, Forecasting`,
  },
];
