# Security Best Practices Skill

## Overview
Expertise in implementing comprehensive security measures for desktop applications, including authentication, authorization, data protection, secure communication, and compliance with retail industry standards.

## Security Architecture Overview

### Core Security Principles
1. **Defense in Depth**: Multiple layers of security controls
2. **Least Privilege**: Minimal access rights required for functionality
3. **Zero Trust**: Verify everything, trust nothing
4. **Secure by Default**: Security settings enabled by default
5. **Fail Securely**: System defaults to secure state on failure

### Security Layers
```
┌─────────────────────────────────────┐
│           Application Layer         │  ← UI Security, Input Validation
├─────────────────────────────────────┤
│           Business Layer            │  ← Authorization, Business Rules
├─────────────────────────────────────┤
│           Data Layer                │  ← Encryption, Data Masking
├─────────────────────────────────────┤
│           Network Layer             │  ← TLS, API Security
├─────────────────────────────────────┤
│           System Layer              │  ← OS Security, File Permissions
└─────────────────────────────────────┘
```

## Authentication & Authorization

### JWT-Based Authentication
```typescript
// src/services/authService.ts
import { invoke } from '@tauri-apps/api/core';
import { pbkdf2, randomBytes } from 'crypto';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class AuthService {
  private static readonly TOKEN_KEY = 'auth_tokens';
  private static readonly REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes

  // Secure password hashing
  static async hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
    const passwordSalt = salt || randomBytes(32).toString('hex');
    const hash = pbkdf2Sync(password, passwordSalt, 100000, 64, 'sha512').toString('hex');
    
    return { hash, salt: passwordSalt };
  }

  // Password verification
  static async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    const { hash: computedHash } = await this.hashPassword(password, salt);
    return computedHash === hash;
  }

  // Login with rate limiting
  static async login(credentials: LoginCredentials): Promise<AuthTokens> {
    // Check rate limiting
    await this.checkRateLimit(credentials.username);
    
    try {
      const tokens = await invoke<AuthTokens>('authenticate_user', {
        username: credentials.username,
        password: credentials.password,
        deviceId: await this.getDeviceId(),
        ipAddress: await this.getLocalIP(),
      });

      await this.storeTokens(tokens);
      await this.recordSuccessfulLogin(credentials.username);
      
      return tokens;
    } catch (error) {
      await this.recordFailedLogin(credentials.username);
      throw error;
    }
  }

  // Token validation and refresh
  static async getValidAccessToken(): Promise<string> {
    const tokens = this.getStoredTokens();
    
    if (!tokens) {
      throw new Error('No authentication tokens found');
    }

    // Check if token is expired
    if (this.isTokenExpired(tokens.expiresIn)) {
      return await this.refreshToken(tokens.refreshToken);
    }

    return tokens.accessToken;
  }

  // Secure token refresh
  private static async refreshToken(refreshToken: string): Promise<string> {
    try {
      const newTokens = await invoke<AuthTokens>('refresh_tokens', {
        refreshToken,
        deviceId: await this.getDeviceId(),
      });

      await this.storeTokens(newTokens);
      return newTokens.accessToken;
    } catch (error) {
      // Refresh failed, clear tokens and redirect to login
      await this.logout();
      throw error;
    }
  }

  // Role-based access control (RBAC)
  static hasPermission(user: User, permission: Permission): boolean {
    return user.permissions.includes(permission) || user.role === 'admin';
  }

  // Secure token storage
  private static async storeTokens(tokens: AuthTokens): Promise<void> {
    try {
      // Use Tauri's secure storage
      await invoke('store_secure_data', {
        key: this.TOKEN_KEY,
        data: JSON.stringify(tokens),
      });
    } catch (error) {
      // Fallback to encrypted localStorage
      const encrypted = await this.encryptData(JSON.stringify(tokens));
      localStorage.setItem(this.TOKEN_KEY, encrypted);
    }
  }

  // Secure logout
  static async logout(): Promise<void> {
    try {
      // Invalidate tokens on server
      const tokens = this.getStoredTokens();
      if (tokens) {
        await invoke('invalidate_tokens', { refreshToken: tokens.refreshToken });
      }
    } catch (error) {
      console.warn('Failed to invalidate server tokens:', error);
    }

    // Clear local storage
    await this.clearTokens();
    
    // Clear any sensitive data from memory
    window.location.reload();
  }
}

// Authentication Guard Component
interface AuthGuardProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredPermission,
  fallback = <Navigate to="/login" />
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && !AuthService.hasPermission(user, requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

### Rust Backend Security
```rust
// src-tauri/src/auth.rs
use bcrypt::{hash, verify, DEFAULT_COST};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,        // User ID
    pub username: String,
    pub role: String,
    pub permissions: Vec<String>,
    pub iat: usize,         // Issued at
    pub exp: usize,         // Expiration
    pub iss: String,        // Issuer
    pub aud: String,        // Audience
}

