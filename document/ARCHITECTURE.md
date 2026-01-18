# Paid Extension Architecture

## License System

### Architecture Overview
```
User → VS Code Extension → License Service → Backend API
                                    ↓
                            License Cache (localStorage)
```

### Components

1. **License Service** (`src/services/licenseService.ts`)
   - Validates license keys
   - Checks feature availability
   - Manages license caching

2. **Feature Gating**
   - Free tier: Basic generation (5 requests/day)
   - Paid tier: Unlimited + advanced features
   - Enterprise: Custom limits + priority support

### License Types

- **Free**: Basic features, limited requests
- **Trial**: 14-day full access
- **Paid**: One-time or subscription
- **Enterprise**: Volume licenses

## Payment Integration

### Options:
1. **VS Code Marketplace** (Recommended)
   - Built-in payment processing
   - Automatic license distribution
   - Easy setup

2. **Stripe Integration**
   - Custom payment flow
   - More control
   - Requires backend

3. **Paddle Integration**
   - Good for SaaS
   - Subscription management
   - Tax handling

## License Validation Flow

```
1. User activates license key
2. Extension calls backend API
3. Backend validates key
4. Backend returns license info
5. Extension caches license locally
6. Extension checks cache on startup
7. Periodic re-validation (daily)
```

## Backend Requirements

### API Endpoints:
- `POST /api/validate-license` - Validate license key
- `GET /api/license/{key}` - Get license details
- `POST /api/activate` - Activate license
- `GET /api/features` - Get available features

### Database Schema:
```sql
licenses (
  id UUID PRIMARY KEY,
  key VARCHAR UNIQUE,
  type VARCHAR,
  user_id UUID,
  expires_at TIMESTAMP,
  features JSON,
  created_at TIMESTAMP
)
```

## Feature Flags

### Free Tier:
- Basic JSX generation (up to 5/day)
- Standard Tailwind classes
- Single component export

### Paid Tier:
- Unlimited generation
- Advanced AI models
- Bulk export
- Custom Tailwind configs
- Component library sync
- Priority support

## Security Considerations

1. **License Key Format**
   - Use cryptographically secure random keys
   - Format: `XXXX-XXXX-XXXX-XXXX`
   - Minimum 128-bit entropy

2. **API Security**
   - Use HTTPS only
   - Rate limiting
   - API key authentication
   - Request signing

3. **Local Storage**
   - Encrypt license cache
   - Hash license keys (don't store plain)
   - Periodic validation

4. **Offline Support**
   - Cache license validation (7 days)
   - Graceful degradation
   - Re-validation on connection

## Implementation Steps

1. **Phase 1: Free Extension**
   - Launch free version
   - Gather user feedback
   - Build user base

2. **Phase 2: License Service**
   - Implement license validation
   - Add feature gating
   - Beta test with select users

3. **Phase 3: Paid Launch**
   - Set up payment processing
   - Migrate to paid extension
   - Marketing campaign

4. **Phase 4: Enterprise**
   - Volume licensing
   - Custom features
   - Dedicated support
