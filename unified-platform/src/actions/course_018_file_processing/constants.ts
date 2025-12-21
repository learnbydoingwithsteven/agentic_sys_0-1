// Sample file contents for demo (not a server action file)
export const SAMPLE_FILES = {
    csv: `name,age,department,salary
John Doe,32,Engineering,95000
Jane Smith,28,Marketing,78000
Bob Johnson,45,Sales,82000
Alice Williams,35,Engineering,105000
Charlie Brown,29,HR,65000`,

    json: `{
  "employees": [
    {
      "id": 1,
      "name": "John Doe",
      "position": "Senior Engineer",
      "skills": ["JavaScript", "Python", "React"],
      "yearsExperience": 8
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "position": "Marketing Manager",
      "skills": ["SEO", "Content Strategy", "Analytics"],
      "yearsExperience": 5
    },
    {
      "id": 3,
      "name": "Bob Johnson",
      "position": "Sales Director",
      "skills": ["Negotiation", "CRM", "Team Leadership"],
      "yearsExperience": 12
    }
  ],
  "company": "TechCorp Inc.",
  "lastUpdated": "2024-12-21"
}`,

    txt: `QUARTERLY BUSINESS REPORT - Q4 2024

Executive Summary:
TechCorp Inc. has achieved record revenue of $12.5M in Q4 2024, representing a 35% year-over-year growth. Our engineering team expanded by 15 new hires, and customer satisfaction scores reached an all-time high of 4.8/5.0.

Key Metrics:
- Revenue: $12.5M (+35% YoY)
- Active Customers: 1,250 (+28% YoY)
- Employee Count: 85 (+21% YoY)
- Customer Retention: 94%

Strategic Initiatives:
1. Launched AI-powered analytics platform
2. Expanded to European market
3. Achieved SOC 2 Type II compliance

Challenges:
- Increased competition in the AI space
- Talent acquisition in specialized roles
- Supply chain delays affecting hardware delivery

Outlook for Q1 2025:
We project continued growth with expected revenue of $14M and plan to launch two new product features based on customer feedback.`,

    pdf: `RESEARCH PAPER: The Impact of AI on Modern Software Development

Abstract:
This paper examines how artificial intelligence is transforming software development practices. We analyze data from 500 development teams and identify key trends in AI adoption, productivity gains, and emerging challenges.

Introduction:
Artificial Intelligence (AI) has become increasingly integrated into software development workflows. From code completion to automated testing, AI tools are reshaping how developers work.

Methodology:
We surveyed 500 development teams across 50 companies, ranging from startups to Fortune 500 enterprises. Data was collected over a 12-month period (Jan-Dec 2024).

Key Findings:
1. 78% of teams use AI-powered code completion tools
2. Average productivity increase: 23%
3. Bug detection improved by 31%
4. Code review time reduced by 40%

Challenges Identified:
- Over-reliance on AI suggestions
- Quality concerns with AI-generated code
- Need for better AI literacy among developers

Conclusion:
AI is significantly enhancing software development productivity, but teams must maintain critical thinking and code quality standards. Future research should focus on long-term impacts and best practices for AI integration.`
};

export type FileType = 'csv' | 'json' | 'txt' | 'pdf';
export type ProcessingTask = 'summarize' | 'extract' | 'analyze' | 'transform';
