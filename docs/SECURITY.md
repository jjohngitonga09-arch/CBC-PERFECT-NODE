# Security Checklist

- [ ] TLS in transit (HTTPS everywhere)
- [ ] PII encrypted at rest
- [ ] JWT with short expiry + refresh tokens
- [ ] Rate limiting on auth endpoints
- [ ] CAPTCHA on signup
- [ ] RBAC with least privilege
- [ ] Immutable audit log for admin actions
- [ ] Stripe tokenization (no card data on servers)
- [ ] Parental consent flow (Kenya DPA + COPPA)
- [ ] Content moderation queue
- [ ] Dependency scanning in CI
- [ ] Pen test before pilot launch
