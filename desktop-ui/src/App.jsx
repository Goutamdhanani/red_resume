import React, { useState } from 'react';
import { Download, FileJson, FileType } from 'lucide-react';
import Layout from './components/Layout';
import FileUpload from './components/FileUpload';
import JobForm from './components/JobForm';
import ResumeGenerator from './components/ResumeGenerator';
import ATSScore from './components/ATSScore';
import { api } from './services/api';

function App() {
  const [currentStep, setCurrentStep] = useState('upload'); // upload, job, generate, score, download
  const [jobId, setJobId] = useState('');

  return (
    <Layout>
      {/* Navigation Stepper */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '40px',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'upload', label: '1. Upload Resume' },
          { id: 'job', label: '2. Add Job' },
          { id: 'generate', label: '3. Generate' },
          { id: 'score', label: '4. ATS Score' },
          { id: 'download', label: '5. Download' }
        ].map((step) => (
          <div
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              backgroundColor: currentStep === step.id ? 'var(--accent-primary)' : 'var(--bg-surface)',
              color: currentStep === step.id ? '#ffffff' : 'var(--text-secondary)',
              border: `1px solid ${currentStep === step.id ? 'var(--accent-primary)' : 'var(--border-color)'}`,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 200ms ease'
            }}
          >
            {step.label}
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {currentStep === 'upload' && (
          <FileUpload onSuccess={() => setCurrentStep('job')} />
        )}

        {currentStep === 'job' && (
          <JobForm onSuccess={(id) => {
            setJobId(id);
            setCurrentStep('generate');
          }} />
        )}

        {currentStep === 'generate' && (
          <ResumeGenerator 
            jobId={jobId}
            onSuccess={() => setCurrentStep('score')}
          />
        )}

        {currentStep === 'score' && (
          <ATSScore jobId={jobId} />
        )}

        {currentStep === 'download' && (
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
              <Download size={28} />
              Download Resume
            </h2>

            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: '24px',
              lineHeight: 1.6
            }}>
              Your resume has been generated successfully. Choose how you'd like to access it:
            </p>

            <div style={{
              display: 'grid',
              gap: '16px'
            }}>
              <button
                onClick={() => api.openResume('json')}
                className="btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '16px',
                  fontSize: '16px'
                }}
              >
                <FileJson size={24} />
                Open JSON Resume
              </button>

              <button
                onClick={() => api.openResume('pdf')}
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '16px',
                  fontSize: '16px'
                }}
              >
                <FileType size={24} />
                Open PDF Resume
              </button>
            </div>

            <div style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '6px',
              border: '1px solid var(--border-color)'
            }}>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: 1.6
              }}>
                💡 <strong>Tip:</strong> Files will open in your default application.
                JSON files can be viewed in any text editor, and PDFs will open in your PDF viewer.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Navigation */}
      {currentStep === 'score' && (
        <div style={{
          marginTop: '40px',
          textAlign: 'center'
        }}>
          <button
            onClick={() => setCurrentStep('download')}
            className="btn-success"
            style={{
              padding: '14px 32px',
              fontSize: '16px'
            }}
          >
            Continue to Download →
          </button>
        </div>
      )}
    </Layout>
  );
}

export default App;