pub struct AuthService {
    jwt_secret: String,
    rate_limiter: RateLimiter,
}

impl AuthService {
    pub fn new(jwt_secret: String) -> Self {
        Self {
            jwt_secret,
            rate_limiter: RateLimiter::new(),
        }
    }

    pub async fn authenticate_user(
        &self,
        username: &str,
        password: &str,
        device_id: &str,
        ip_address: &str,
    ) -> Result<AuthTokens, AuthError> {
        // Rate limiting check
        if !self.rate_limiter.can_attempt(username) {
            return Err(AuthError::TooManyAttempts);
        }

        // Get user from database
        let user = self.get_user_by_username(username)
            .await
            .map_err(|_| AuthError::InvalidCredentials)?;

        // Verify password
        if !verify(password, &user.password_hash).unwrap_or(false) {
            self.rate_limiter.record_failed_attempt(username);
            return Err(AuthError::InvalidCredentials);
        }

        // Check if user is active
        if !user.is_active {
            return Err(AuthError::AccountDisabled);
        }

        // Generate tokens
        let tokens = self.generate_tokens(&user, device_id).await?;

        // Record successful login
        self.record_login_attempt(username, ip_address, true).await?;

        Ok(tokens)
    }

    async fn generate_tokens(
        &self,
        user: &User,
        device_id: &str,
    ) -> Result<AuthTokens, AuthError> {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs() as usize;

        let claims = Claims {
            sub: user.id.clone(),
            username: user.username.clone(),
            role: user.role.clone(),
            permissions: user.permissions.clone(),
            iat: now,
            exp: now + 900, // 15 minutes
            iss: "graphshop-os".to_string(),
            aud: device_id.to_string(),
        };

        let access_token = encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.jwt_secret.as_ref()),
        )?;

        let refresh_claims = Claims {
            exp: now + 7 * 24 * 3600, // 7 days
            ..claims
        };

        let refresh_token = encode(
            &Header::default(),
            &refresh_claims,
            &EncodingKey::from_secret(self.jwt_secret.as_ref()),
        )?;

        Ok(AuthTokens {
            access_token,
            refresh_token,
            expires_in: 900,
        })
    }

    pub fn validate_token(&self, token: &str) -> Result<Claims, AuthError> {
        let validation = Validation::new(Validation::JSON);
        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.jwt_secret.as_ref()),
            &validation,
        )?;

        Ok(token_data.claims)
    }
}

#[derive(Debug)]
pub enum AuthError {
    InvalidCredentials,
    TooManyAttempts,
    AccountDisabled,
    TokenExpired,
    InvalidToken,
    DatabaseError(String),
}

impl std::fmt::Display for AuthError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            AuthError::InvalidCredentials => write!(f, "Invalid username or password"),
            AuthError::TooManyAttempts => write!(f, "Too many login attempts"),
            AuthError::AccountDisabled => write!(f, "Account is disabled"),
            AuthError::TokenExpired => write!(f, "Token has expired"),
            AuthError::InvalidToken => write!(f, "Invalid token"),
            AuthError::DatabaseError(msg) => write!(f, "Database error: {}", msg),
        }
    }
}
```

## Data Protection

### Encryption Implementation
```typescript
// src/services/cryptoService.ts
import { invoke } from '@tauri-apps/api/core';

