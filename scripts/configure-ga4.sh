#!/bin/bash

# GA4 Configuration Script for jayleekr.github.io

echo "🎯 Google Analytics 4 Configuration Helper"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "_config.yml" ]; then
    echo "❌ Error: _config.yml not found. Please run this script from the root of your Jekyll site."
    exit 1
fi

# Prompt for GA4 Measurement ID
echo "📊 Please enter your GA4 Measurement ID"
echo "   (It should look like: G-XXXXXXXXXX)"
echo ""
read -p "GA4 Measurement ID: " GA4_ID

# Validate the format
if [[ ! $GA4_ID =~ ^G-[A-Z0-9]{10}$ ]]; then
    echo "❌ Error: Invalid GA4 Measurement ID format."
    echo "   It should start with 'G-' followed by 10 alphanumeric characters."
    exit 1
fi

# Create a backup of the config file
cp _config.yml _config.yml.backup
echo "✅ Created backup: _config.yml.backup"

# Update the configuration
sed -i.tmp "s/ga4_id: 'G-XXXXXXXXXX'/ga4_id: '$GA4_ID'/" _config.yml
rm -f _config.yml.tmp

echo "✅ Updated _config.yml with GA4 ID: $GA4_ID"
echo ""

# Show the change
echo "📝 Configuration updated:"
grep -A 2 "ga4_id:" _config.yml

echo ""
echo "🚀 Next steps:"
echo "1. Commit and push the changes:"
echo "   git add _config.yml"
echo "   git commit -m 'feat: Configure GA4 Measurement ID'"
echo "   git push origin master"
echo ""
echo "2. Wait 2-3 minutes for GitHub Pages to rebuild"
echo ""
echo "3. Visit your site and check analytics are working:"
echo "   https://jayleekr.github.io"
echo ""
echo "4. Check real-time data in GA4:"
echo "   https://analytics.google.com/analytics/web/"
echo ""
echo "✨ Configuration complete!"