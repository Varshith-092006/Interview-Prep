# PrepWise AI - AI Interview Preparation Platform

A production-ready full-stack AI interview preparation platform with **real-time VAPI voice interviews**, resume ATS analysis, analytics dashboard, and Gemini-powered feedback generation.

## Tech Stack

### Frontend
- React.js + Vite
- Tailwind CSS v4
- Framer Motion
- React Router v7
- Axios
- Zustand (state management)
- Recharts (analytics)
- VAPI Web SDK (voice interviews)
- React Hot Toast

### Backend
- Node.js + Express.js v5
- MongoDB + Mongoose
- JWT Authentication
- Google Gemini 2.5 Flash
- Multer (file uploads)
- PDF-Parse + Mammoth (resume parsing)

### AI
- **Gemini 2.5 Flash** — Resume analysis, ATS scoring, interview question generation, answer evaluation, feedback generation
- **VAPI** — Real-time voice AI interview communication

---

## Features

- 🎙️ **Real-time Voice Interviews** — Speak naturally with an AI interviewer
- 📄 **Resume ATS Analysis** — Upload resumes for instant scoring and skill extraction
- 📊 **Analytics Dashboard** — Track performance trends, radar analysis, topic scores
- 🧠 **AI Feedback Engine** — Per-question evaluation with scores, strengths, weaknesses
- 🎯 **Personalized Questions** — Tailored to your resume, role, and seniority
- 🔐 **JWT Authentication** — Secure register/login with protected routes
- 📱 **Fully Responsive** — Works on desktop, tablet, and mobile

---

## Project Structure

```
AI-Interview-Prep-main/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Navbar, SkeletonCard, etc.
│   │   ├── pages/              # All page components
│   │   ├── routes/             # ProtectedRoute
│   │   ├── services/           # Axios API instance
│   │   ├── store/              # Zustand auth store
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Design system
│   ├── .env
│   ├── index.html
│   └── package.json
│
├── server/                     # Express Backend
│   ├── src/
│   │   ├── config/             # Gemini AI config
│   │   ├── controllers/        # All route handlers
│   │   ├── middleware/         # Auth, error, upload
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # Express routes
│   │   ├── services/
│   │   │   ├── ai/             # AI services (evaluation, generation)
│   │   │   └── resume/         # Resume parsing & analysis
│   │   ├── uploads/            # Uploaded resume files
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## Environment Variables

### Client `.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key
VITE_ASSISTANT_ID=your_vapi_assistant_id
```

### Server `.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_API_KEY=your_google_api_key
CLIENT_URL=http://localhost:5173
VAPI_API_KEY=your_vapi_api_key
VAPI_PUBLIC_KEY=your_vapi_public_key
VAPI_ASSISTANT_ID=your_vapi_assistant_id
```

---

## Running Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- VAPI account
- Google AI Studio account (for Gemini API key)

### 1. Backend Setup

```bash
cd server
npm install
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

---

## VAPI Setup Instructions

VAPI powers the real-time voice interview system. Follow these steps:

### 1. Create VAPI Account
- Go to [https://vapi.ai](https://vapi.ai)
- Sign up and log in to the dashboard

### 2. Create an Assistant
1. Go to **Assistants** in the left sidebar
2. Click **Create Assistant**
3. Name it (e.g., "AI Prep")
4. Set the **First Message** to: `Hello.`
5. Set the **System Prompt** to:
   ```
   You are a realtime voice assistant.
   ONLY speak the text provided to you.
   Do not generate interview questions yourself.
   Wait silently for the user response.
   Do not add extra explanations.
   ```
6. Configure voice provider (e.g., ElevenLabs, Deepgram, OpenAI)
7. Click **Save** / **Publish**

### 3. Get Your Keys
- **Public Key**: Found in VAPI Dashboard → Settings → API Keys
- **Assistant ID**: Found in the assistant URL or assistant details page
- **API Key**: Found in VAPI Dashboard → Settings → API Keys

### 4. Add Keys to Environment
```env
# Client .env
VITE_VAPI_PUBLIC_KEY=your_public_key
VITE_ASSISTANT_ID=your_assistant_id

# Server .env
VAPI_API_KEY=your_api_key
VAPI_PUBLIC_KEY=your_public_key
VAPI_ASSISTANT_ID=your_assistant_id
```

### 5. VAPI Workflow (Optional)
If using VAPI Workflows:
1. Go to **Workflows** in the VAPI dashboard
2. Create a new workflow
3. Add a **Start Node** with an introduction step
4. The workflow can be configured to use the assistant for multi-step interview flows
5. Connect the workflow ID in your environment variables

---

## Gemini API Setup

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click **Get API Key**
3. Create a new API key
4. Copy the key and add it to your server `.env`:
   ```env
   GEMINI_API_KEY=your_key_here
   ```

---

## How the Voice Interview Works

```
User clicks "Start Interview"
        ↓
Frontend creates interview record via API
        ↓
User navigates to interview page
        ↓
Frontend connects to VAPI assistant
        ↓
Backend generates dynamic system prompt
        ↓
AI greets user via voice
        ↓
AI asks first question
        ↓
User answers using microphone
        ↓
VAPI converts speech-to-text
        ↓
Frontend sends transcript to backend
        ↓
Backend evaluates answer using Gemini
        ↓
AI asks next question via VAPI
        ↓
Loop continues until question limit reached
        ↓
Interview auto-completes
        ↓
Backend generates full AI feedback
        ↓
User redirected to feedback report page
```

---

## MongoDB Schemas

| Model | Description |
|-------|-------------|
| `User` | User account with auth credentials |
| `Resume` | Uploaded resume with parsed data and ATS score |
| `Interview` | Interview session metadata |
| `InterviewSession` | VAPI session tracking |
| `Question` | Individual interview questions (resume-based flow) |
| `Transcript` | Voice interview transcripts |
| `Feedback` | AI-generated feedback with per-question analysis |

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login user
- `GET /api/auth/me` — Get current user

### Resume
- `POST /api/resume/upload` — Upload and analyze resume
- `GET /api/resume/my-resumes` — Get user's resumes

### Interviews
- `POST /api/interviews/create` — Create interview
- `GET /api/interviews/my-interviews` — Get user's interviews
- `GET /api/interviews/:id` — Get single interview

### Real-time Interview
- `POST /api/realtime-interview/session/:id` — Start voice session
- `POST /api/realtime-interview/event/:id` — Capture voice event
- `POST /api/realtime-interview/complete/:id` — Complete voice session

### Feedback
- `POST /api/feedback/generate/:id` — Generate AI feedback
- `GET /api/feedback/:id` — Get feedback

### Analytics
- `GET /api/analytics/overview` — Get analytics data

---

## License

MIT
