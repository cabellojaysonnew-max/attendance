
SECURITY UPDATE (NO SUBFOLDERS VERSION)

Files:
- dashboard.js  → Replace existing file
- log-attendance.ts → Supabase Edge Function

Deploy steps:

1. Replace dashboard.js in repository.
2. In Supabase CLI project create:
   supabase/functions/log-attendance/
3. Rename log-attendance.ts → index.ts
4. Deploy:

   supabase functions deploy log-attendance
