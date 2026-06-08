# AI Studio Setup Guide

This repository is configured for Google AI Studio deployment.

## Prerequisites

- Google Cloud Account
- AI Studio access
- Gemini API key

## Configuration Steps

### 1. Set Up Environment Variables

Configure the following secrets in AI Studio's Secrets panel:

- **GEMINI_API_KEY**: Your Gemini API key (get from Google AI Studio)
- **SUPABASE_URL**: Your Supabase project URL (optional, for database features)
- **SUPABASE_ANON_KEY**: Your Supabase anonymous key (optional)
- **SUPABASE_SERVICE_ROLE_KEY**: Your Supabase service role key (optional)

### 2. Local Development

Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Add your actual API keys to `.env`.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Project Structure

- **src/**: React frontend components
- **server.ts**: Express backend server with Gemini API integration
- **public/**: Static assets
- **api/**: API route handlers (if applicable)

## Deployment

AI Studio handles deployment automatically:

1. Push code to your GitHub repository
2. AI Studio detects changes
3. Automatic build and deployment to Cloud Run
4. Service URL provided by AI Studio

## Features

- **AI Pharmacist Chat**: Integration with Gemini API for pharmaceutical consultations
- **Supabase Database**: Optional database integration for user data
- **PWA Support**: Progressive Web App capabilities for offline functionality
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Support

For issues with:
- **Gemini API**: Check [Google AI Studio Documentation](https://ai.google.dev/docs)
- **Supabase**: Visit [Supabase Docs](https://supabase.com/docs)
- **Deployment**: Refer to AI Studio documentation

## Removing Datadog

The Datadog synthetic testing workflow has been removed. If you were using it:

1. ✅ Removed `.github/workflows/datadog-synthetics.yml`
2. ✅ Removed Datadog secrets from repository
3. ✅ Updated environment configuration for AI Studio

To remove Datadog secrets from GitHub:
1. Go to repository Settings
2. Navigate to Secrets and variables → Actions
3. Delete any `DD_API_KEY` and `DD_APP_KEY` secrets
