import React, { useState } from 'react';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function JobForm({ onSuccess }) {
  const [jobId, setJobId] = useState('');
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [skillsCount, setSkillsCount] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!jobId.trim() || !jdText.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await api.createJob(jobId, jdText);
      setSkillsCount(result.skills_detected);
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess(jobId);
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{
        fontSize: '24px',
        fontWeight: '600',
        marginBottom: '24px',
        color: 'var(--text-primary)'
      }}>
        Add Job Description
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="jobId">
            Job ID <span style={{ color: 'var(--text-secondary)' }}>(e.g., job_001)</span>
          </label>
          <input
            id="jobId"
            type="text"
            placeholder="job_001"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="jdText">Job Description</label>
          <textarea
            id="jdText"
            placeholder="Paste the job description here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            disabled={loading}
            rows={12}
            style={{ resize: 'vertical' }}
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading || !jobId.trim() || !jdText.trim()}
          style={{ width: '100%', padding: '14px', fontSize: '16px' }}
        >
          {loading ? (
            <>
              <span className="spinner" style={{ marginRight: '8px' }}></span>
              Processing Job...
            </>
          ) : (
            <>
              <FileText size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              Process Job
            </>
          )}
        </button>
      </form>

      {success && (
        <div className="success-message">
          <CheckCircle size={20} />
          <span>
            Job processed successfully! 
            {skillsCount !== null && ` Detected ${skillsCount} skills.`}
          </span>
        </div>
      )}

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
