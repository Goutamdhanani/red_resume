// Placeholder for JD feature extraction script
// This script should extract skills and features from job description

const fs = require('fs').promises;
const path = require('path');

async function extractFeatures(jobId) {
  console.log(`Extracting features for job: ${jobId}`);
  
  const jobDir = path.join(__dirname, '..', 'jobs', jobId);
  const jdPath = path.join(jobDir, 'jd_raw.txt');
  
  // Read JD text
  const jdText = await fs.readFile(jdPath, 'utf8');
  
  // Simple keyword extraction (implement your logic here)
  const features = {
    skills: extractSkills(jdText),
    job_title: 'Software Engineer',
    company: 'Company Name',
    requirements: extractRequirements(jdText)
  };
  
  // Save features
  await fs.writeFile(
    path.join(jobDir, 'jd_features.json'),
    JSON.stringify(features, null, 2)
  );
  
  console.log(`✓ Features extracted: ${features.skills.length} skills found`);
}

function extractSkills(text) {
  // Basic skill extraction - enhance as needed
  const commonSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
    'AWS', 'Docker', 'Kubernetes', 'API', 'REST', 'GraphQL', 'SQL',
    'Git', 'Agile', 'CI/CD', 'Testing', 'MongoDB', 'PostgreSQL'
  ];
  
  return commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

function extractRequirements(text) {
  // Extract basic requirements
  const lines = text.split('\n').filter(line => line.trim());
  return lines.slice(0, 5); // Return first 5 non-empty lines as requirements
}

// Run if called directly
if (require.main === module) {
  const jobId = process.argv[2];
  if (!jobId) {
    console.error('Usage: node jd_features.js <job_id>');
    process.exit(1);
  }
  
  extractFeatures(jobId).catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}

module.exports = { extractFeatures };
