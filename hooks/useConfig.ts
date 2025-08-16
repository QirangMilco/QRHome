'use client';

import { useState, useEffect } from 'react';
import { StorageService, STORAGE_KEYS } from '@/lib/storage';
import { AppConfig } from '@/lib/types';

const defaultConfig: AppConfig = {
  theme: 'light',
  primaryColor: '#3B82F6',
  background: 'gradient',
  layout: 'grid',
  websites: [],
  groups: [],
  gridCols: 6,
  showDescriptions: true
};

export function useConfig() {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);

  useEffect(() => {
    const storedConfig = StorageService.get<AppConfig>(STORAGE_KEYS.CONFIG, defaultConfig);
    setConfig({ ...defaultConfig, ...storedConfig });
  }, []);

  const updateConfig = (updates: Partial<AppConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    StorageService.set(STORAGE_KEYS.CONFIG, newConfig);
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    StorageService.set(STORAGE_KEYS.CONFIG, defaultConfig);
  };

  return {
    config,
    updateConfig,
    resetConfig
  };
}