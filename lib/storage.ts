export const STORAGE_KEYS = {
  WEBSITES: 'nav-websites',
  GROUPS: 'nav-groups',
  CONFIG: 'nav-config',
  AUTH: 'nav-auth'
} as const;

export class StorageService {
  static get<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  static exportData() {
    const data = {
      websites: this.get(STORAGE_KEYS.WEBSITES, []),
      groups: this.get(STORAGE_KEYS.GROUPS, []),
      config: this.get(STORAGE_KEYS.CONFIG, {})
    };
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.websites) this.set(STORAGE_KEYS.WEBSITES, data.websites);
      if (data.groups) this.set(STORAGE_KEYS.GROUPS, data.groups);
      if (data.config) this.set(STORAGE_KEYS.CONFIG, data.config);
      return true;
    } catch {
      return false;
    }
  }
}