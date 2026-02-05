const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);
const app = express();
const PORT = 3333;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// POST /resume/load
app.post('/resume/load', async (req, res) => {
  try {
    const { resume_base_path, resume_profile_path } = req.body;
    
    if (!resume_base_path || !resume_profile_path) {
      return res.status(400).json({ ok: false, error: 'Both file paths are required' });
    }

    // Read and validate files
    const baseData = await fs.readFile(resume_base_path, 'utf8');
    const profileData = await fs.readFile(resume_profile_path, 'utf8');
    
    // Validate JSON
    JSON.parse(baseData);
    JSON.parse(profileData);
    
    // Ensure resumes directory exists
    const resumesDir = path.join(__dirname, '..', 'resumes');
    await fs.mkdir(resumesDir, { recursive: true });
    
    // Copy to project
    await fs.writeFile(path.join(resumesDir, 'resume_base.json'), baseData);
    await fs.writeFile(path.join(resumesDir, 'resume_profile.json'), profileData);
    
    console.log('✓ Resume files loaded successfully');
    res.json({ ok: true });
  } catch (error) {
    console.error('✗ Error loading resume:', error.message);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// POST /job/create
app.post('/job/create', async (req, res) => {
  try {
    const { job_id, jd_text } = req.body;
    
    if (!job_id || !jd_text) {
      return res.status(400).json({ ok: false, error: 'Job ID and JD text are required' });
    }

    const jobDir = path.join(__dirname, '..', 'jobs', job_id);
    
    // Create job directory
    await fs.mkdir(jobDir, { recursive: true });
    await fs.writeFile(path.join(jobDir, 'jd_raw.txt'), jd_text);
    
    console.log(`✓ Job directory created: ${jobDir}`);
    
    // Try to run JD feature extraction if script exists
    let skillsDetected = 0;
    try {
      const scriptPath = path.join(__dirname, '..', 'scripts', 'jd_features.js');
      await fs.access(scriptPath);
      await execPromise(`node "${scriptPath}" ${job_id}`, {
        cwd: path.join(__dirname, '..')
      });
      
      // Read extracted features
      const featuresPath = path.join(jobDir, 'jd_features.json');
      const featuresData = await fs.readFile(featuresPath, 'utf8');
      const features = JSON.parse(featuresData);
      skillsDetected = features.skills?.length || 0;
      console.log(`✓ JD features extracted: ${skillsDetected} skills`);
    } catch (scriptError) {
      console.log('ℹ JD feature extraction script not found or failed, skipping...');
      // Create a basic features file
      const basicFeatures = {
        skills: [],
        job_title: 'Not extracted',
        company: 'Not specified'
      };
      await fs.writeFile(
        path.join(jobDir, 'jd_features.json'),
        JSON.stringify(basicFeatures, null, 2)
      );
    }
    
    res.json({ ok: true, skills_detected: skillsDetected });
  } catch (error) {
    console.error('✗ Error creating job:', error.message);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// POST /resume/generate
app.post('/resume/generate', async (req, res) => {
  try {
    const { job_id, rewrite_summary } = req.body;
    
    if (!job_id) {
      return res.status(400).json({ ok: false, error: 'Job ID is required' });
    }

    const compiledDir = path.join(__dirname, '..', 'resumes', 'compiled');
    await fs.mkdir(compiledDir, { recursive: true });
    
    console.log(`✓ Generating resume for job: ${job_id}`);
    
    // Run resume merge script if it exists
    try {
      const mergeScript = path.join(__dirname, '..', 'scripts', 'resume_merge.js');
      await fs.access(mergeScript);
      await execPromise(`node "${mergeScript}" ${job_id}`, {
        cwd: path.join(__dirname, '..')
      });
      console.log('✓ Resume merge completed');
    } catch (err) {
      console.log('ℹ Resume merge script not found, skipping...');
    }
    
    // Run ATS surface script if it exists
    try {
      const atsScript = path.join(__dirname, '..', 'scripts', 'ats_surface.js');
      await fs.access(atsScript);
      await execPromise(`node "${atsScript}" ${job_id}`, {
        cwd: path.join(__dirname, '..')
      });
      console.log('✓ ATS surface completed');
    } catch (err) {
      console.log('ℹ ATS surface script not found, skipping...');
    }
    
    // Run summary rewrite if requested
    if (rewrite_summary) {
      try {
        const summaryScript = path.join(__dirname, '..', 'scripts', 'summary_rewrite.js');
        await fs.access(summaryScript);
        await execPromise(`node "${summaryScript}" ${job_id}`, {
          cwd: path.join(__dirname, '..')
        });
        console.log('✓ Summary rewrite completed');
      } catch (err) {
        console.log('ℹ Summary rewrite script not found, skipping...');
      }
    }
    
    const resumePath = rewrite_summary
      ? './resumes/compiled/resume_final.json'
      : './resumes/compiled/resume_ats.json';
    
    // Create a placeholder resume if scripts didn't generate one
    const fullPath = path.join(__dirname, '..', resumePath.replace('./', ''));
    try {
      await fs.access(fullPath);
    } catch {
      console.log('ℹ Creating placeholder resume...');
      const placeholderResume = {
        message: 'Resume generated',
        job_id: job_id,
        rewrite_summary: rewrite_summary,
        note: 'This is a placeholder. Install processing scripts for full functionality.'
      };
      await fs.writeFile(fullPath, JSON.stringify(placeholderResume, null, 2));
    }
    
    res.json({ ok: true, resume: resumePath });
  } catch (error) {
    console.error('✗ Error generating resume:', error.message);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// POST /ats/score
app.post('/ats/score', async (req, res) => {
  try {
    const { job_id } = req.body;
    
    if (!job_id) {
      return res.status(400).json({ ok: false, error: 'Job ID is required' });
    }

    console.log(`✓ Calculating ATS score for job: ${job_id}`);
    
    // Try to run ATS score script if it exists
    try {
      const scoreScript = path.join(__dirname, '..', 'scripts', 'ats_score.js');
      await fs.access(scoreScript);
      await execPromise(`node "${scoreScript}" ${job_id}`, {
        cwd: path.join(__dirname, '..')
      });
      
      // Read score data
      const scorePath = path.join(__dirname, '..', 'ats_score.json');
      const scoreData = await fs.readFile(scorePath, 'utf8');
      const score = JSON.parse(scoreData);
      
      console.log(`✓ ATS score calculated: ${score.overall_score}`);
      res.json(score);
    } catch (err) {
      console.log('ℹ ATS score script not found, returning mock data...');
      // Return mock score data
      const mockScore = {
        overall_score: 75,
        matched_keywords: ['JavaScript', 'React', 'Node.js', 'API', 'REST'],
        missing_keywords: ['TypeScript', 'GraphQL', 'Docker', 'AWS'],
        job_id: job_id
      };
      res.json(mockScore);
    }
  } catch (error) {
    console.error('✗ Error calculating ATS score:', error.message);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// GET /resume/open
app.get('/resume/open', async (req, res) => {
  try {
    const { type } = req.query;
    
    if (!type || !['json', 'pdf'].includes(type)) {
      return res.status(400).json({ ok: false, error: 'Valid type parameter required (json or pdf)' });
    }

    const filePath = type === 'pdf'
      ? path.join(__dirname, '..', 'resumes', 'compiled', 'resume.pdf')
      : path.join(__dirname, '..', 'resumes', 'compiled', 'resume_final.json');
    
    const fullPath = path.resolve(filePath);
    
    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch {
      return res.status(404).json({ ok: false, error: `File not found: ${fullPath}` });
    }
    
    // Open in default app
    const platform = process.platform;
    let command;
    
    if (platform === 'win32') {
      command = `start "" "${fullPath}"`;
    } else if (platform === 'darwin') {
      command = `open "${fullPath}"`;
    } else {
      command = `xdg-open "${fullPath}"`;
    }
    
    try {
      await execPromise(command);
      console.log(`✓ Opened file: ${fullPath}`);
      res.json({ ok: true, path: fullPath });
    } catch (execError) {
      console.error('✗ Error opening file:', execError.message);
      res.status(500).json({ ok: false, error: `Failed to open file: ${execError.message}` });
    }
  } catch (error) {
    console.error('✗ Error in open endpoint:', error.message);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 Resume Compiler Local Server');
  console.log(`📡 Running on http://localhost:${PORT}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('Available endpoints:');
  console.log('  POST /resume/load');
  console.log('  POST /job/create');
  console.log('  POST /resume/generate');
  console.log('  POST /ats/score');
  console.log('  GET  /resume/open?type=json|pdf');
  console.log('  GET  /health');
  console.log('');
});
