
DAR ATTENDANCE SYSTEM (FINAL DEPLOYMENT)

FEATURES:
- Mobile login
- GPS required logging
- One-device registration
- Max 4 logs/day (IN OUT IN OUT)
- Reverse geolocation
- DAR Green + Gold UI

DEPLOY:
1. Upload HTML/CSS/JS files to hosting (GitHub Pages/Vercel).
2. Rename log-attendance.ts -> index.ts
3. Place inside: supabase/functions/log-attendance/
4. Run: supabase functions deploy log-attendance