export class CryptoService {
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly KEY_LENGTH = 256;

  // Generate encryption key
  static async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Derive key from password
  static async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt data
  static async encrypt(data: string, key: CryptoKey): Promise<{
    ciphertext: ArrayBuffer;
    iv: Uint8Array;
  }> {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      {
        name: this.ALGORITHM,
        iv,
      },
      key,
      encoder.encode(data)
    );

    return {
      ciphertext: encrypted,
      iv,
    };
  }

  // Decrypt data
  static async decrypt(
    encrypted: ArrayBuffer,
    iv: Uint8Array,
    key: CryptoKey
  ): Promise<string> {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: this.ALGORITHM,
        iv,
      },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  // Secure file encryption for Tauri
  static async encryptFile(filePath: string, password: string): Promise<void> {
    const salt = crypto.getRandomValues(new Uint8Array(32));
    const key = await this.deriveKey(password, salt);
    
    const fileData = await invoke<ArrayBuffer>('read_file', { path: filePath });
    const encrypted = await this.encrypt(
      new TextDecoder().decode(fileData),
      key
    );

    // Store salt with encrypted data
    const result = new Uint8Array(salt.length + encrypted.ciphertext.byteLength);
    result.set(salt, 0);
    result.set(new Uint8Array(encrypted.ciphertext), salt.length);

    await invoke('write_file', {
      path: `${filePath}.encrypted`,
      data: Array.from(result),
    });
  }
}

// Data masking utilities
export class DataMasking {
  static maskCreditCard(cardNumber: string): string {
    return cardNumber.replace(/\d(?=\d{4})/g, '*');
  }

  static maskEmail(email: string): string {
    const [username, domain] = email.split('@');
    const maskedUsername = username.slice(0, 2) + '*'.repeat(username.length - 2);
    return `${maskedUsername}@${domain}`;
  }

  static maskPhoneNumber(phone: string): string {
    return phone.replace(/\d(?=\d{4})/g, '*');
  }

  // GDPR compliance - anonymize user data
  static anonymizeUserData(userData: any): any {
    return {
      ...userData,
      id: this.generateAnonymousId(),
      username: 'anonymized',
      email: this.maskEmail(userData.email),
      phone: userData.phone ? this.maskPhoneNumber(userData.phone) : null,
      personalDetails: null,
      address: {
        ...userData.address,
        street: '***',
        city: userData.address?.city,
        country: userData.address?.country,
      },
    };
  }
}
```

### Database Security
```rust
// src-tauri/src/database_security.rs
use sqlx::sqlite::SqlitePool;
use std::collections::HashMap;

pub struct SecureDatabase {
    pool: SqlitePool,
    encryption_key: [u8; 32],
}

impl SecureDatabase {
    pub fn new(database_url: &str, encryption_key: [u8; 32]) -> Result<Self, DatabaseError> {
        let pool = SqlitePool::connect(database_url).await?;
        
        // Enable secure settings
        sqlx::query("PRAGMA foreign_keys = ON")
            .execute(&pool)
            .await?;
        
        sqlx::query("PRAGMA journal_mode = WAL")
            .execute(&pool)
            .await?;

        Ok(Self { pool, encryption_key })
    }

