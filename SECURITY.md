# Security Policy

## Supported Versions

We actively maintain security for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **GitHub Security Advisories (Preferred)**
   - Go to [Security Advisories](https://github.com/jayleekr/jayleekr.github.io/security/advisories/new)
   - Create a new security advisory
   - Provide detailed information about the vulnerability

2. **Email**
   - Email: jayleekr@outlook.com
   - Subject: `[SECURITY] Vulnerability Report - jayleekr.github.io`

### What to Include

Please include the following information in your report:

- **Description**: Clear description of the vulnerability
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Impact**: Potential impact and severity assessment
- **Proof of Concept**: If applicable, include screenshots or code snippets
- **Suggested Fix**: If you have ideas for fixing the issue

### Scope

**In Scope:**
- This website (jayleekr.github.io)
- Source code in this repository
- CI/CD pipeline security
- Configuration and deployment scripts
- Client-side security issues (XSS, CSRF, etc.)

**Out of Scope:**
- Third-party dependencies (please report to respective maintainers)
- GitHub Pages infrastructure issues
- DNS/Domain provider issues
- Social engineering attacks
- Physical attacks

### Response Timeline

- **Initial Response**: Within 48 hours
- **Triage**: Within 72 hours
- **Patch/Mitigation**: Within 7 days for critical issues, 30 days for non-critical
- **Public Disclosure**: After fix is deployed and tested (coordinated disclosure)

### Security Measures

Our current security measures include:

#### Application Security
- Content Security Policy (CSP) headers
- XSS protection headers
- CSRF protection
- Input validation and sanitization
- Secure cookie settings

#### Infrastructure Security
- HTTPS everywhere (enforced)
- Security headers (HSTS, X-Frame-Options, etc.)
- Regular dependency updates
- Automated security scanning
- CI/CD pipeline security

#### Monitoring
- Error tracking and monitoring
- Performance monitoring
- Security audit logging
- Dependency vulnerability scanning

### Acknowledgments

We appreciate the security research community and will acknowledge researchers who report vulnerabilities responsibly.

**Hall of Fame:**
- Be the first to report a valid security issue!

### Contact

- **Security Contact**: jayleekr@outlook.com
- **General Contact**: https://github.com/jayleekr
- **Security Advisories**: https://github.com/jayleekr/jayleekr.github.io/security/advisories

Thank you for helping keep our site secure! 🔒