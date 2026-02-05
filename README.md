# Resume Compiler - Professional Desktop Application

![Professional Dark Theme](https://img.shields.io/badge/Theme-Dark-0d1117)
![React](https://img.shields.io/badge/React-18.2-58a6ff)
![Node.js](https://img.shields.io/badge/Node.js-Express-3fb950)

A professional desktop-first React application with a dark theme that helps you create ATS-optimized resumes tailored to specific job descriptions. This is a **local desktop UI** that uses HTTP to communicate with a Node.js backend - everything runs on your machine, ensuring complete privacy.

## 🎨 Features

- **Professional Dark UI** - GitHub-inspired dark theme with smooth transitions
- **Step-by-Step Workflow** - Intuitive 5-step process to generate tailored resumes
- **ATS Optimization** - Analyze and optimize resumes for Applicant Tracking Systems
- **Privacy First** - All processing happens locally on your machine
- **AI-Powered** - Optional AI summary rewriting (when configured)
- **File Management** - Easy upload, generation, and download of resume files

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Goutamdhanani/red_resume.git
cd red_resume

# Install all dependencies
npm run setup

# Start both frontend and backend
npm run dev
```

The application will start:
- **Frontend UI:** http://localhost:5173
- **Backend Server:** http://localhost:3333

## 📁 Project Structure

```
red_resume/
├─ desktop-ui/              ← React + Vite Frontend
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ FileUpload.jsx      # Step 1: Upload resume files
│  │  │  ├─ JobForm.jsx          # Step 2: Add job description
│  │  │  ├─ ResumeGenerator.jsx  # Step 3: Generate resume
│  │  │  ├─ ATSScore.jsx         # Step 4: ATS analysis
│  │  │  └─ Layout.jsx           # App layout wrapper
│  │  ├─ services/
│  │  │  └─ api.js               # API communication layer
│  │  ├─ App.jsx                 # Main app with workflow
│  │  ├─ index.css               # Dark theme styles
│  │  └─ main.jsx                # React entry point
│  ├─ package.json
│  └─ vite.config.js
│
├─ local-server/            ← Node.js Express Backend
│  ├─ server.js              # Main server with all routes
│  └─ package.json
│
├─ scripts/                 ← Processing Scripts
│  ├─ jd_features.js         # Extract features from job description
│  ├─ resume_merge.js        # Merge resume base and profile
│  ├─ ats_surface.js         # Optimize for ATS
│  ├─ summary_rewrite.js     # AI summary rewriting
│  └─ ats_score.js           # Calculate ATS score
│
├─ resumes/                 ← Resume Files
│  ├─ resume_base.json       # Base resume information
│  ├─ resume_profile.json    # Profile and achievements
│  └─ compiled/              # Generated resumes
│
├─ jobs/                    ← Job Descriptions
│  └─ {job_id}/
│     ├─ jd_raw.txt          # Original job description
│     └─ jd_features.json    # Extracted features
│
└─ package.json             ← Root workspace
```

## 🎯 UI Workflow

### Step 1: Upload Resume Files
- Upload your resume base JSON (contact info, skills, experience)
- Upload your resume profile JSON (summary, achievements, projects)
- Files are validated and copied to the project

### Step 2: Add Job Description
- Enter a unique Job ID (e.g., "job_001")
- Paste the job description text
- System extracts skills and requirements automatically

### Step 3: Generate Tailored Resume
- Select the Job ID
- Optional: Enable AI summary rewriting
- System generates an optimized resume for the specific job

### Step 4: ATS Score Analysis
- View your ATS compatibility score (0-100)
- See matched keywords (skills you have that match the job)
- Identify missing keywords (skills you should consider adding)

### Step 5: Download Resume
- Open the JSON resume in your editor
- Open the PDF resume in your viewer (when PDF generation is configured)

## 🎨 Design System

### Color Palette
```css
--bg-primary: #0d1117      /* Main background */
--bg-surface: #161b22      /* Cards and elevated surfaces */
--border-color: #30363d    /* Borders */
--accent-primary: #58a6ff  /* Primary actions */
--color-success: #3fb950   /* Success states */
--color-warning: #d29922   /* Warnings */
--color-danger: #f85149    /* Errors */
--text-primary: #c9d1d9    /* High contrast text */
--text-secondary: #8b949e  /* Muted text */
```

### Typography
- **Headings:** Inter (600-700 weight)
- **Body:** Inter (400-500 weight)
- **Code:** JetBrains Mono

## 🔌 API Endpoints

The local server exposes these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/resume/load` | Load resume base and profile files |
| POST | `/job/create` | Create new job and extract features |
| POST | `/resume/generate` | Generate tailored resume for job |
| POST | `/ats/score` | Calculate ATS compatibility score |
| GET | `/resume/open?type=json\|pdf` | Open generated resume file |
| GET | `/health` | Health check endpoint |

## 📦 Dependencies

### Frontend (desktop-ui)
- **react** ^18.2.0 - UI library
- **react-dom** ^18.2.0 - React DOM renderer
- **lucide-react** ^0.300.0 - Icon library
- **vite** ^5.0.0 - Build tool

### Backend (local-server)
- **express** ^4.18.2 - Web server framework
- **cors** ^2.8.5 - CORS middleware

## 🛠️ Development

### Running Components Separately

```bash
# Run backend only
npm run server

# Run frontend only (in another terminal)
npm run ui
```

### Frontend Development
```bash
cd desktop-ui
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Development
```bash
cd local-server
npm start        # Start server
```

## 📝 Sample Data

The repository includes sample resume files in `/resumes/`:
- `resume_base.json` - Example base resume
- `resume_profile.json` - Example profile data

Use these for testing or as templates for your own resume files.

## 🔒 Privacy & Security

- **100% Local** - All data stays on your machine
- **No Cloud Uploads** - Files are processed locally
- **Optional AI** - AI features only run when explicitly enabled
- **No Tracking** - No analytics or external requests

## 🐛 Troubleshooting

### Port Already in Use
If port 3333 or 5173 is already in use:
```bash
# Change server port in local-server/server.js
const PORT = 3334; // Change to available port

# Change UI port in desktop-ui/vite.config.js
server: { port: 5174 }
```

### CORS Issues
Make sure the backend is running before starting the frontend.

### File Not Found
Ensure you're using absolute file paths when uploading resume files.

## 🤝 Contributing

This is a desktop application designed for local use. Feel free to fork and customize for your needs.

## 📄 License

MIT License - feel free to use and modify as needed.

---

**Made with ❤️ for job seekers**

The hope is red.
