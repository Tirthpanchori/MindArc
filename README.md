# MindArc — AI-Powered Quiz Generation Platform

> Built by Engineers. Designed for Educators.

MindArc eliminates the gap between great content and great assessment. Feed it a YouTube video, a PDF, or an image — it extracts the content, runs it through an LLM pipeline, and generates ready-to-deploy quizzes. Educators create. Students learn. The platform handles everything in between.

---

## How It Works

```
Input (YouTube URL / PDF / Image)
        ↓
Content Extraction
  ├── YouTube → youtube-transcript-api
  ├── PDF     → pdfplumber / PyPDF2
  └── Image   → Tesseract OCR
        ↓
LLM Pipeline (Groq API · Llama 3.1 8B Instant)
        ↓
Structured Quiz (MCQ, adaptive delivery)
        ↓
Student Attempt → Performance Report
```

---

## Features

- **Multi-Source Quiz Generation** — YouTube transcripts, PDFs, and scanned images
- **LLM-Powered Questions** — Groq API with Llama 3.1 8B Instant for fast, accurate generation
- **Role-Based Access** — Separate flows for Teachers and Students
- **Attempt Tracking** — Per-student attempt history with scoring
- **Performance Analytics** — Detailed reports per quiz and per student
- **JWT Authentication** — Secure, token-based auth with role-based authorization
- **Responsive UI** — Built with React + Tailwind CSS

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Framework | Django 6.0.1 + Django REST Framework 3.16.1 |
| Auth | JWT (djangorestframework-simplejwt) |
| Database | PostgreSQL |
| LLM | Groq API (Llama 3.1 8B Instant) |
| PDF Parsing | pdfplumber, PyPDF2, pdf2image |
| OCR | Tesseract via ocrmypdf |
| Transcript | youtube-transcript-api |
| PDF Export | fpdf2 |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19.1.1 |
| Build | Vite 7.1.7 |
| Styling | Tailwind CSS 3.4.17 |
| Routing | React Router DOM 7.9.3 |
| HTTP | Axios 1.12.2 |
| Animations | Framer Motion 12.25.0 |

---

## Project Structure

```
MindArc/
├── backend/
│   ├── accounts/          # Auth & user management
│   ├── ai_quiz/           # LLM quiz generation service
│   ├── attempts/          # Attempt tracking
│   ├── quiz/              # Quiz models & CRUD
│   ├── reports/           # Analytics & exports
│   ├── backend/           # Django settings & URLs
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route-level pages
│   │   ├── services/      # Axios API layer
│   │   └── utils/
│   ├── vite.config.js
│   └── tailwind.config.js
└── requirements.txt
```

---

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+ and npm
- PostgreSQL
- Groq API key ([get one here](https://console.groq.com))

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env              # Add your DB credentials and Groq API key

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver        # http://localhost:8000
```

### Frontend Setup

```bash
cd frontend

npm install
npm run dev                       # http://localhost:5173
```

---

## API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/accounts/register/` | Register new user |
| POST | `/api/accounts/login/` | Login, returns JWT tokens |
| POST | `/api/accounts/refresh/` | Refresh access token |

### Quizzes
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/quiz/` | All users |
| POST | `/api/quiz/` | Teacher only |
| GET | `/api/quiz/{id}/` | All users |
| PUT | `/api/quiz/{id}/` | Teacher only |
| DELETE | `/api/quiz/{id}/` | Teacher only |

### Attempts & Reports
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/attempts/` | List user attempts |
| POST | `/api/attempts/` | Start a new attempt |
| PUT | `/api/attempts/{id}/` | Submit attempt |
| GET | `/api/reports/` | Performance overview |
| GET | `/api/reports/{id}/` | Detailed report |

---

## User Roles

**Teacher**
- Create quizzes from YouTube, PDF, or image sources
- Monitor student attempts and scores
- Export performance reports

**Student**
- Browse and attempt assigned quizzes
- View attempt history and scores
- Track learning progress

---

## Deployment

```bash
# Build frontend
cd frontend && npm run build      # Output: frontend/dist/

# Backend
python manage.py collectstatic --noinput
gunicorn backend.wsgi:application
```

---

## Known Limitations

- YouTube transcript extraction depends on video having auto-generated or manual captions enabled
- OCR accuracy on low-resolution or handwritten images may vary
- Groq API rate limits apply on the free tier

---

## License

MIT