    // Store sensitive data with encryption
    pub async fn store_encrypted_payment(
        &self,
        customer_id: &str,
        payment_method: &PaymentMethod,
    ) -> Result<(), DatabaseError> {
        let encrypted_data = self.encrypt_payment_data(payment_method)?;
        
        sqlx::query!(
            "INSERT INTO encrypted_payment_methods (customer_id, encrypted_data, created_at) VALUES (?, ?, ?)",
            customer_id,
            encrypted_data,
            chrono::Utc::now()
        )
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    // Audit logging for compliance
    pub async fn log_security_event(
        &self,
        event_type: SecurityEventType,
        user_id: &str,
        details: &str,
        ip_address: &str,
    ) -> Result<(), DatabaseError> {
        sqlx::query!(
            "INSERT INTO security_logs (event_type, user_id, details, ip_address, timestamp) VALUES (?, ?, ?, ?, ?)",
            event_type.to_string(),
            user_id,
            details,
            ip_address,
            chrono::Utc::now()
        )
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    // Data retention and cleanup
    pub async fn cleanup_old_data(&self, retention_days: i64) -> Result<(), DatabaseError> {
        let cutoff_date = chrono::Utc::now() - chrono::Duration::days(retention_days);

        // Clean up old logs
        sqlx::query!(
            "DELETE FROM security_logs WHERE timestamp < ?",
            cutoff_date
        )
        .execute(&self.pool)
        .await?;

        // Anonymize old customer data
        sqlx::query!(
            "UPDATE customers SET email = ?, phone = ? WHERE last_purchase < ? AND status = 'inactive'",
            format!("anonymized_{}", chrono::Utc::now().timestamp()),
            "anonymized",
            cutoff_date
        )
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    fn encrypt_payment_data(&self, payment: &PaymentMethod) -> Result<String, DatabaseError> {
        // Implement AES-256 encryption
        // This is a simplified example - use proper cryptographic libraries
        let serialized = serde_json::to_string(payment)?;
        Ok(self.encrypt_with_key(&serialized, &self.encryption_key)?)
    }
}

#[derive(Debug)]
pub enum SecurityEventType {
    Login,
    Logout,
    PasswordChange,
    DataAccess,
    DataModification,
    SecurityViolation,
}

impl std::fmt::Display for SecurityEventType {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            SecurityEventType::Login => write!(f, "login"),
            SecurityEventType::Logout => write!(f, "logout"),
            SecurityEventType::PasswordChange => write!(f, "password_change"),
            SecurityEventType::DataAccess => write!(f, "data_access"),
            SecurityEventType::DataModification => write!(f, "data_modification"),
            SecurityEventType::SecurityViolation => write!(f, "security_violation"),
        }
    }
}
```

## Secure API Communication

### API Security Middleware
```typescript
// src/services/apiSecurity.ts
import { invoke } from '@tauri-apps/api/core';

export class APISecurity {
  private static readonly NONCE_LENGTH = 32;
  private static readonly TIMESTAMP_TOLERANCE = 300; // 5 minutes

  // Request signing for API integrity
  static async signRequest(
    method: string,
    url: string,
    body?: any,
    timestamp?: number
  ): Promise<{
    signature: string;
    timestamp: number;
    nonce: string;
  }> {
    const ts = timestamp || Date.now();
    const nonce = this.generateNonce();
    
    const payload = [
      method.toUpperCase(),
      url,
      ts.toString(),
      nonce,
      body ? JSON.stringify(body) : ''
    ].join('|');

    const signature = await this.generateSignature(payload);
    
    return { signature, timestamp: ts, nonce };
  }

  // Request validation middleware
  static async validateRequest(
    signature: string,
    timestamp: number,
    nonce: string,
    method: string,
    url: string,
    body?: any
  ): Promise<boolean> {
    // Check timestamp freshness
    const now = Date.now();
    if (Math.abs(now - timestamp) > this.TIMESTAMP_TOLERANCE * 1000) {
      return false;
    }

    // Check nonce uniqueness
    if (await this.isNonceUsed(nonce)) {
      return false;
    }

    // Verify signature
    const payload = [
      method.toUpperCase(),
      url,
      timestamp.toString(),
      nonce,
      body ? JSON.stringify(body) : ''
    ].join('|');

    const expectedSignature = await this.generateSignature(payload);
    
    return signature === expectedSignature;
  }

  // CSRF protection
  static generateCSRFToken(): string {
    return btoa(JSON.stringify({
      token: this.generateRandomString(32),
      timestamp: Date.now(),
    }));
  }

