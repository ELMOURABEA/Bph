# Google AI Studio Setup & Deployment Guide

This repository is configured as a **Google AI Studio project** for deploying an AI-powered pharmacy consultation application (Bpharma - صيدليات البنداري).

## 📋 Prerequisites

- **Google Cloud Account** with AI Studio access
- **Gemini API Key** from Google AI Studio
- **GitHub Repository** (already set up)

## 🚀 Quick Start with AI Studio

### 1. Connect Repository to AI Studio

1. Go to [Google AI Studio](https://ai.google.dev/aistudio)
2. Click "Create new project" or "Open from GitHub"
3. Connect your GitHub account and select this repository (`ELMOURABEA/Bph`)

### 2. Configure Environment Secrets

In AI Studio's **Secrets panel**, add:

| Secret Name | Description | Where to Get |
|---|---|---|
| `GEMINI_API_KEY` | Gemini API Key for AI consultations | [Google AI Studio - API Keys](https://ai.google.dev/aistudio) |
| `APP_URL` | Auto-filled by AI Studio at runtime | N/A (provided by AI Studio) |
| `SUPABASE_URL` | Your Supabase project URL (optional) | [Supabase Dashboard](https://app.supabase.com) |
| `SUPABASE_ANON_KEY` | Supabase anonymous key (optional) | [Supabase Dashboard](https://app.supabase.com) |

### 3. Deploy

AI Studio handles deployment automatically:

1. **Code Changes**: Push to the `main` branch
2. **Auto Build**: AI Studio detects changes and triggers builds
3. **Cloud Run Deployment**: Deployed to Google Cloud Run
4. **Live URL**: Your app is available at the service URL provided

## 📁 Project Structure

```
Bph/
├── src/                      # React frontend components
├── server.ts                 # Express.js backend server
├── vite.config.ts           # Vite build configuration
├── package.json             # Dependencies
├── .env.example             # Environment variable template
├── .github/
│   └── workflows/
│       ├── ai-studio-ci.yml       # CI/CD pipeline
│       └── (datadog removed)       # Datadog workflow removed
└── public/                  # Static assets
```

## 🔧 Local Development

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

The development server will start on `http://localhost:3000`

### Build for Production
```bash
npm run build
npm run start
```

### Run Linter
```bash
npm run lint
```

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `@google/genai` | Gemini AI API integration |
| `@supabase/supabase-js` | Database (optional) |
| `express` | Backend server |
| `react` | Frontend framework |
| `vite` | Build tool & dev server |
| `tailwindcss` | Styling |
| `vite-plugin-pwa` | Progressive Web App support |

## 🌐 Features

✅ **AI Pharmacist Chat**: Powered by Gemini API  
✅ **Responsive Design**: Mobile-first with Tailwind CSS  
✅ **PWA Support**: Works offline with service workers  
✅ **Database Ready**: Optional Supabase integration  
✅ **Production Deployment**: Cloud Run support  

## 🔐 Security Notes

- ✅ API keys are managed through AI Studio's Secrets panel (never committed to repo)
- ✅ `.env.example` shows template only, actual keys are injected at runtime
- ✅ All secrets are encrypted in AI Studio
- ✅ No Datadog monitoring (removed for simplicity)

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Change port in server.ts or kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

### Build Fails
```bash
npm clean-install  # Clear node_modules and reinstall
npm run lint       # Check for TypeScript errors
```

### Environment Variables Not Loading
- Verify secrets are set in AI Studio's Secrets panel
- Check that variable names match exactly in code

## 📚 Documentation

- [Google AI Studio Docs](https://ai.google.dev/docs)
- [Gemini API Reference](https://ai.google.dev/api)
- [Express.js Guide](https://expressjs.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Supabase Docs](https://supabase.com/docs) (optional)

## 🚀 Deployment Checklist

- [ ] Repository connected to AI Studio
- [ ] `GEMINI_API_KEY` secret configured
- [ ] `npm run build` completes successfully locally
- [ ] `npm run lint` passes without errors
- [ ] Pushed to `main` branch
- [ ] AI Studio shows successful deployment
- [ ] App loads and AI chat responds

## 📝 Migration Notes

- ✅ **Datadog Removed**: Original monitoring workflow has been removed
- ✅ **AI Studio Ready**: Project is configured for Google AI Studio deployment
- ✅ **CI/CD Pipeline**: New `ai-studio-ci.yml` workflow replaces Datadog testing
- ✅ **Environment Config**: Updated `.env.example` for AI Studio compatibility

---

**Repository**: [ELMOURABEA/Bph](https://github.com/ELMOURABEA/Bph)  
**Live App**: [bph-two.vercel.app](https://bph-two.vercel.app)  
**Template**: Based on [AI Studio Repository Template](https://github.com/google-gemini/aistudio-repository-template)
