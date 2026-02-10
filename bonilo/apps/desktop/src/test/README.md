# Test Suite

This directory contains the test suite for the IGO Desktop application.

## Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## Test Structure

```
src/
├── test/
│   └── setup.ts              # Test setup and global mocks
├── renderer/
│   ├── services/
│   │   └── __tests__/
│   │       ├── secureStorage.test.ts
│   │       └── dbService.test.ts
│   └── api/
│       └── services/
│           └── __tests__/
│               └── auth.test.ts
```

## Coverage Areas

### Critical Security Tests
- ✅ Secure storage encryption/decryption
- ✅ SQL injection prevention
- ✅ Token storage security
- ✅ Password hashing

### Service Tests
- ✅ Database service operations
- ✅ Authentication service
- ✅ Secure storage service

## Adding New Tests

When adding new tests:
1. Create test files alongside the code being tested
2. Use the naming convention: `[filename].test.ts` or `[filename].spec.ts`
3. Import from `@testing-library/react` for component tests
4. Use `vi.fn()` from Vitest for mocking

## Mocking

Common mocks are set up in `test/setup.ts`:
- `localStorage`
- `crypto.subtle` (Web Crypto API)

For component-specific mocks, use `vi.mock()` at the top of your test file.
