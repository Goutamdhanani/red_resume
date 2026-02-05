// Placeholder for ATS score script
// This script should calculate ATS compatibility score

const fs = require('fs').promises;
const path = require('path');

async function calculateScore(jobId) {
  console.log(`Calculating ATS score for job: ${jobId}`);
  
  const compiledDir = path.join(__dirname, '..', 'resumes', 'compiled');
  const resumePath = path.join(compiledDir, 'resume_final.json');
  
  // Try to read final resume, fall back to ATS resume
  let resumeData;
  try {
    resumeData = await fs.readFile(resumePath, 'utf8');
  } catch {
    resumeData = await fs.readFile(path.join(compiledDir, 'resume_ats.json'), 'utf8');
  }
  
  const resume = JSON.parse(resumeData);
  
  // Read job features
  const jobDir = path.join(__dirname, '..', 'jobs', jobId);
  const featuresPath = path.join(jobDir, 'jd_features.json');
  const featuresData = await fs.readFile(featuresPath, 'utf8');
  const features = JSON.parse(featuresData);
  
  // Calculate score - implement your logic here
  const resumeSkills = resume.skills || [];
  const requiredSkills = features.skills || [];
  
  const matchedKeywords = requiredSkills.filter(skill =>
    resumeSkills.some(rs => rs.toLowerCase().includes(skill.toLowerCase()))
  );
  
  const missingKeywords = requiredSkills.filter(skill =>
    !resumeSkills.some(rs => rs.toLowerCase().includes(skill.toLowerCase()))
  );
  
  const score = {
    overall_score: Math.round((matchedKeywords.length / Math.max(requiredSkills.length, 1)) * 100),
    matched_keywords: matchedKeywords,
    missing_keywords: missingKeywords,
    job_id: jobId,
    calculated_at: new Date().toISOString()
  };
  
  // Save score
  await fs.writeFile(
    path.join(__dirname, '..', 'ats_score.json'),
    JSON.stringify(score, null, 2)
  );
  
  console.log(`✓ ATS score calculated: ${score.overall_score}%`);
}

// Run if called directly
if (require.main === module) {
  const jobId = process.argv[2];
  if (!jobId) {
    console.error('Usage: node ats_score.js <job_id>');
    process.exit(1);
  }
  
  calculateScore(jobId).catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}

module.exports = { calculateScore };
