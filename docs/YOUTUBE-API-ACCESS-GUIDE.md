# YouTube API Access - Implementation Guide

## 🎯 Objective

Enable YouTube Data API v3 access for the BAPI YouTube channel (@BAPIHVAC) to automatically sync videos to product pages.

---

## 👥 Who to Contact

### Potential Channel Owners/Managers:

1. **Marketing Manager/Director**
   - Usually owns company YouTube channel
   - Has access to Google Brand Account
   - Can grant API permissions

2. **IT/Digital Marketing Team**
   - May manage social media accounts
   - Often has Google Workspace admin access

3. **CEO/Founder**
   - Ultimate account owner
   - Can delegate access if needed

4. **Social Media Manager**
   - Day-to-day YouTube management
   - May have Brand Account access

### How to Find Out:

**Option 1: Check YouTube Channel**
1. Go to https://www.youtube.com/@BAPIHVAC
2. Click "About" tab
3. Look for business email or contact info
4. Email: "Who manages our YouTube channel?"

**Option 2: Ask Internal Team**
- Email marketing team: "Who has access to our YouTube channel?"
- Check company org chart for marketing/digital media roles
- Ask IT department about Google Workspace admins

**Option 3: Google Workspace Admin**
- If BAPI uses Google Workspace, the admin can see who owns the Brand Account
- YouTube channels created with Brand Accounts can have multiple managers

---

## 📝 Email Template: Request API Access

Use this template to request access from the channel owner:

```
Subject: Request: YouTube API Access for Product Page Video Integration

Hi [Name],

I'm working on integrating our YouTube product videos (@BAPIHVAC) into our new 
e-commerce website to improve customer experience and SEO.

To automate this process, I need to enable the YouTube Data API v3 on our 
Google Cloud account. This will allow our system to:
- Automatically fetch videos from our channel
- Map videos to specific products
- Display them on product pages with optimized performance

REQUIRED ACCESS:
1. YouTube channel owner/manager permissions (to verify ownership)
2. Google Cloud Console access (to enable API and create key)
   OR
3. Ability to create an API key on my behalf

TIME COMMITMENT: ~15 minutes
RISK: None - API is read-only, no changes to channel
COST: Free (10,000 API calls/day quota)

Can you help with this? I can provide step-by-step instructions or walk 
through it together.

Launch target: May 4, 2026

Thanks!
[Your Name]
```

---

## 🔐 Required Permissions

The person you contact needs **ONE** of these:

### Option A: Brand Account Manager (Preferred)
- Access to YouTube Studio (studio.youtube.com)
- Can verify channel ownership
- Can create/manage Google Cloud project

### Option B: Google Workspace Admin
- Can see Brand Account owners
- Can grant Brand Account access to you
- Can delegate API setup

### Option C: Google Cloud Project Owner
- If BAPI already has a Google Cloud project
- Can enable APIs and create keys
- May need channel verification

---

## 📋 Step-by-Step Setup Guide (For Channel Owner)

### Part 1: Access Google Cloud Console

1. **Go to:** https://console.cloud.google.com/
2. **Sign in** with the Google account that owns the YouTube channel
3. **Select or Create Project:**
   - If BAPI project exists: Select it
   - If not: Click "New Project"
     - Name: "BAPI Website Integration"
     - Click "Create"

### Part 2: Enable YouTube Data API v3

1. **Navigate to APIs:**
   - Left menu → "APIs & Services" → "Library"
   - Or direct link: https://console.cloud.google.com/apis/library

2. **Search for YouTube:**
   - Type "YouTube Data API v3" in search
   - Click on "YouTube Data API v3"

3. **Enable API:**
   - Click blue "Enable" button
   - Wait for confirmation (~10 seconds)

### Part 3: Create API Key

1. **Go to Credentials:**
   - Left menu → "APIs & Services" → "Credentials"
   - Or: https://console.cloud.google.com/apis/credentials

2. **Create Key:**
   - Click "+ CREATE CREDENTIALS" at top
   - Select "API key"
   - Key will be generated automatically

3. **Restrict Key (IMPORTANT for security):**
   - Click "Edit API key" (pencil icon)
   - Under "API restrictions":
     - Select "Restrict key"
     - Check ONLY "YouTube Data API v3"
   - Under "Application restrictions" (optional but recommended):
     - Select "IP addresses"
     - Add Vercel deployment IPs (or leave as "None" for now)
   - Click "Save"

4. **Copy API Key:**
   - Click the copy icon
   - **KEEP THIS SECRET** - treat like a password
   - Send to you via secure method (encrypted email, 1Password, etc.)

### Part 4: Verify Channel Access

