// Placeholder for ATS surface script
// This script should optimize resume for ATS scanning

const fs = require('fs').promises;
const path = require('path');

async function surfaceForATS(jobId) {
  console.log(`Optimizing resume for ATS: ${jobId}`);
  
  const compiledDir = path.join(__dirname, '..', 'resumes', 'compiled');
  const mergedPath = path.join(compiledDir, 'resume_merged.json');
  
  // Read merged resume
  const mergedData = await fs.readFile(mergedPath, 'utf8');
  const resume = JSON.parse(mergedData);
  
  // Read job features
  const jobDir = path.join(__dirname, '..', 'jobs', jobId);
  const featuresPath = path.join(jobDir, 'jd_features.json');
  const featuresData = await fs.readFile(featuresPath, 'utf8');
  const features = JSON.parse(featuresData);
  
  // ATS optimization - enhance as needed
  const optimized = {
    ...resume,
    skills: [...(resume.skills || []), ...(features.skills || [])],
    ats_optimized: true,
    target_job: jobId
  };
  
  // Save ATS-optimized resume
  await fs.writeFile(
    path.join(compiledDir, 'resume_ats.json'),
    JSON.stringify(optimized, null, 2)
  );
  
  console.log('✓ Resume optimized for ATS');
}

// Run if called directly
if (require.main === module) {
  const jobId = process.argv[2];
  if (!jobId) {
    console.error('Usage: node ats_surface.js <job_id>');
    process.exit(1);
  }
  
  surfaceForATS(jobId).catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}

module.exports = { surfaceForATS };
