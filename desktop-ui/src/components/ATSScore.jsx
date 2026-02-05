import React, { useState, useEffect } from 'react';
import { Target, AlertCircle, TrendingUp, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function ATSScore({ jobId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scoreData, setScoreData] = useState(null);

  const fetchScore = async () => {
    if (!jobId) {
      setError('Please provide a Job ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.getATSScore(jobId);
      setScoreData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--color-success)';
    if (score >= 60) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  return (
    <div className="card">
      <h2 style={{
        fontSize: '24px',
        fontWeight: '600',
        marginBottom: '24px',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Target size={28} />
        ATS Analysis
      </h2>

      <button 
        onClick={fetchScore}
        className="btn-primary"
        disabled={loading || !jobId}
        style={{ width: '100%', padding: '14px', fontSize: '16px', marginBottom: '24px' }}
      >
        {loading ? (
          <>
            <span className="spinner" style={{ marginRight: '8px' }}></span>
            Analyzing...
          </>
        ) : (
          <>
            <TrendingUp size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            Get ATS Score
          </>
        )}
      </button>

      {scoreData && (
        <div>
          {/* Overall Score */}
          <div style={{
            textAlign: 'center',
            padding: '32px',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <div style={{
              fontSize: '64px',
              fontWeight: '700',
              color: getScoreColor(scoreData.overall_score || 0),
              lineHeight: 1
            }}>
              {scoreData.overall_score || 0}
            </div>
            <div style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginTop: '8px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Overall Score
            </div>

            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '4px',
              marginTop: '20px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${scoreData.overall_score || 0}%`,
                height: '100%',
                backgroundColor: getScoreColor(scoreData.overall_score || 0),
                transition: 'width 500ms ease'
              }} />
            </div>
          </div>

          {/* Missing Keywords */}
          {scoreData.missing_keywords && scoreData.missing_keywords.length > 0 && (
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                color: 'var(--text-primary)'
              }}>
                Missing Keywords ({scoreData.missing_keywords.length})
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {scoreData.missing_keywords.map((keyword, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Matched Keywords */}
          {scoreData.matched_keywords && scoreData.matched_keywords.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={20} color="var(--color-success)" />
                Matched Keywords ({scoreData.matched_keywords.length})
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {scoreData.matched_keywords.map((keyword, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'rgba(63, 185, 80, 0.1)',
                      border: '1px solid rgba(63, 185, 80, 0.3)',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: 'var(--color-success)'
                    }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
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
