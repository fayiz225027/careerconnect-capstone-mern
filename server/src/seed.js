const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    console.log('Previous records cleared.');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'ICTAK Administrator',
      email: 'admin@ictkerala.org',
      password: 'Password@123',
      role: 'admin',
      phone: '+91 94470 12345',
      location: 'Thiruvananthapuram, Kerala',
      bio: 'Platform super administrator and academic coordinator at ICT Academy of Kerala.'
    });

    const recruiter1 = await User.create({
      name: 'Aiswarya Menon',
      email: 'recruiter@techverve.com',
      password: 'Password@123',
      role: 'recruiter',
      company: 'TechVerve Innovations',
      phone: '+91 98460 55432',
      location: 'Kochi Infopark, Kerala',
      bio: 'Lead Technical Talent Partner specializing in MERN and Full Stack talent.'
    });

    const recruiter2 = await User.create({
      name: 'Rahul Nair',
      email: 'rahul@cloudscale.io',
      password: 'Password@123',
      role: 'recruiter',
      company: 'CloudScale Technologies',
      phone: '+91 98950 99881',
      location: 'Technopark, Trivandrum',
      bio: 'Head of Campus Recruitment and University Relations.'
    });

    const studentUser = await User.create({
      name: 'Fayiz Mohammed',
      email: 'fayiz225027@sahrdaya.ac.in',
      password: 'Password@123',
      role: 'student',
      phone: '+91 85900 12345',
      location: 'Thrissur, Kerala',
      bio: 'Aspiring Full Stack Web Developer proficient in React.js, Node.js, Express, and MongoDB.',
      skills: ['React.js', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Tailwind CSS', 'Git'],
      portfolio: 'https://github.com/fayiz225027',
      resumeUrl: 'https://drive.google.com/file/d/sample-resume/view'
    });

    console.log('Users created successfully.');

    // 2. Create Jobs / Internships
    const jobsData = [
      {
        title: 'Full Stack MERN Developer Intern',
        company: 'TechVerve Innovations',
        location: 'Kochi Infopark, Kerala (Hybrid)',
        jobType: 'Internship',
        category: 'Full Stack (MERN)',
        description: 'Join our dynamic product engineering team to build scalable web applications. You will collaborate with senior developers on building React frontends, robust Node/Express microservices, and MongoDB database pipelines.',
        requirements: [
          'Strong understanding of HTML5, CSS3, modern JavaScript (ES6+)',
          'Hands-on experience building web apps with React.js and Node.js',
          'Familiarity with MongoDB and Mongoose ODM',
          'Good problem-solving and debugging skills',
          'Understanding of Git and version control'
        ],
        responsibilities: [
          'Develop reusable React UI components with responsive layouts',
          'Implement secure RESTful API endpoints with Express and JWT authentication',
          'Write clean, maintainable, and well-documented code',
          'Participate in agile sprint ceremonies and code reviews'
        ],
        salary: '₹18,000 - ₹25,000 / month Stipend',
        experienceLevel: 'Internship / Fresher',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        postedBy: recruiter1._id,
        status: 'Active'
      },
      {
        title: 'React.js Frontend Engineer',
        company: 'TechVerve Innovations',
        location: 'Remote, India',
        jobType: 'Full-time',
        category: 'Frontend / React',
        description: 'We are seeking an enthusiastic Frontend Developer specializing in React.js. You will translate wireframes and Figma designs into pixel-perfect, highly responsive web interfaces with optimal performance and accessibility.',
        requirements: [
          'Proficiency in React.js, React Hooks, and Context API',
          'Experience with Tailwind CSS, Bootstrap, or styled-components',
          'Familiarity with REST APIs and Axios integration',
          'Passion for clean design, responsive UI, and Web Accessibility (WCAG)'
        ],
        responsibilities: [
          'Architect and build modular frontend interfaces',
          'Optimize web performance across mobile and desktop viewports',
          'Collaborate with UX designers and backend engineers'
        ],
        salary: '₹4.5 - ₹6.5 LPA',
        experienceLevel: 'Entry Level (0-1 yr)',
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        postedBy: recruiter1._id,
        status: 'Active'
      },
      {
        title: 'Node.js Backend Developer Intern',
        company: 'CloudScale Technologies',
        location: 'Technopark, Trivandrum',
        jobType: 'Internship',
        category: 'Backend / Node.js',
        description: 'Looking for a Backend Engineering Intern eager to master enterprise server-side development with Node.js, Express, and MongoDB. You will design secure APIs, integrate third-party services, and optimize database indexing.',
        requirements: [
          'Good knowledge of Node.js, Express.js, and asynchronous programming',
          'Experience with MongoDB schema modeling and aggregation pipelines',
          'Knowledge of JWT token authentication and role-based permissions',
          'Understanding of RESTful API standards'
        ],
        responsibilities: [
          'Build and test RESTful endpoints with Express',
          'Handle input validation, rate limiting, and centralized error logging',
          'Collaborate on cloud deployment and CI/CD pipelines'
        ],
        salary: '₹20,000 / month Stipend + PPO Opportunity',
        experienceLevel: 'Internship / Fresher',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        postedBy: recruiter2._id,
        status: 'Active'
      },
      {
        title: 'Junior AI & Data Analytics Associate',
        company: 'CloudScale Technologies',
        location: 'Kochi / Remote',
        jobType: 'Full-time',
        category: 'Data Science & AI',
        description: 'Exciting opportunity for fresh graduates to work at the intersection of web engineering and applied Artificial Intelligence. You will assist in deploying ML models as REST services and visualizing datasets in interactive dashboards.',
        requirements: [
          'Foundational knowledge of Python and Machine Learning concepts',
          'Experience consuming and feeding data via RESTful APIs',
          'Familiarity with data manipulation using Pandas or NumPy',
          'Strong analytical and logical reasoning skills'
        ],
        responsibilities: [
          'Preprocess application datasets and prepare exploratory data visualizations',
          'Integrate intelligent recommendations into web application workflows',
          'Evaluate model performance benchmarks'
        ],
        salary: '₹5.0 - ₹7.0 LPA',
        experienceLevel: 'Entry Level (0-1 yr)',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        postedBy: recruiter2._id,
        status: 'Active'
      },
      {
        title: 'UI/UX Design & Frontend Trainee',
        company: 'TechVerve Innovations',
        location: 'Calicut, Kerala (Hybrid)',
        jobType: 'Internship',
        category: 'UI/UX Design',
        description: 'Are you passionate about user experience and visual aesthetics? We are looking for an ambitious intern who can craft intuitive user journeys, wireframes, and prototypes, then bring them to life using modern React components.',
        requirements: [
          'Proficiency with Figma or Adobe XD',
          'Understanding of visual hierarchy, typography, and color theory',
          'Basic hands-on coding skills in HTML, CSS, and React JSX',
          'A creative portfolio showcasing mobile and desktop web concepts'
        ],
        responsibilities: [
          'Design user journeys, wireframes, and high-fidelity mockups',
          'Conduct usability feedback sessions with end users',
          'Collaborate with developers to ensure fidelity of design implementation'
        ],
        salary: '₹15,000 - ₹20,000 / month',
        experienceLevel: 'Internship / Fresher',
        deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        postedBy: recruiter1._id,
        status: 'Active'
      },
      {
        title: 'DevOps & Cloud Infrastructure Trainee',
        company: 'CloudScale Technologies',
        location: 'Technopark, Trivandrum',
        jobType: 'Internship',
        category: 'Cloud & DevOps',
        description: 'Learn modern DevOps practices by containerizing MERN stack applications with Docker, managing cloud infrastructure on AWS/Render, and implementing automated testing and deployment workflows using GitHub Actions.',
        requirements: [
          'Understanding of Linux command line and Git',
          'Basic familiarity with Docker and containers',
          'Interest in CI/CD pipelines and cloud architectures (AWS / Azure)'
        ],
        responsibilities: [
          'Assist in dockerizing web services',
          'Configure environment variables and monitoring metrics',
          'Automate build and deployment scripts'
        ],
        salary: '₹18,000 / month Stipend',
        experienceLevel: 'Internship / Fresher',
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        postedBy: recruiter2._id,
        status: 'Active'
      }
    ];

    const createdJobs = await Job.insertMany(jobsData);
    console.log(`Created ${createdJobs.length} jobs.`);

    // 3. Create Sample Applications for Student
    const sampleApp1 = await Application.create({
      job: createdJobs[0]._id, // MERN Intern
      applicant: studentUser._id,
      coverLetter: 'I am excited to apply for the Full Stack MERN Developer Internship at TechVerve. I have completed comprehensive full-stack training under ICT Academy of Kerala, building end-to-end applications with React, Node, Express, and MongoDB. I look forward to contributing effectively to your engineering sprints.',
      resumeUrl: 'https://drive.google.com/file/d/sample-fayiz-resume/view',
      experienceYears: 'Fresher (Capstone completed)',
      status: 'Shortlisted',
      recruiterFeedback: 'Strong foundational portfolio and solid grasp of MERN concepts. Selected for technical discussion round.'
    });

    const sampleApp2 = await Application.create({
      job: createdJobs[2]._id, // Backend Intern
      applicant: studentUser._id,
      coverLetter: 'I have developed RESTful APIs with MongoDB schemas, JWT authentication, and Express middleware. I am keen to learn more about enterprise backend scaling and cloud microservices.',
      resumeUrl: 'https://drive.google.com/file/d/sample-fayiz-resume/view',
      experienceYears: 'Fresher',
      status: 'Reviewed',
      recruiterFeedback: 'Profile has been reviewed by the engineering team.'
    });

    // Update job applicant counts
    await Job.findByIdAndUpdate(createdJobs[0]._id, { applicantsCount: 1 });
    await Job.findByIdAndUpdate(createdJobs[2]._id, { applicantsCount: 1 });

    // Bookmark first job for student
    studentUser.savedJobs.push(createdJobs[1]._id);
    await studentUser.save();

    console.log('Seed applications created successfully.');
    console.log('----------------------------------------------------');
    console.log('DEFAULT LOGIN CREDENTIALS:');
    console.log('1. Admin:     admin@ictkerala.org       / Password@123');
    console.log('2. Recruiter: recruiter@techverve.com   / Password@123');
    console.log('3. Student:   fayiz225027@sahrdaya.ac.in / Password@123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
