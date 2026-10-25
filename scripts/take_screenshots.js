const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function capture() {
  console.log('Launching Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // 1. Homepage
    console.log('1. Capturing Homepage...');
    await page.goto('http://localhost:5000/', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(screenshotsDir, '01_homepage.png'), fullPage: false });

    // 2. Explore Jobs
    console.log('2. Capturing Jobs List...');
    await page.goto('http://localhost:5000/jobs', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(screenshotsDir, '02_job_catalog.png'), fullPage: false });

    // 3. Job Details View
    console.log('3. Capturing Job Details...');
    // Click the first job's view details or navigate to first job
    const jobLink = await page.$('.job-card a');
    if (jobLink) {
      await jobLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(screenshotsDir, '03_job_details.png'), fullPage: false });
    }

    // 4. Login Page
    console.log('4. Capturing Login Page...');
    await page.goto('http://localhost:5000/login', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(screenshotsDir, '04_login_portal.png'), fullPage: false });

    // 5. Login as Student
    console.log('5. Logging in as Student (Fayiz)...');
    await page.type('input[type="email"]', 'fayiz225027@sahrdaya.ac.in');
    await page.type('input[type="password"]', 'Password@123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(screenshotsDir, '05_student_dashboard.png'), fullPage: false });

    // 6. Student Applications
    console.log('6. Capturing Student My Applications...');
    await page.goto('http://localhost:5000/my-applications', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(screenshotsDir, '06_student_applications.png'), fullPage: false });

    // 7. Student Profile
    console.log('7. Capturing Student Profile...');
    await page.goto('http://localhost:5000/profile', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(screenshotsDir, '07_student_profile.png'), fullPage: false });

    // Logout
    await page.evaluate(() => {
      localStorage.clear();
    });

    // 8. Login as Recruiter
    console.log('8. Logging in as Recruiter...');
    await page.goto('http://localhost:5000/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="email"]', 'recruiter@techverve.com');
    await page.type('input[type="password"]', 'Password@123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(screenshotsDir, '08_recruiter_dashboard.png'), fullPage: false });

    // 9. Recruiter Manage Jobs
    console.log('9. Capturing Recruiter Job Management...');
    await page.goto('http://localhost:5000/manage-jobs', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(screenshotsDir, '09_recruiter_manage_jobs.png'), fullPage: false });

    // 10. Recruiter Post Job Form
    console.log('10. Capturing Post Opportunity Form...');
    await page.goto('http://localhost:5000/post-job', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(screenshotsDir, '10_post_opportunity.png'), fullPage: false });

    // 11. Recruiter Applicants Review
    console.log('11. Capturing Applicants Review...');
    // Find first applicants link or go to manage jobs
    await page.goto('http://localhost:5000/manage-jobs', { waitUntil: 'networkidle0' });
    const applicantsBtn = await page.$('a[href*="/applicants"]');
    if (applicantsBtn) {
      await applicantsBtn.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(screenshotsDir, '11_candidate_evaluation.png'), fullPage: false });
    }

    // Logout
    await page.evaluate(() => {
      localStorage.clear();
    });

    // 12. Login as Admin
    console.log('12. Logging in as ICTAK Administrator...');
    await page.goto('http://localhost:5000/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="email"]', 'admin@ictkerala.org');
    await page.type('input[type="password"]', 'Password@123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await new Promise(r => setTimeout(r, 1500));
    await page.goto('http://localhost:5000/admin', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(screenshotsDir, '12_admin_console.png'), fullPage: false });

    console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } catch (err) {
    console.error('Screenshot capture error:', err);
  } finally {
    await browser.close();
  }
}

capture();