  static validateCSRFToken(token: string, sessionToken: string): boolean {
    try {
      const tokenData = JSON.parse(atob(token));
      const sessionData = JSON.parse(atob(sessionToken));
      
      // Check if tokens match and are not expired
      return tokenData.token === sessionData.token &&
             (Date.now() - tokenData.timestamp) < 3600000; // 1 hour
    } catch {
      return false;
    }
  }

  // Content Security Policy headers
  static getCSPHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self' https://api.graphshop.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; '),
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    };
  }

  private static async generateSignature(payload: string): Promise<string> {
    // Use HMAC-SHA256 for signature generation
    const encoder = new TextEncoder();
    const key = await invoke('get_api_secret_key');
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(key),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      encoder.encode(payload)
    );

    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  }

  private static generateNonce(): string {
    return this.generateRandomString(this.NONCE_LENGTH);
  }

  private static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
```

## Security Monitoring

### Intrusion Detection
```typescript
// src/services/securityMonitor.ts
export class SecurityMonitor {
  private static suspiciousPatterns = [
    /\b(?:select|insert|update|delete|drop|union|exec|script)\b/i, // SQL injection
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // XSS
    /\.\./g, // Directory traversal
  ];

  // Monitor for suspicious activities
  static detectSuspiciousActivity(
    input: string,
    context: SecurityContext
  ): SecurityAlert[] {
    const alerts: SecurityAlert[] = [];

    // Check for common attack patterns
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(input)) {
        alerts.push({
          type: SecurityAlertType.PotentialAttack,
          severity: AlertSeverity.High,
          description: `Suspicious pattern detected: ${pattern.source}`,
          context,
          timestamp: new Date(),
        });
      }
    }

    // Check for abnormal request frequency
    const frequencyAlert = this.checkRequestFrequency(context);
    if (frequencyAlert) {
      alerts.push(frequencyAlert);
    }

    return alerts;
  }

  // Rate limiting and anomaly detection
  static checkRequestFrequency(context: SecurityContext): SecurityAlert | null {
    const requests = this.getRequestHistory(context.ipAddress);
    const now = Date.now();
    const recentRequests = requests.filter(time => now - time < 60000); // Last minute

    if (recentRequests.length > 100) { // More than 100 requests per minute
      return {
        type: SecurityAlertType.RateLimitExceeded,
        severity: AlertSeverity.Medium,
        description: 'Excessive request frequency detected',
        context,
        timestamp: new Date(),
      };
    }

    return null;
  }

  // Security event logging
  static async logSecurityAlert(alert: SecurityAlert): Promise<void> {
    try {
      await invoke('log_security_event', {
        type: alert.type,
        severity: alert.severity,
        description: alert.description,
        context: alert.context,
        timestamp: alert.timestamp.toISOString(),
      });

      // Send notifications for high severity alerts
      if (alert.severity === AlertSeverity.High) {
        await this.notifySecurityTeam(alert);
      }
    } catch (error) {
      console.error('Failed to log security alert:', error);
    }
  }

  // Automated response to security threats
  static async handleSecurityThreat(alert: SecurityAlert): Promise<void> {
    switch (alert.type) {
      case SecurityAlertType.PotentialAttack:
        // Block IP temporarily
        await this.blockTemporaryIP(alert.context.ipAddress, 3600); // 1 hour
        break;
        
      case SecurityAlertType.BruteForceAttempt:
        // Lock account temporarily
        await this.lockUserAccount(alert.context.userId, 1800); // 30 minutes
        break;
        
      case SecurityAlertType.SuspiciousDataAccess:
        // Force logout and require re-authentication
        await this.forceUserLogout(alert.context.userId);
        break;
    }
  }
}

interface SecurityAlert {
  type: SecurityAlertType;
  severity: AlertSeverity;
  description: string;
  context: SecurityContext;
  timestamp: Date;
}

enum SecurityAlertType {
  PotentialAttack,
  BruteForceAttempt,
  SuspiciousDataAccess,
  RateLimitExceeded,
  UnauthorizedAccess,
}

