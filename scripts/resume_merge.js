// Placeholder for resume merge script
// This script should merge resume base and profile with job-specific customizations

const fs = require('fs').promises;
const path = require('path');

async function mergeResume(jobId) {
  console.log(`Merging resume for job: ${jobId}`);
  
  const resumesDir = path.join(__dirname, '..', 'resumes');
  const compiledDir = path.join(resumesDir, 'compiled');
  
  // Ensure compiled directory exists
  await fs.mkdir(compiledDir, { recursive: true });
  
  // Read resume files
  const baseData = await fs.readFile(path.join(resumesDir, 'resume_base.json'), 'utf8');
  const profileData = await fs.readFile(path.join(resumesDir, 'resume_profile.json'), 'utf8');
  
  const base = JSON.parse(baseData);
  const profile = JSON.parse(profileData);
  
  // Simple merge - enhance as needed
  const merged = {
    ...base,
    ...profile,
    job_id: jobId,
    generated_at: new Date().toISOString()
  };
  
  // Save merged resume
  await fs.writeFile(
    path.join(compiledDir, 'resume_merged.json'),
    JSON.stringify(merged, null, 2)
  );
  
  console.log('✓ Resume merged successfully');
}

// Run if called directly
if (require.main === module) {
  const jobId = process.argv[2];
  if (!jobId) {
    console.error('Usage: node resume_merge.js <job_id>');
    process.exit(1);
  }
  
  mergeResume(jobId).catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}

module.exports = { mergeResume };
