# Google Analytics 4 Setup Guide for jayleekr.github.io

## Step 1: Create GA4 Property

1. **Go to Google Analytics**: https://analytics.google.com/
2. **Click Admin** (gear icon in bottom left)
3. **Create Property**:
   - Property name: `jayleekr.github.io Blog`
   - Time zone: Select your timezone
   - Currency: Select your currency
   - Click "Show advanced options"
   - Toggle ON "Create a Universal Analytics property"
   - Enter website URL: `https://jayleekr.github.io`
   - Select "Create both a Google Analytics 4 and a Universal Analytics property"
   - Click "Next"

4. **Business Information**:
   - Industry category: Technology
   - Business size: Small
   - How you intend to use GA: 
     - [x] Measure content engagement
     - [x] Examine user behavior
     - [x] Improve the performance
   - Click "Create"

5. **Get your Measurement ID**:
   - It will look like: `G-XXXXXXXXXX`
   - Copy this ID

## Step 2: Update Your Configuration

1. **Edit `_config.yml`**:
```yaml
# Google Analytics
google_analytics:
  ga4_id: 'G-XXXXXXXXXX'  # Replace with your actual Measurement ID
```

2. **Save the file**

## Step 3: Configure Custom Dimensions in GA4

1. **In GA4, go to Admin → Custom definitions**
2. **Create these 5 custom dimensions**:

| Dimension name | Scope | Description | Parameter name |
|----------------|-------|-------------|----------------|
| Author | Event | Blog post author | author |
| Category | Event | Blog post category | category |
| Tags | Event | Blog post tags | tags |
| Reading Time | Event | Estimated reading time | reading_time |
| Language | User | User's preferred language | language |

3. **For each dimension**:
   - Click "Create custom dimensions"
   - Enter the information from the table
   - Click "Save"

## Step 4: Configure Events

1. **Go to Admin → Events**
2. **These events will be automatically tracked**:
   - `page_view` - Standard page views
   - `scroll` - Scroll depth (25%, 50%, 75%, 90%)
   - `search` - Site search usage
   - `reading_progress` - Article reading milestones
   - `theme_toggle` - Theme switching
   - `social_share` - Social media sharing
   - `pwa_install` - PWA installation
   - `link_click` - External link clicks

## Step 5: Deploy Changes

```bash
# Commit the configuration change
git add _config.yml
git commit -m "feat: Add GA4 Measurement ID

- Configure Google Analytics 4 tracking
- Enable custom dimensions and events
- Set up privacy-compliant analytics

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to GitHub
git push origin master
```

## Step 6: Verify Installation

1. **Install GA Debugger Chrome Extension**: 
   https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna

2. **Visit your site**: https://jayleekr.github.io
3. **Open Chrome DevTools** (F12)
4. **Go to Console tab**
5. **Enable GA Debugger** (click extension icon)
6. **Refresh the page**
7. **Look for**:
   - "Sending page_view" messages
   - Your Measurement ID in the logs
   - No error messages

## Step 7: Real-time Verification

1. **In GA4, go to Reports → Realtime**
2. **Visit your site in another tab**
3. **You should see**:
   - Your visit appear in real-time
   - Events firing as you interact
   - Geographic location (if not using VPN)

## Step 8: Set Up Audiences

1. **Go to Admin → Audiences**
2. **Create these audiences**:
   - Mobile Users: Device category = mobile
   - Engaged Readers: Reading progress > 75%
   - Returning Visitors: User type = returning
   - PWA Users: Has pwa_install event

## Step 9: Configure Conversions

1. **Go to Admin → Conversions**
2. **Mark these events as conversions**:
   - `reading_complete` - Finished reading article
   - `pwa_install` - Installed PWA
   - `search_success` - Found content via search

## Step 10: Privacy & Consent

1. **Consent Mode is already configured** in your implementation
2. **Users will see consent banner** on first visit
3. **Analytics only tracks after consent**
4. **IP anonymization is enabled** by default

## Troubleshooting

### Analytics not showing up?
1. Check browser console for errors
2. Verify Measurement ID is correct
3. Disable ad blockers temporarily
4. Check if consent was given

### Events not tracking?
1. Use GA Debugger to see event details
2. Check parameter names match exactly
3. Verify custom dimensions are created

### Need help?
- GA4 Help Center: https://support.google.com/analytics
- Debug mode: Add `?debug_mode=true` to any URL
- Check `/status.html` for site health

## Next Steps

1. **Monitor for 24-48 hours** to collect baseline data
2. **Set up custom reports** for your KPIs
3. **Configure email alerts** for traffic spikes/drops
4. **Create dashboard** for quick monitoring
5. **Export to BigQuery** (optional) for advanced analysis