enum AlertSeverity {
  Low,
  Medium,
  High,
  Critical,
}

interface SecurityContext {
  userId?: string;
  ipAddress: string;
  userAgent: string;
  endpoint: string;
}
```

## Compliance & Auditing

### GDPR Compliance Implementation
```typescript
// src/services/gdprService.ts
export class GDPRService {
  // Data subject rights implementation
  
  // Right to access
  static async exportUserData(userId: string): Promise<UserDataExport> {
    const userData = await this.collectUserData(userId);
    const sanitizedData = this.sanitizeForExport(userData);
    
    return {
      exportDate: new Date().toISOString(),
      userData: sanitizedData,
      format: 'JSON',
      version: '1.0',
    };
  }

  // Right to rectification
  static async rectifyUserData(
    userId: string,
    corrections: Partial<UserData>
  ): Promise<void> {
    // Log the correction request
    await this.logDataOperation('RECTIFY', userId, corrections);
    
    // Update user data with audit trail
    await this.updateUserDataWithAudit(userId, corrections);
  }

  // Right to erasure (right to be forgotten)
  static async deleteUserData(userId: string): Promise<void> {
    // Begin GDPR deletion process
    const deletionRequest = await this.createDeletionRequest(userId);
    
    // Anonymize instead of delete where required for business operations
    await this.anonymizeUserAccounts(userId);
    
    // Delete marketing data
    await this.deleteMarketingData(userId);
    
    // Complete the deletion request
    await this.completeDeletionRequest(deletionRequest.id);
  }

  // Data portability
  static async exportUserDataPortable(userId: string): Promise<PortableUserData> {
    const userData = await this.collectUserData(userId);
    
    return {
      personalData: userData.personal,
      purchaseHistory: userData.purchases,
      preferences: userData.preferences,
      timestamp: new Date().toISOString(),
      format: 'JSON-LD', // Structured data format
    };
  }

  // Consent management
  static async updateConsent(
    userId: string,
    consentData: ConsentData
  ): Promise<void> {
    const timestamp = new Date().toISOString();
    
    await this.storeConsentRecord({
      userId,
      ...consentData,
      timestamp,
      ipAddress: await this.getUserIP(),
      userAgent: navigator.userAgent,
    });

    // Update user preferences
    await this.updateUserPreferences(userId, {
      marketing: consentData.marketing,
      analytics: consentData.analytics,
      cookies: consentData.cookies,
    });
  }

  // Cookie compliance
  static initializeCookieCompliance(): void {
    if (!this.hasConsent()) {
      this.showCookieBanner();
    }
  }

  static manageConsent(consent: CookieConsent): void {
    this.storeCookieConsent(consent);
    this.applyCookieSettings(consent);
    
    // Update third-party scripts based on consent
    this.updateThirdPartyScripts(consent);
  }

  // Data breach notification
  static async handleDataBreach(breach: DataBreach): Promise<void> {
    // Assess breach severity
    const severity = this.assessBreachSeverity(breach);
    
    // Notify authorities within 72 hours if required
    if (severity.requiresAuthorityNotification) {
      await this.notifyDataProtectionAuthority(breach);
    }
    
    // Notify affected individuals if high risk
    if (severity.requiresIndividualNotification) {
      await this.notifyAffectedIndividuals(breach);
    }
    
    // Document breach details
    await this.documentDataBreach(breach, severity);
  }
}

interface UserDataExport {
  exportDate: string;
  userData: any;
  format: string;
  version: string;
}

interface ConsentData {
  marketing: boolean;
  analytics: boolean;
  cookies: boolean;
  legitimateInterest: boolean;
}

interface DataBreach {
  type: 'unauthorized_access' | 'data_loss' | 'accidental_disclosure';
  affectedRecords: number;
  dataCategories: string[];
  discoveryDate: Date;
  containmentDate?: Date;
  description: string;
  mitigationActions: string[];
}
```

This comprehensive security implementation provides multiple layers of protection for GRAPHSHOP OS, ensuring data protection, secure authentication, and compliance with international regulations.