import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authApi } from '../auth';
import { apiClient } from '../../client';
import { secureStorage } from '../../../services/secureStorage';
import { API_CONFIG } from '../../config';

// Mock dependencies
vi.mock('../../client', () => ({
    apiClient: {
        post: vi.fn(),
        get: vi.fn(),
        setAuthToken: vi.fn(),
        setRefreshToken: vi.fn(),
    },
}));

vi.mock('../../../services/secureStorage', () => ({
    secureStorage: {
        setItem: vi.fn(),
        getItem: vi.fn(),
        removeItem: vi.fn(),
    },
}));

describe('authApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('login', () => {
        it('should store tokens securely on successful login', async () => {
            const mockResponse = {
                success: true,
                data: {
                    token: 'test-token',
                    refreshToken: 'test-refresh-token',
                    user: { id: '1', email: 'test@test.com' },
                    expiresIn: 3600,
                },
            };

            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await authApi.login({
                email: 'test@test.com',
                password: 'password',
            });

            expect(result.success).toBe(true);
            expect(secureStorage.setItem).toHaveBeenCalledWith(
                expect.any(String),
                'test-token'
            );
            expect(secureStorage.setItem).toHaveBeenCalledWith(
                expect.any(String),
                'test-refresh-token'
            );
            expect(apiClient.setAuthToken).toHaveBeenCalledWith('test-token');
            expect(apiClient.setRefreshToken).toHaveBeenCalledWith('test-refresh-token');
        });

        it('should not store tokens on failed login', async () => {
            const mockResponse = {
                success: false,
                error: 'Invalid credentials',
            };

            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const result = await authApi.login({
                email: 'test@test.com',
                password: 'wrong-password',
            });

            expect(result.success).toBe(false);
            expect(secureStorage.setItem).not.toHaveBeenCalled();
        });

        it('should return mock mode error when MOCK_MODE is enabled', async () => {
            const originalMockMode = API_CONFIG.MOCK_MODE;
            (API_CONFIG as any).MOCK_MODE = true;

            const result = await authApi.login({
                email: 'test@test.com',
                password: 'password',
            });

            expect(result.success).toBe(false);
            expect(result.error).toContain('Mock mode');

            (API_CONFIG as any).MOCK_MODE = originalMockMode;
        });
    });

    describe('logout', () => {
        it('should clear tokens on logout', async () => {
            vi.mocked(apiClient.post).mockResolvedValue({ success: true });

            await authApi.logout();

            expect(secureStorage.removeItem).toHaveBeenCalledWith(expect.any(String));
            expect(apiClient.setAuthToken).toHaveBeenCalledWith(null);
            expect(apiClient.setRefreshToken).toHaveBeenCalledWith(null);
        });

        it('should clear tokens even if API call fails', async () => {
            vi.mocked(apiClient.post).mockResolvedValue({
                success: false,
                error: 'Network error',
            });

            await authApi.logout();

            expect(secureStorage.removeItem).toHaveBeenCalled();
            expect(apiClient.setAuthToken).toHaveBeenCalledWith(null);
        });
    });

    describe('initFromStorage', () => {
        it('should restore tokens from secure storage', async () => {
            vi.mocked(secureStorage.getItem)
                .mockResolvedValueOnce('stored-token')
                .mockResolvedValueOnce('stored-refresh-token');

            const result = await authApi.initFromStorage();

            expect(result).toBe(true);
            expect(apiClient.setAuthToken).toHaveBeenCalledWith('stored-token');
            expect(apiClient.setRefreshToken).toHaveBeenCalledWith('stored-refresh-token');
        });

        it('should return false when no token exists', async () => {
            vi.mocked(secureStorage.getItem).mockResolvedValue(null);

            const result = await authApi.initFromStorage();

            expect(result).toBe(false);
            expect(apiClient.setAuthToken).not.toHaveBeenCalled();
        });
    });

    describe('isAuthenticated', () => {
        it('should return true when token exists', async () => {
            vi.mocked(secureStorage.getItem).mockResolvedValue('valid-token');

            const result = await authApi.isAuthenticated();

            expect(result).toBe(true);
        });

        it('should return false when no token exists', async () => {
            vi.mocked(secureStorage.getItem).mockResolvedValue(null);

            const result = await authApi.isAuthenticated();

            expect(result).toBe(false);
        });
    });
});
