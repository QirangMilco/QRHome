'use client';

import { useState, useEffect } from 'react';
import { StorageService, STORAGE_KEYS } from '@/lib/storage';
import { Website, Group } from '@/lib/types';

export function useWebsites() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedWebsites = StorageService.get<Website[]>(STORAGE_KEYS.WEBSITES, []);
    const storedGroups = StorageService.get<Group[]>(STORAGE_KEYS.GROUPS, []);
    
    setWebsites(storedWebsites);
    setGroups(storedGroups);
  };

  const saveWebsites = (newWebsites: Website[]) => {
    setWebsites(newWebsites);
    StorageService.set(STORAGE_KEYS.WEBSITES, newWebsites);
  };

  const saveGroups = (newGroups: Group[]) => {
    setGroups(newGroups);
    StorageService.set(STORAGE_KEYS.GROUPS, newGroups);
  };

  const addWebsite = (website: Omit<Website, 'id' | 'order'>) => {
    const newWebsite: Website = {
      ...website,
      id: crypto.randomUUID(),
      order: websites.length
    };
    saveWebsites([...websites, newWebsite]);
  };

  const updateWebsite = (id: string, updates: Partial<Website>) => {
    const newWebsites = websites.map(w => 
      w.id === id ? { ...w, ...updates } : w
    );
    saveWebsites(newWebsites);
  };

  const deleteWebsite = (id: string) => {
    const newWebsites = websites.filter(w => w.id !== id);
    saveWebsites(newWebsites);
  };

  const addGroup = (group: Omit<Group, 'id' | 'order'>) => {
    const newGroup: Group = {
      ...group,
      id: crypto.randomUUID(),
      order: groups.length
    };
    saveGroups([...groups, newGroup]);
  };

  const updateGroup = (id: string, updates: Partial<Group>) => {
    const newGroups = groups.map(g => 
      g.id === id ? { ...g, ...updates } : g
    );
    saveGroups(newGroups);
  };

  const deleteGroup = (id: string) => {
    // Remove group from websites
    const newWebsites = websites.map(w => 
      w.groupId === id ? { ...w, groupId: undefined } : w
    );
    saveWebsites(newWebsites);
    
    // Remove group
    const newGroups = groups.filter(g => g.id !== id);
    saveGroups(newGroups);
  };

  const reorderWebsites = (newWebsites: Website[]) => {
    const reorderedWebsites = newWebsites.map((w, index) => ({ ...w, order: index }));
    saveWebsites(reorderedWebsites);
  };

  const reorderGroups = (newGroups: Group[]) => {
    const reorderedGroups = newGroups.map((g, index) => ({ ...g, order: index }));
    saveGroups(reorderedGroups);
  };

  return {
    websites,
    groups,
    addWebsite,
    updateWebsite,
    deleteWebsite,
    addGroup,
    updateGroup,
    deleteGroup,
    reorderWebsites,
    reorderGroups,
    loadData
  };
}