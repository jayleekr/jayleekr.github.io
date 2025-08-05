<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/rss">
    <html>
      <head>
        <title><xsl:value-of select="channel/title"/> RSS Feed</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            text-align: center;
          }
          .header h1 {
            margin: 0 0 0.5rem 0;
            font-size: 2rem;
          }
          .header p {
            margin: 0;
            opacity: 0.9;
          }
          .info-box {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 2rem;
          }
          .info-box h2 {
            margin-top: 0;
            color: #2d3748;
          }
          .feed-url {
            background: #f7fafc;
            border: 1px solid #cbd5e0;
            border-radius: 4px;
            padding: 0.5rem;
            font-family: monospace;
            word-break: break-all;
            margin: 0.5rem 0;
          }
          .item {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            transition: box-shadow 0.2s ease;
          }
          .item:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .item h3 {
            margin: 0 0 0.5rem 0;
            color: #2d3748;
          }
          .item h3 a {
            color: #4299e1;
            text-decoration: none;
          }
          .item h3 a:hover {
            text-decoration: underline;
          }
          .item-meta {
            color: #718096;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
          }
          .item p {
            margin: 0;
            color: #4a5568;
          }
          .categories {
            margin-top: 0.5rem;
          }
          .category {
            display: inline-block;
            background: #edf2f7;
            color: #4a5568;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            margin-right: 0.5rem;
            margin-top: 0.25rem;
          }
          .subscribe-button {
            background: #4299e1;
            color: white;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 6px;
            text-decoration: none;
            display: inline-block;
            font-weight: 500;
            transition: background-color 0.2s ease;
          }
          .subscribe-button:hover {
            background: #3182ce;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1><xsl:value-of select="channel/title"/></h1>
          <p><xsl:value-of select="channel/description"/></p>
        </div>
        
        <div class="info-box">
          <h2>📡 RSS Feed</h2>
          <p>This is an RSS feed. RSS feeds allow you to stay up to date with the latest posts. You can subscribe to this feed using your favorite RSS reader.</p>
          
          <p><strong>Feed URL:</strong></p>
          <div class="feed-url">
            <xsl:value-of select="concat('https://', substring-after(substring-after(channel/link, '://'), '/'), '/rss.xml')"/>
          </div>
          
          <p style="margin-top: 1rem;">
            <strong>Popular RSS Readers:</strong> Feedly, Inoreader, NetNewsWire, Reeder
          </p>
        </div>

        <div class="info-box">
          <h2>📝 Recent Posts (<xsl:value-of select="count(channel/item)"/> items)</h2>
        </div>

        <xsl:for-each select="channel/item">
          <div class="item">
            <h3>
              <a href="{link}" target="_blank">
                <xsl:value-of select="title"/>
              </a>
            </h3>
            <div class="item-meta">
              Published: <xsl:value-of select="substring(pubDate, 1, 16)"/>
            </div>
            <p><xsl:value-of select="description"/></p>
            <xsl:if test="category">
              <div class="categories">
                <xsl:for-each select="category">
                  <span class="category"><xsl:value-of select="."/></span>
                </xsl:for-each>
              </div>
            </xsl:if>
          </div>
        </xsl:for-each>

        <div class="info-box" style="text-align: center;">
          <h2>🌐 Visit the Blog</h2>
          <p>Want to read more posts and explore the full blog?</p>
          <a href="{channel/link}" class="subscribe-button" target="_blank">Visit Blog</a>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>