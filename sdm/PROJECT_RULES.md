# SDM Project Development Guide

> **Project Name:** SDM  
> **Subtitle:** 서대문교회 청년부  
> **Version:** 1.0.0

---

## Mission

Build a production-ready church youth platform that is **secure, scalable, maintainable, mobile-first, and enterprise quality**.

---

## Development Principles

The following principles must be followed by every contributor. No exceptions.

1. **Never break existing features.** All changes must be additive or backward-compatible.
2. **Reuse components whenever possible.** If a component exists, use it. Do not recreate.
3. **Never duplicate code.** Extract shared logic into hooks, utilities, or components.
4. **Keep files small and maintainable.** One file should do one thing well.
5. **Use TypeScript strict mode.** Every variable, function, and prop must be typed.
6. **Use Zod for validation.** All form inputs and API payloads must be validated.
7. **Use Firebase Authentication.** Auth is centralized. Never build custom auth.
8. **Use Firestore with converters.** Every collection has a typed converter.
9. **Use React Hook Form.** All forms use `react-hook-form` with `zodResolver`.
10. **Mobile-first responsive UI.** Design for mobile first, then scale up.
11. **Accessibility must be considered.** ARIA labels, keyboard navigation, and focus management.
12. **Every feature must support future expansion.** Design for tomorrow, not just today.
13. **Never hardcode secrets.** API keys, credentials, and config must use environment variables.
14. **Always use environment variables.** `process.env.NEXT_PUBLIC_*` for public, `process.env.*` for private.
15. **Every feature must be production-ready before completion.** No placeholders, no TODOs in merged code.

---

## Architecture

### Feature-Based Architecture

```
features/
  auth/          → Authentication (login, register, logout, roles)
  member/        → Member management
  prayer/        → Prayer requests
  calendar/      → Events and schedules
  bible/         → Bible search and reading
  bulletin/      → Church bulletin
  worship/       → Worship playlists
  admin/         → Admin dashboard and controls
  notification/  → Notifications
```

Each feature contains:

- `components/` — Feature-specific UI components
- `hooks/` — Feature-specific React hooks
- `services/` — API calls and business logic
- `types/` — Feature-specific types

### Shared Resources

```
components/
  ui/            → Reusable UI components (Button, Input, Card, Modal)
  layout/        → Layout components (Header, Sidebar, Footer)
  common/        → Common components (Spinner, ErrorBoundary, EmptyState)

lib/             → Utilities, helpers, validation schemas
utils/           → Pure utility functions
constants/       → App constants, routes, colors
hooks/           → Shared React hooks
services/        → Shared API services
types/           → Global TypeScript types
models/          → Firestore data models and converters
firebase/        → Firebase configuration and initialization
```

### Clean Architecture

```
UI Layer (Components) ← Feature Layer (Hooks, Services) ← Data Layer (Firestore, Auth)
```

### SOLID Principles

- **Single Responsibility:** One file, one class, one function does one thing.
- **Open/Closed:** Open for extension, closed for modification.
- **Liskov Substitution:** Subtypes must be substitutable for their base types.
- **Interface Segregation:** Small, focused interfaces over large general ones.
- **Dependency Inversion:** Depend on abstractions, not concretions.

---

## Coding Standards

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `AuthButton`, `UserProfile` |
| Hooks | camelCase, prefix `use` | `useAuth`, `useMembers` |
| Variables | camelCase | `isLoading`, `userProfile` |
| Constants | SCREAMING_SNAKE_CASE | `API_BASE_URL`, `MAX_RETRY_COUNT` |
| Folders | kebab-case | `auth-service`, `user-profile` |
| Types/Interfaces | PascalCase | `UserProfile`, `AuthState` |
| Enums | PascalCase, PascalCase values | `UserRole.Admin` |
| Files | PascalCase for components, camelCase for others | `AuthButton.tsx`, `useAuth.ts` |

### File Organization

- **One component per file.**
- **One responsibility per file.**
- Maximum **200 lines** per file. If a file exceeds this, split it.
- Use **index.ts** for clean exports.

### TypeScript

```typescript
// Strict mode enabled
// No `any` types
// Explicit return types on exported functions
// Use `unknown` instead of `any` when type is uncertain
```

---

## Git Rules

### Conventional Commits

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style (formatting, no logic change) |
| `refactor` | Code refactoring |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `chore` | Build, dependencies, tooling |
| `ci` | CI/CD changes |
| `revert` | Revert a previous commit |

**Examples:**

```
feat(auth): add Kakao OAuth login
fix(member): resolve profile image upload error
docs(readme): update installation instructions
```

### Commit Rules

- **Small commits.** One logical change per commit.
- **Clean commit history.** Rebase before merging if needed.
- **Write meaningful messages.** Explain what and why, not just how.
- **No commits with broken code.** Every commit must be buildable.

---

## UI Style Guide

### Design Philosophy

Inspired by **Apple**, **Toss**, and modern SaaS applications.

- Clean, minimal, and purposeful
- Content-first hierarchy
- Subtle depth and motion
- Consistent spacing and rhythm

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#2563EB` | Buttons, links, active states |
| Primary Hover | `#1D4ED8` | Button hover |
| Background | `#F8FAFC` | Page background (light) |
| Background Dark | `#0A0A0A` | Page background (dark mode) |
| Surface | `#FFFFFF` | Cards, modals (light) |
| Surface Dark | `#1C1C1E` | Cards, modals (dark mode) |
| Text Primary | `#171717` | Headings, body text (light) |
| Text Secondary | `#737373` | Subtext, labels |
| Text Muted | `#A3A3A3` | Placeholders, hints |
| Border | `#E5E5E5` | Dividers, input borders (light) |
| Border Dark | `#262626` | Dividers, input borders (dark mode) |
| Success | `#22C55E` | Success states |
| Warning | `#EAB308` | Warning states |
| Danger | `#EF4444` | Error states |