1. **Test in API Explorer:**
   - Go to: https://developers.google.com/youtube/v3/docs/channels/list
   - Click "Try this API" in right panel
   - Set parameters:
     - `part`: snippet
     - `forUsername`: BAPIHVAC
   - Click "Execute"
   - Should return channel info (ID, title, etc.)

2. **Get Channel ID:**
   - Copy the `id` field from response
   - Format: `UCxxxxxxxxxxxxxxxxxx` (24 characters)
   - Send this to dev team along with API key

---

## 🔒 Security Best Practices

### API Key Protection:

✅ **DO:**
- Restrict to YouTube Data API v3 only
- Store in environment variables (never in code)
- Use separate keys for dev/staging/production
- Rotate keys every 90 days
- Monitor usage in Google Cloud Console

❌ **DON'T:**
- Commit keys to Git
- Share publicly
- Use in client-side code
- Leave unrestricted

### Who Should Have Access:

- **Read Access:** API key (dev team only)
- **Write Access:** None needed (read-only integration)
- **Admin Access:** Channel owner/manager only

---

## 📊 API Quota Information

### Free Tier Limits:
- **Daily Quota:** 10,000 units
- **Search:** 100 units per request
- **Videos.list:** 1 unit per request

### Our Usage Estimate:
- Initial fetch: ~200 units (all videos)
- Daily sync: ~50 units
- **Monthly total:** ~1,500 units (well within free tier)

### If We Hit Quota:
- Quota resets at midnight PST
- Can request increase (free, via Google Cloud Console)
- Can implement caching to reduce calls

---

## 🧪 Testing After Setup

Once you receive the API key, test with:

```bash
# Set environment variable
export YOUTUBE_API_KEY="your_key_here"

# Test fetch
cd web
pnpm run youtube:fetch -- --limit=5

# Should output:
# ✅ Fetched 5 videos
# 📄 CSV generated: youtube-videos.csv
```

---

## 🚨 Troubleshooting

### "API key not valid"
- Key may be restricted incorrectly
- Make sure YouTube Data API v3 is enabled
- Verify key is copied correctly (no extra spaces)

### "Channel not found"
- Wrong Google account signed in
- Channel might use Brand Account (check ownership)
- Try using Channel ID instead of username

### "Quota exceeded"
- Daily limit reached (10,000 units)
- Wait until midnight PST for reset
- Or request quota increase

### "Forbidden" or "Access denied"
- API not enabled in project
- Key restrictions too strict
- Wrong project selected

---

## 📞 Support Contacts

### Google Support:
- **YouTube Help:** https://support.google.com/youtube
- **API Support:** https://developers.google.com/youtube/v3/support
- **Cloud Console:** https://console.cloud.google.com/support

### Internal Escalation:
If you can't identify channel owner:
1. Check company Google Workspace admin
2. Review marketing budget/expenses (YouTube Premium?)
3. Check old emails for "YouTube Studio" notifications
4. Ask longest-tenured marketing employee

---

## ✅ Success Checklist

- [ ] Identified YouTube channel owner/manager
- [ ] Sent access request email
- [ ] Received API key securely
- [ ] Received Channel ID
- [ ] API key restricted to YouTube Data API v3
- [ ] Tested API key with test fetch
- [ ] Key stored in .env.local (local)
- [ ] Key added to GitHub Secrets (production)
- [ ] Documented who has access for future reference

---

## 📅 Timeline

**Estimated Time:**
- Finding channel owner: 1-2 days
- API setup (once contact found): 15 minutes
- Testing: 15 minutes
- **Total:** 2-3 days with some email back-and-forth

**For May 4 Launch:**
- Start this process ASAP
- Allows time for any access issues
- Gives buffer for testing

---

## 💡 Alternative: Manual Video Mapping

**If API access is delayed**, you can still launch with manual process:

1. **Export Channel Videos:**
   - Manually list videos in spreadsheet
   - Columns: video_id, title, URL, product_SKU

2. **Import to WordPress:**
   - Use WP All Import plugin
   - Map CSV to ACF fields
   - One-time setup (~2-3 hours)

3. **Enable API Later:**
   - Automation can be added post-launch
   - No changes needed to frontend code

---

## 📧 Follow-Up Template (If No Response)

```
Subject: Re: YouTube API Access - Time Sensitive (Launch: May 4)

Hi [Name],

Following up on my request for YouTube API access. We're launching the new 
e-commerce site on May 4, and product videos are a key feature.

If you're not the right person, could you point me to who manages our 
@BAPIHVAC YouTube channel?

Alternatively, I can:
1. Set up the API myself if you can grant me temporary access
2. Schedule a 15-min call to walk through it together
3. Provide detailed step-by-step instructions

What works best for you?

Thanks!
[Your Name]
```

---

**Created:** April 17, 2026  
**Purpose:** Enable YouTube API for video integration  
**Deadline:** May 4, 2026 (launch date)
