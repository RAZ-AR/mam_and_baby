# Security Policy

## Implemented Security Measures

### 1. Security Headers (Helmet)

The API uses Helmet middleware to set various HTTP security headers:

- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-XSS-Protection**: Enables browser XSS protection
- **Strict-Transport-Security**: Enforces HTTPS in production
- **Content-Security-Policy**: Helps prevent XSS attacks
- **Cross-Origin-Resource-Policy**: Controls resource loading (set to "cross-origin" for images)

### 2. Rate Limiting

Two levels of rate limiting are implemented:

#### General Rate Limiting
- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Applies To**: All API endpoints
- **Purpose**: Prevent DDoS attacks and abuse

#### Authentication Rate Limiting
- **Window**: 15 minutes
- **Max Requests**: 5 per IP
- **Applies To**: `/auth/*` endpoints
- **Purpose**: Prevent brute force attacks on login/register
- **Special**: Only counts failed attempts

### 3. JWT Authentication

- Secure token-based authentication
- Tokens expire after a configurable period
- Passwords are hashed using bcrypt (10 rounds)
- Tokens must be sent in Authorization header: `Bearer <token>`

### 4. CORS Configuration

- Configured to accept requests only from whitelisted origins
- Credentials support enabled for cookie-based auth (if needed)
- Production: Set `CORS_ORIGIN` to your frontend domain

### 5. Request Body Size Limits

- JSON payload limited to 10MB
- File uploads limited to 5MB per file
- Maximum 5 files per upload

### 6. Database Security

- Uses Prisma ORM with parameterized queries (prevents SQL injection)
- Database credentials stored in environment variables
- No direct SQL queries exposed

## Security Checklist for Production

### Required Steps

- [ ] Generate a strong JWT secret (min 32 characters):
  ```bash
  openssl rand -base64 32
  ```

- [ ] Set `NODE_ENV=production` in environment

- [ ] Use HTTPS/TLS certificates (Let's Encrypt recommended)

- [ ] Update `CORS_ORIGIN` to your production domain

- [ ] Use secure PostgreSQL credentials

- [ ] Enable database SSL connection in production:
  ```
  DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
  ```

- [ ] Review and adjust rate limits based on traffic

- [ ] Set up database backups (automated daily recommended)

- [ ] Configure proper firewall rules

- [ ] Use a CDN for static assets (Cloudflare, CloudFront)

### Recommended Steps

- [ ] Migrate file uploads to cloud storage (S3, Cloudinary)

- [ ] Implement request logging and monitoring

- [ ] Set up error tracking (Sentry, LogRocket)

- [ ] Add IP whitelisting for admin endpoints

- [ ] Implement email verification for new accounts

- [ ] Add 2FA for sensitive operations

- [ ] Regular dependency updates (automated with Dependabot)

- [ ] Security audit of dependencies:
  ```bash
  pnpm audit
  ```

- [ ] Implement Content Security Policy headers

- [ ] Add API versioning for backward compatibility

## Vulnerability Reporting

If you discover a security vulnerability, please email security@yourdomain.com with:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

**Please do not open public issues for security vulnerabilities.**

We aim to respond within 48 hours and provide a fix within 7 days for critical issues.

## Security Best Practices for Developers

### Environment Variables

- Never commit `.env` files to Git
- Use `.env.example` for documentation only
- Rotate secrets regularly (at least quarterly)
- Use different secrets for each environment

### Password Handling

- Passwords are hashed with bcrypt (never stored in plain text)
- Minimum password length: 6 characters (consider increasing to 8+)
- No maximum password length
- Consider adding password strength requirements

### API Keys

- Store API keys in environment variables
- Use different keys for development and production
- Rotate keys regularly
- Implement key expiration for long-lived tokens

### File Uploads

- Only allow image files (validated by MIME type)
- Scan uploads for malware (recommended for production)
- Store files outside of web root
- Use cloud storage in production
- Generate random filenames to prevent enumeration

### Database

- Use connection pooling (Prisma handles this)
- Never expose database credentials in logs
- Use read replicas for heavy read operations
- Regular backups with encryption

### Dependencies

- Keep all dependencies up to date
- Run security audits regularly: `pnpm audit`
- Review security advisories
- Use lock files (`pnpm-lock.yaml`)

## Security Headers Reference

All security headers are automatically set by Helmet. For custom configuration:

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

## Rate Limit Configuration

Default rate limits can be customized via environment variables:

```env
# General rate limit
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100           # 100 requests

# Auth rate limit
AUTH_RATE_LIMIT_MAX=5        # 5 attempts
```

For production, consider:
- Higher limits for authenticated users
- Stricter limits for public endpoints
- IP-based exemptions for trusted sources
- Redis-based rate limiting for distributed systems

## Compliance

This application implements security best practices aligned with:

- OWASP Top 10 security risks
- CWE/SANS Top 25 most dangerous software errors
- GDPR requirements (with proper implementation of user data handling)

## Last Updated

Last security review: 2025-01-10
