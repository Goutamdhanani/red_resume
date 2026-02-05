import React, { useState } from 'react';
import { FileOutput, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function ResumeGenerator({ jobId, onSuccess }) {
  const [selectedJobId, setSelectedJobId] = useState(jobId || '');
  const [rewriteSummary, setRewriteSummary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [resumePath, setResumePath] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedJobId.trim()) {
      setError('Please enter a Job ID');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await api.generateResume(selectedJobId, rewriteSummary);
      setResumePath(result.resume);
      setSuccess(true);
      if (onSuccess) onSuccess();
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
        Generate Tailored Resume
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="selectJobId">Job ID</label>
          <input
            id="selectJobId"
            type="text"
            placeholder="Enter Job ID (e.g., job_001)"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={rewriteSummary}
              onChange={(e) => setRewriteSummary(e.target.checked)}
              disabled={loading}
              style={{ 
                width: 'auto', 
                marginRight: '10px',
                cursor: 'pointer'
              }}
            />
            <span>Rewrite Summary with AI</span>
          </label>
          <p style={{ 
            fontSize: '12px', 
            color: 'var(--text-secondary)',
            marginTop: '6px',
            marginLeft: '30px'
          }}>
            Use AI to enhance the professional summary section
          </p>
        </div>

        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading || !selectedJobId.trim()}
          style={{ width: '100%', padding: '14px', fontSize: '16px' }}
        >
          {loading ? (
            <>
              <span className="spinner" style={{ marginRight: '8px' }}></span>
              Generating Resume...
            </>
          ) : (
            <>
              <FileOutput size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              Generate Resume
            </>
          )}
        </button>
      </form>

      {success && (
        <div className="success-message">
          <CheckCircle size={20} />
          <div>
            <div>Resume generated successfully!</div>
            {resumePath && (
              <div style={{ 
                fontFamily: 'monospace', 
                fontSize: '12px',
                marginTop: '4px',
                opacity: 0.8
              }}>
                {resumePath}
              </div>
            )}
          </div>
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
