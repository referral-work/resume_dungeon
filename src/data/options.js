export const options = [
    "3 most suited job profiles for me and a brief on why",
    "Write a convincing LinkedIn/resume summary for my profile",
    "Suggest a highly matching job profile for me and improvements for likely success",
];

export const promptMapping = [
    `Your Task:-
    1. Understand the candidate's latest work experience, job responsibilities, area of expertise, and the hard and soft skills they have acquired. Assess how deeply the candidate has developed these skills, as this is a critical aspect of the prediction model.
    2. Consider the candidate's previous work experiences, job responsibilities, area of expertise, and the skills they have acquired. Evaluate the depth of their skill development.
    3. Familiarize yourself with the candidate's projects and determine their area of expertise for each project. Identify which job profile aligns with their area of expertise.
    4. Recognize the internships or other work experiences the candidate has had while studying and determine the skills they have acquired (soft skills and hard skills) and the job profiles that can best utilize those skills.
    5. Analyze the different courses the candidate has completed to extract their area of expertise and the level of expertise they have achieved. Identify the job profiles that can make the best use of their knowledge.
    6. Consider the candidate's portfolio, which showcases the work they have done on various skills. Determine which job profile would be most suited for the skills demonstrated in the candidate's portfolio.
    7. Review the candidate's skill section and only focus on skills for which there is evidence of work, such as utilization in projects, internships, courses, certificates, or a portfolio.
    
    For each candidate return top 3 job profiles that suits them most ,  Additionally, Justify why that profile suits them.
    Your response should be in the following format:
    "Job_profile_1_name": "Analogy and Justification",
    "Job_profile_2_name": "Analogy and Justification",
    "Job_profile_3_name": "Analogy and Justification".`,

    `Your Task:-
    1. Understand the candidate's latest work experience, job responsibilities, area of expertise, and the hard and soft skills they have acquired. Assess how deeply the candidate has developed these skills, as this is a critical aspect of the prediction model.
    2. Consider the candidate's previous work experiences, job responsibilities, area of expertise, and the skills they have acquired. Evaluate the depth of their skill development.
    3. Familiarize yourself with the candidate's projects and determine their area of expertise for each project. Identify which job profile aligns with their area of expertise.
    4. Recognize the internships or other work experiences the candidate has had while studying and determine the skills they have acquired (soft skills and hard skills) and the job profiles that can best utilize those skills.
    5. Analyze the different courses the candidate has completed to extract their area of expertise and the level of expertise they have achieved. Identify the job profiles that can make the best use of their knowledge.
    6. Consider the candidate's portfolio, which showcases the work they have done on various skills. Determine which job profile would be most suited for the skills demonstrated in the candidate's portfolio.
    7. Review the candidate's skill section and only focus on skills for which there is evidence of work, such as utilization in projects, internships, courses, certificates, or a portfolio.
    
    Write Linkledln about/ Resume Summary for Candidate. Write in Such a way that it have human touch with Professionalism and attracts Job Recruiters. While writing, don't use 3rd Person context, use I instead, Don't include contact information Part, it should not be more than 120 words`,
    
    `Your Task:-
    1. Understand the candidate's latest work experience, job responsibilities, area of expertise, and the hard and soft skills they have acquired. Assess how deeply the candidate has developed these skills, as this is a critical aspect of the prediction model.
    2. Consider the candidate's previous work experiences, job responsibilities, area of expertise, and the skills they have acquired. Evaluate the depth of their skill development.
    3. Familiarize yourself with the candidate's projects and determine their area of expertise for each project. Identify which job profile aligns with their area of expertise.
    4. Recognize the internships or other work experiences the candidate has had while studying and determine the skills they have acquired (soft skills and hard skills) and the job profiles that can best utilize those skills.
    5. Analyze the different courses the candidate has completed to extract their area of expertise and the level of expertise they have achieved. Identify the job profiles that can make the best use of their knowledge.
    6. Consider the candidate's portfolio, which showcases the work they have done on various skills. Determine which job profile would be most suited for the skills demonstrated in the candidate's portfolio.
    7. Review the candidate's skill section and only focus on skills for which there is evidence of work, such as utilization in projects, internships, courses, certificates, or a portfolio.

    Now give me  just 1 job profile, seems best suited for them, need name of Job Profile and What things they should correct in resume while applying for that position so that they can leverage on resume screening selection part, suggest. 

    Response format expected from you:-

    Job Profile:-

    Suggestions for Resume:-
            `,
    `Your Task:-
    1. Understand the candidate's latest work experience, job responsibilities, area of expertise, and the hard and soft skills they have acquired. Assess how deeply the candidate has developed these skills, as this is a critical aspect of the prediction model.
    2. Consider the candidate's previous work experiences, job responsibilities, area of expertise, and the skills they have acquired. Evaluate the depth of their skill development.
    3. Familiarize yourself with the candidate's projects and determine their area of expertise for each project. Identify which job profile aligns with their area of expertise.
    4. Recognize the internships or other work experiences the candidate has had while studying and determine the skills they have acquired (soft skills and hard skills) and the job profiles that can best utilize those skills.
    5. Analyze the different courses the candidate has completed to extract their area of expertise and the level of expertise they have achieved. Identify the job profiles that can make the best use of their knowledge.
    6. Consider the candidate's portfolio, which showcases the work they have done on various skills. Determine which job profile would be most suited for the skills demonstrated in the candidate's portfolio.
    7. Review the candidate's skill section and only focus on skills for which there is evidence of work, such as utilization in projects, internships, courses, certificates, or a portfolio.

    Candidate want to switch into `, ` role now. So, Make a strategy for Candidate to switch into new role.
    First brief candidate how their current profile is aligned to target job role.
    Give brief to candidate where they lack as a candidate for target job role.
    Give brief to candidate how they can prepare so that can cover all aspects where they lack as a candidate.
    After Preparing which kind of job profile they should apply for in target job role.
    How they can leverage on their selection and can be efficient while applying.`                                                                                          
]