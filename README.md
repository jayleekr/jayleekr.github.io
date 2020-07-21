# J's Github Blog 

## 1. How to expose jekyll blog into Google Search

### 1.1 Activate sitemap

Modify _config.yml
``` yml
plugins: ['jekyll-paginate', 'jekyll-sitemap', 'jekyll-include-cache', 'jekyll-gist']
```

### 1.2 Add robots.txt

``` txt
User-agent: *
Allow:/

Sitemap: https://jayleekr.github.io/sitemap.xml
```

### 1.3 Register sitemap to google search console

1. Go to https://www.google.com/webmasters
2. Click **SEARCH CONSOLE**

