# SDM Security Policy

## Overview
This document outlines the security measures and best practices for the SDM (Seodaemun Church Platform) production environment.

## Firebase Security Configuration

### Authentication
- **Email/Password**: Standard Firebase authentication with email verification required
- **OAuth Providers**: Google and Kakao OAuth integration
- **Session Management**: Firebase Auth handles session persistence securely
- **Password Requirements**: Enforced by Firebase Auth default policies

### Firestore Security Rules
All data access is protected by Firestore Security Rules deployed in `firestore.rules`:

#### User Data Protection
```
- Users can only read/write their own document
- Leaders and admins can read all user documents
- Sensitive fields (role, approvalStatus) cannot be modified by users
```

#### Content Protection
```
- Announcements: Admin-only write, approved member read
- Events/Schedules: Admin-only write, approved member read
- Bulletins: Admin-only write, approved member read
- Playlists: Admin-only write, approved member read
```

#### Personal Data
```
- QT Entries: Owner-only access, leaders can read, admins can manage
- Prayer Requests: Community read, owner/leader update, admin delete
```

#### Role-Based Access Control
- **User**: Basic access to published content, personal data management
- **Leader**: Additional read access to community data, can mark prayers as answered
- **Admin**: Full access to content management and user administration
- **Super Admin**: Full system access and configuration

### Data Validation
All Firestore writes are validated to ensure:
- Required fields are present
- Data types are correct
- Users cannot escalate their own privileges
- Timestamps are server-generated
- Deleted records are handled appropriately

## Frontend Security

### Environment Variables
- All Firebase keys are in `NEXT_PUBLIC_*` environment variables
- Only public keys are stored (web SDK keys)
- No private keys or service account credentials in codebase
- `.env.local` file is gitignored and never committed

### Console Logging
- Removed all console.log statements from production code
- Error handling is silent to avoid exposing sensitive information
- Build process strips development code

### Source Maps
- Production builds have source maps disabled
- Reduces attack surface and prevents reverse engineering

## Vercel Deployment Security

### HTTPS Enforcement
- All traffic automatically uses HTTPS
- HTTP requests are redirected to HTTPS
- HSTS headers configured for maximum duration

### Security Headers
- **X-Content-Type-Options**: nosniff (prevents MIME sniffing)
- **X-Frame-Options**: SAMEORIGIN (prevents clickjacking)
- **X-XSS-Protection**: 1; mode=block (XSS protection)
- **Referrer-Policy**: strict-origin-when-cross-origin (referrer privacy)

### Build Security
- Only dependencies from npm registry are used
- Lock files (pnpm-lock.yaml) ensure reproducible builds
- Vercel builds in isolated, ephemeral environments
- No access to production secrets during build process

## Authentication Security

### Email Verification
- Users must verify their email before full access
- Verification emails use Firebase Auth secure links
- Re-verification required if email is changed

### Admin Approval
- New users start with "pending" approval status
- Admins manually approve users
- Rejected users cannot access the platform
- Users can be deactivated without deletion

### Session Management
- Sessions are managed by Firebase Auth
- Client-side sessions stored securely in IndexedDB
- No session tokens in cookies (HTTP-only cookies not used for compatibility)

## Data Protection

### Backup & Recovery
- Firestore provides automatic daily backups
- Restore points available for 35 days
- Enable automated backups in Firebase Console

### Data Retention
- User data retained for account lifetime
- Deleted accounts scheduled for permanent deletion
- Prayer requests archived after resolution

### User Privacy
- No analytics data collection of sensitive information
- GDPR-compliant data handling
- Users can request data export

## Operational Security

### Monitoring
- Enable Firebase Security Alerts
- Monitor Firestore database usage and growth
- Review Firebase authentication logs regularly

### Updates
- Keep Next.js updated to latest security patches
- Update Firebase SDK regularly
- Review security advisories for all dependencies

### Access Control
- Limit Firebase Console access to authorized users only
- Use Firebase Identity and Access Management (IAM)
- Enable two-factor authentication on Firebase accounts

## Incident Response

### Potential Security Issues
If you discover a security vulnerability:

1. **Do not** publicly disclose the vulnerability
2. Contact the development team immediately
3. Provide detailed reproduction steps
4. Allow time for patches before public disclosure

### Incident Procedures
1. Immediate response: Assess severity and impact
2. Mitigation: Deploy fixes or temporary measures
3. Communication: Notify affected users if necessary
4. Post-mortem: Document lessons learned

## Regular Security Review

### Monthly
- Review Firestore Security Rules for compliance
- Check Firebase authentication logs for suspicious activity
- Review user approval queue

### Quarterly
- Update Firebase SDK and dependencies
- Security audit of code changes
- Review and update this security policy

### Annually
- Full security assessment
- Penetration testing consideration
- Update backup and recovery procedures

## Compliance

### Standards Followed
- OWASP Top 10 mitigation practices
- Firebase best practices
- Next.js security recommendations
- GDPR privacy principles

### Privacy Policy
- Maintain clear privacy policy
- Transparent data collection practices
- User consent for any data processing

## Contact & Support

For security issues or questions:
- Contact the development team
- Do not report security issues in public issues
- Use secure channels for sensitive information

## Acknowledgments

Security is a shared responsibility. Thanks to all contributors for maintaining secure practices.

---

Last Updated: 2026-06-28
Version: 1.0 (Sprint 8)
