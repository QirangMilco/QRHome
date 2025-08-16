export interface Website {
  id: string;
  name: string;
  urls: string[];
  activeUrlIndex: number;
  icon?: string;
  description?: string;
  groupId?: string;
  order: number;
}

export interface Group {
  id: string;
  name: string;
  collapsed: boolean;
  order: number;
  color?: string;
}

export interface AppConfig {
  theme: 'light' | 'dark';
  primaryColor: string;
  background: string;
  layout: 'grid' | 'list';
  websites: Website[];
  groups: Group[];
  gridCols: number;
  showDescriptions: boolean;
}

export interface AuthConfig {
  hasPassword: boolean;
  passwordHash: string;
  rememberMe: boolean;
  lastLogin: number;
  sessionDuration: number;
}

export type DragItem = {
  type: 'website' | 'group';
  id: string;
  groupId?: string;
};