# Google Analytics 4 Setup Guide

This blog includes comprehensive Google Analytics 4 (GA4) tracking with privacy-focused settings and enhanced blog analytics.

## Setup Instructions

### 1. Create a Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property for your website
3. Copy your Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Configure Environment Variable

#### For Local Development:
Create a `.env` file in the project root:
```bash
# .env
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

#### For GitHub Pages Deployment:
Add the environment variable to your GitHub repository:
1. Go to your repository Settings
2. Navigate to Secrets and Variables > Actions
3. Click "New repository variable"
4. Name: `GOOGLE_ANALYTICS_ID`
5. Value: `G-XXXXXXXXXX`

#### For Other Hosting Platforms:
- **Vercel**: Add environment variable in project settings
- **Netlify**: Add environment variable in site settings
- **Cloudflare Pages**: Add environment variable in build settings

### 3. Update GitHub Actions (if using GitHub Pages)

If you're using GitHub Actions for deployment, update your workflow file to include the environment variable:

```yaml
# .github/workflows/deploy.yml
- name: Build with Astro
  run: npm run build
  env:
    GOOGLE_ANALYTICS_ID: ${{ vars.GOOGLE_ANALYTICS_ID }}
```

## Features Included

### Basic Analytics
- ✅ Page views with custom titles and locations
- ✅ Privacy-compliant settings (GDPR ready)
- ✅ IP anonymization
- ✅ Disabled ad personalization
- ✅ Development mode detection (no tracking on localhost)

### Enhanced Blog Analytics
- ✅ **Scroll Depth Tracking**: Measures user engagement (10%, 25%, 50%, 75%, 90%)
- ✅ **Reading Progress**: Tracks time spent and scroll percentage
- ✅ **External Link Clicks**: Monitors outbound traffic
- ✅ **Blog Category Views**: Tracks which categories are most popular
- ✅ **Search Usage**: Monitors global search feature usage
- ✅ **Theme Preferences**: Tracks dark/light mode usage
- ✅ **Language Preferences**: Monitors Korean/English preference

### Custom Dimensions and Metrics

The setup includes custom parameters for blog-specific analytics:
- `blog_category`: Main category of blog posts
- `reading_time`: Estimated reading time
- `content_group1`: Content grouping by category

## Privacy and Compliance

This implementation is designed with privacy in mind:

- ✅ **GDPR Compliant**: Anonymized IPs and disabled advertising features
- ✅ **No Tracking in Development**: Analytics disabled on localhost
- ✅ **Minimal Data Collection**: Only essential metrics for blog improvement
- ✅ **No Cross-Site Tracking**: Google Signals disabled
- ✅ **Transparency**: Clear tracking implementation visible in code

## Useful GA4 Reports

Once set up, you can create custom reports in GA4 for:

### Blog Performance Reports
1. **Popular Content**: Pages by views, reading time, and scroll depth
2. **Category Performance**: Which blog categories perform best
3. **User Engagement**: Reading progress and time on page
4. **Search Behavior**: How users interact with search functionality

### Technical Reports
1. **Theme Usage**: Dark vs light mode preference
2. **Language Preference**: Korean vs English usage
3. **External Link Performance**: Which external links are clicked most
4. **Mobile vs Desktop**: User behavior differences

### Custom Events to Monitor
- `scroll_depth`: User engagement measurement
- `reading_progress`: Content consumption metrics
- `search_open`: Search feature usage
- `theme_change`: User preference tracking
- `language_change`: Internationalization insights
- `external_link`: Outbound traffic monitoring

## Troubleshooting

### Analytics Not Working?
1. Verify the `GOOGLE_ANALYTICS_ID` environment variable is set correctly
2. Check that you're not testing on localhost (tracking is disabled in development)
3. Wait 24-48 hours for data to appear in GA4 reports
4. Use Google Analytics DebugView for real-time testing

### Common Issues
- **No data in reports**: GA4 can take 24-48 hours to show data
- **Development tracking**: Analytics are intentionally disabled on localhost
- **Environment variables**: Make sure the variable is properly set in your hosting platform

### Verification
You can verify the setup is working by:
1. Checking the browser's Network tab for `analytics.google.com` requests
2. Using Google Analytics DebugView (enable debug mode in GA4)
3. Monitoring the browser console for setup messages

## Data Usage and Insights

With this setup, you'll be able to analyze:
- Which blog posts are most engaging
- How users navigate your content
- What categories are most popular
- User preferences (theme, language)
- Content consumption patterns
- External traffic sources

This data helps improve the blog experience and create content that resonates with your audience.