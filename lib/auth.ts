import { StorageService, STORAGE_KEYS } from './storage';
import { AuthConfig } from './types';

export class AuthService {
  private static getConfig(): AuthConfig {
    return StorageService.get(STORAGE_KEYS.AUTH, {
      hasPassword: false,
      passwordHash: '',
      rememberMe: false,
      lastLogin: 0,
      sessionDuration: 24 * 60 * 60 * 1000 // 24 hours
    });
  }

  private static setConfig(config: AuthConfig): void {
    StorageService.set(STORAGE_KEYS.AUTH, config);
  }

  static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  static async setPassword(password: string): Promise<void> {
    const config = this.getConfig();
    config.hasPassword = true;
    config.passwordHash = await this.hashPassword(password);
    this.setConfig(config);
  }

  static async verifyPassword(password: string): Promise<boolean> {
    const config = this.getConfig();
    if (!config.hasPassword) return true;
    
    const hash = await this.hashPassword(password);
    return hash === config.passwordHash;
  }

  static login(rememberMe: boolean = false): void {
    const config = this.getConfig();
    config.rememberMe = rememberMe;
    config.lastLogin = Date.now();
    this.setConfig(config);
  }

  static isAuthenticated(): boolean {
    const config = this.getConfig();
    if (!config.hasPassword) return true;
    if (!config.rememberMe) return false;
    
    const now = Date.now();
    return (now - config.lastLogin) < config.sessionDuration;
  }

  static logout(): void {
    const config = this.getConfig();
    config.rememberMe = false;
    config.lastLogin = 0;
    this.setConfig(config);
  }

  static hasPassword(): boolean {
    return this.getConfig().hasPassword;
  }

  static resetAuth(): void {
    StorageService.remove(STORAGE_KEYS.AUTH);
  }
}