# SDM (Seodaemun Church Platform) - Production Deployment Guide

## Overview
SDM is a Next.js (App Router) progressive web application for church management. This guide covers deployment to Vercel.

## Sprint 8: Production Deployment & Optimization

### Changes Made
- ✅ Removed console.log statements from production code
- ✅ Configured Firebase initialization with singleton pattern
- ✅ Added production security headers in next.config
- ✅ Disabled source maps in production for security
- ✅ Created .env.local.example for Firebase configuration
- ✅ Verified all builds pass with zero errors
- ✅ Confirmed TypeScript and linting compliance

## Prerequisites

### Local Development
1. Node.js 18+ and pnpm
2. Firebase project with Web SDK configured
3. Environment variables set in .env.local

### Required Environment Variables
Copy `.env.local.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Firebase project credentials from [Firebase Console](https://console.firebase.google.com/):

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=1:your_sender_id:web:your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Build & Deployment

### Local Build
```bash
cd sdm
pnpm install
pnpm build
pnpm start
```

### Vercel Deployment

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Sprint 8: Production Deployment, Security Hardening, and Performance Optimization"
git push origin main
```

#### Step 2: Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `sdm/`
4. Add environment variables (copy from .env.local)
5. Deploy

#### Step 3: Configure Firestore Security Rules
Update your Firestore security rules to match the production-safe configuration in `firestore.rules`. This ensures:
- Users can only access their own documents
- Leaders can read and update community data
- Admins have appropriate permissions
- Public content is readable by approved members

### Production Verification

#### Security Checks
- ✅ No hardcoded Firebase keys in codebase
- ✅ No console logs in production
- ✅ HTTPS enforced on Vercel
- ✅ Security headers configured
- ✅ Firebase singleton initialization

#### Performance Checks
- ✅ Static page prerendering
- ✅ Optimized bundle size
- ✅ No unnecessary re-renders
- ✅ Proper dependency injection

#### Functionality Checks
- Test authentication flow (login/register)
- Verify user profiles and approvals
- Test QT and prayer features
- Check admin dashboard
- Verify announcements and schedules

## Troubleshooting

### Build Fails with Firebase Error
**Problem**: `Firebase: Error (auth/invalid-api-key)`
**Solution**: Ensure `.env.local` exists with valid Firebase credentials before building

### Pages Not Loading
**Problem**: Blank page or 404
**Solution**: Check browser console for errors. Verify Firebase project is accessible.

### Features Not Working
**Problem**: Prayers/QT not saving
**Solution**: 
1. Check Firestore security rules are deployed
2. Verify Firebase credentials are correct
3. Check user has admin approval status

## Architecture

### Frontend Structure
- `app/` - Next.js App Router pages
- `components/` - Reusable React components
- `features/` - Feature-based modules (auth, etc.)
- `services/` - Firebase and data services
- `hooks/` - Custom React hooks

### Firebase Integration
- **Authentication**: Email/password and OAuth (Google, Kakao)
- **Firestore**: Real-time database with security rules
- **Collections**: users, qt_entries, prayer_requests, announcements, events, etc.

### Security Architecture
- Firestore security rules enforce RBAC (Role-Based Access Control)
- Super Admin, Admin, Leader, and User roles
- Approval workflow for new users
- Sensitive fields protected from client-side modification

## Performance Metrics

Build optimizations completed:
- Next.js Turbopack compilation
- Static page prerendering (28 pages)
- Production bundle optimizations
- Source maps disabled in production

## Support & Maintenance

### Monitoring
- Check Vercel deployment logs for errors
- Monitor Firestore usage and costs
- Review Firebase authentication logs

### Updates
- Keep Next.js and Firebase SDK updated
- Review security advisories
- Test changes before merging to main

## References
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
