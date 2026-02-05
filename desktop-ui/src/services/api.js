const BASE_URL = 'http://localhost:3333';

export const api = {
  loadResume: async (basePath, profilePath) => {
    const res = await fetch(`${BASE_URL}/resume/load`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resume_base_path: basePath,
        resume_profile_path: profilePath
      })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to load resume');
    }
    return res.json();
  },

  createJob: async (jobId, jdText) => {
    const res = await fetch(`${BASE_URL}/job/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: jobId, jd_text: jdText })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to create job');
    }
    return res.json();
  },

  generateResume: async (jobId, rewriteSummary) => {
    const res = await fetch(`${BASE_URL}/resume/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        job_id: jobId,
        rewrite_summary: rewriteSummary
      })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to generate resume');
    }
    return res.json();
  },

  getATSScore: async (jobId) => {
    const res = await fetch(`${BASE_URL}/ats/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: jobId })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to get ATS score');
    }
    return res.json();
  },

  openResume: async (type) => {
    window.open(`${BASE_URL}/resume/open?type=${type}`, '_blank');
  }
};
