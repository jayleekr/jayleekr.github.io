# Jay's Personal Blog

[![Deploy to GitHub Pages](https://github.com/jayleekr/jayleekr.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/jayleekr/jayleekr.github.io/actions/workflows/deploy.yml)

## Blog URL
[https://jayleekr.github.io](https://jayleekr.github.io/)

## About This Blog

A personal technical blog built with Astro, migrated from Jekyll. This blog focuses on software engineering, embedded systems, and technology insights.

## Features

- ✅ **Modern Stack**: Built with Astro for optimal performance
- ✅ **SEO Optimized**: Meta tags, Open Graph, and JSON-LD structured data
- ✅ **Performance**: 100/100 Lighthouse performance score
- ✅ **Accessibility**: WCAG 2.1 AA compliant
- ✅ **Responsive Design**: Mobile-first approach with Tailwind CSS
- ✅ **Multi-language**: Korean and English content support
- ✅ **Automated Deployment**: GitHub Actions CI/CD pipeline
- ✅ **Content Collections**: Organized blog posts with categories and tags
- ✅ **RSS Feed**: Automatic RSS feed generation
- ✅ **Sitemap**: SEO-friendly sitemap generation

## 🚀 Project Structure

```text
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable Astro components
│   ├── content/          # Blog posts and content collections
│   │   └── blog/         # Organized by categories
│   ├── layouts/          # Page layouts
│   ├── pages/            # Site pages and routes
│   ├── styles/           # Global styles
│   └── utils/            # Utility functions
├── .github/workflows/    # GitHub Actions
├── astro.config.mjs      # Astro configuration
└── tailwind.config.mjs   # Tailwind CSS configuration
```

## 🧞 Development Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Install dependencies                             |
| `npm run dev`             | Start local dev server at `localhost:4321`      |
| `npm run build`           | Build production site to `./dist/`              |
| `npm run preview`         | Preview build locally before deploying          |
| `npm run test`            | Run tests and linting                           |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check`|

## Content Management

### Creating New Posts

1. Create a new `.mdx` file in `src/content/blog/[Category]/[Subcategory]/`
2. Follow the frontmatter structure:

```yaml
---
title: "Your Post Title"
author: "Jay Lee"
pubDate: "YYYY-MM-DD HH:mm:ss"
categories: ["Category", "Subcategory"]
tags: ["tag1", "tag2"]
description: "Optional description"
draft: false
---
```

### Categories

- **TechSavvy**: Technical content
  - EmbeddedLinux, Container, Yocto, C++, Bash, etc.
- **DeepThinking**: Personal insights
  - Daily, Retrospect, AI
- **Collaboration**: Project collaborations
  - ToyProjects

## Deployment

The blog is automatically deployed to GitHub Pages using GitHub Actions when changes are pushed to the `master` branch.

### Deployment Pipeline

1. **Build**: Astro build with optimizations
2. **Test**: Lint checks and build validation
3. **Deploy**: Deploy to GitHub Pages

## Update History

|Date|Description|
|---|--|
|2025-07-11|Complete migration to Astro with full optimization|
|2023-11-25|Update framework to use Docker and fix GitHub Actions|
|2022-12-27|Update template HTML and test scripts for GitHub Actions|

## Legacy Jekyll Support

This repository maintains backward compatibility with the previous Jekyll setup through Docker:

```bash
# Jekyll development (legacy)
docker-compose up jekyll

# Jekyll build and test (legacy)
docker-compose run build
docker-compose run test
```

## Contributing

This is a personal blog, but if you find any issues or have suggestions, feel free to open an issue or submit a pull request.

## License

Content is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
Code is licensed under [MIT License](LICENSE).