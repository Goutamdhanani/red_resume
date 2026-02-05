import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function FileUpload({ onSuccess }) {
  const [baseFile, setBaseFile] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!baseFile || !profileFile) {
      setError('Please select both files');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.loadResume(baseFile, profileFile);
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1000);
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
        Load Resume Files
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Resume Base (JSON)</label>
          <div className="file-input-wrapper">
            <Upload size={32} color="var(--text-secondary)" />
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Click or drag to upload resume_base.json
            </p>
            <input
              type="file"
              accept=".json"
              onChange={(e) => setBaseFile(e.target.files[0]?.path || e.target.value)}
            />
            {baseFile && (
              <div className="selected-file">
                Selected: {baseFile}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Resume Profile (JSON)</label>
          <div className="file-input-wrapper">
            <Upload size={32} color="var(--text-secondary)" />
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Click or drag to upload resume_profile.json
            </p>
            <input
              type="file"
              accept=".json"
              onChange={(e) => setProfileFile(e.target.files[0]?.path || e.target.value)}
            />
            {profileFile && (
              <div className="selected-file">
                Selected: {profileFile}
              </div>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading || !baseFile || !profileFile}
          style={{ width: '100%', padding: '14px', fontSize: '16px' }}
        >
          {loading ? (
            <>
              <span className="spinner" style={{ marginRight: '8px' }}></span>
              Loading Files...
            </>
          ) : (
            'Load Files'
          )}
        </button>
      </form>

      {success && (
        <div className="success-message">
          <CheckCircle size={20} />
          <span>Resume files loaded successfully!</span>
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