### Typography

| Level | Size | Weight | Line Height |
|-------|------|--------|-------------|
| H1 | 28px | 600 | 1.2 |
| H2 | 24px | 600 | 1.3 |
| H3 | 20px | 600 | 1.4 |
| Body | 16px | 400 | 1.5 |
| Small | 14px | 400 | 1.5 |
| Caption | 12px | 400 | 1.4 |

### Spacing Scale

| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |

### Card Design

- **Border Radius:** `16px`
- **Shadow:** `0 2px 20px -4px rgba(0, 0, 0, 0.08)` (light)
- **Shadow Dark:** `0 2px 20px -4px rgba(0, 0, 0, 0.3)` (dark)
- **Background:** White (light), `#1C1C1E` (dark)

### Buttons

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| Primary | `#2563EB` | White | None |
| Secondary | White | `#171717` | `#E5E5E5` |
| Ghost | Transparent | `#525252` | None |
| Danger | `#EF4444` | White | None |

### Form Inputs

- **Border Radius:** `12px`
- **Height:** `48px`
- **Border:** `1px solid #E5E5E5` (default), `#2563EB` (focus)
- **Focus Ring:** `2px solid rgba(37, 99, 235, 0.1)`
- **Placeholder:** `#A3A3A3`
- **Error Border:** `#EF4444`

### Animations

- **Transition:** `all 150ms ease`
- **Hover:** `transform: scale(1.02)` (subtle)
- **Loading:** `spin` animation on icons
- **Modal:** `fade-in` + `slide-up` (200ms)
- **Page:** Smooth scroll, `scroll-behavior: smooth`

### Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| sm | 640px | Small tablets |
| md | 768px | Tablets |
| lg | 1024px | Small desktops |
| xl | 1280px | Large desktops |
| 2xl | 1536px | Extra large screens |

### Accessibility Requirements

- Minimum contrast ratio: **4.5:1** for normal text, **3:1** for large text
- All interactive elements must be keyboard accessible
- Focus indicators must be visible (`outline: 2px solid #2563EB`)
- ARIA labels for icons and non-text elements
- `role` and `aria-*` attributes for custom components
- Screen reader friendly content ordering

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 15 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Auth | Firebase Auth | 10.x |
| Database | Firestore | 10.x |
| Forms | React Hook Form | 7.x |
| Validation | Zod | 3.x |
| Icons | Lucide React | latest |
| Utilities | clsx, tailwind-merge | latest |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Firebase Storage Bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Firebase App ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | No | Firebase Analytics Measurement ID |

---

## Firestore Collections

| Collection | Description |
|------------|-------------|
| `users` | Member profiles and roles |
| `announcements` | Church announcements |
| `events` | Calendar events and schedules |
| `prayer_requests` | Prayer requests and testimonies |
| `bulletins` | Weekly church bulletins |
| `playlists` | Worship song playlists |
| `attendance` | Attendance records |
| `notifications` | User notifications |
| `audit_logs` | System audit logs |
| `ministries` | Ministry groups |
| `cell_groups` | Cell group information |
| `sermons` | Sermon archives |

---

## Future Roadmap

The following features are planned for future releases. Every current feature must be designed to support these expansions.

- **QR Attendance** — QR code-based attendance tracking
- **Push Notifications** — Firebase Cloud Messaging integration
- **Bible Search** — Full-text Bible search with multiple versions
- **Worship Playlist** — Song management with chord sheets and lyrics
- **Church Bulletin** — Digital bulletin with PDF upload
- **Admin Dashboard** — Analytics and member management
- **Analytics** — Church activity metrics and reports
- **PWA** — Progressive Web App with offline support
- **Multi-language Support** — Korean, English, and more
- **Offline Support** — Firestore offline persistence and sync

---

## Testing Requirements

- **Unit Tests:** Every utility function and hook
- **Component Tests:** Every UI component with critical paths
- **Integration Tests:** Every feature flow (login, form submission, etc.)
- **E2E Tests:** Critical user journeys

### Testing Principles

- Test behavior, not implementation
- Mock external dependencies (Firebase, APIs)
- Test accessibility (keyboard navigation, screen readers)
- Test responsive behavior

---

## Performance Standards

- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3.5s
- **Bundle Size:** < 200KB (initial JS)
- **Images:** Use Next.js Image component with optimization
- **Fonts:** Use `next/font` for optimal loading
- **Code Splitting:** Dynamic imports for heavy components

---

## Security Standards

- Never commit secrets to the repository
- Use Firebase Security Rules for data access control
- Validate all inputs on both client and server
- Sanitize user-generated content
- Use HTTPS for all communications
- Implement proper CORS policies
- Rate limit API endpoints

---

## Code Review Checklist

Before submitting code for review, ensure:

- [ ] All TypeScript errors are resolved
- [ ] No `console.log` or debug statements remain
- [ ] No `any` types are used
- [ ] All new code has proper types
- [ ] Components are reusable where possible
- [ ] No code duplication
- [ ] Accessibility requirements are met
- [ ] Mobile responsiveness is verified
- [ ] Dark mode is supported
- [ ] Zod validation is applied to forms
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Commits follow conventional commit format
- [ ] Commit messages are meaningful

---

## Contact & Resources

- **Project:** SDM (서대문교회 청년부)
- **Repository:** https://github.com/zzvvxxbaal/sdm
- **Tech Lead:** [Team Lead]

---

> *This document is a living guide. Propose changes through pull requests with clear justification.*
