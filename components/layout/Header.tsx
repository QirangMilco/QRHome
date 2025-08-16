'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  LogOut, 
  Search, 
  Plus, 
  FolderPlus, 
  Grid3X3, 
  List,
  Sun,
  Moon
} from 'lucide-react';

interface HeaderProps {
  isEditable: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddWebsite: () => void;
  onAddGroup: () => void;
  onSettings: () => void;
  onLogout: () => void;
  layout: 'grid' | 'list';
  onLayoutChange: (layout: 'grid' | 'list') => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export function Header({
  isEditable,
  searchQuery,
  onSearchChange,
  onAddWebsite,
  onAddGroup,
  onSettings,
  onLogout,
  layout,
  onLayoutChange,
  theme,
  onThemeChange
}: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mr-3"></div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              个人导航
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className={`relative transition-all duration-200 ${
              isSearchFocused ? 'transform scale-105' : ''
            }`}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="搜索网站..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="pl-10 bg-white/60 border-gray-200/50 focus:bg-white/80"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Layout Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={layout === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onLayoutChange('grid')}
                className="w-8 h-8"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={layout === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onLayoutChange('list')}
                className="w-8 h-8"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
              className="w-8 h-8"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>

            {isEditable && (
              <>
                {/* Add Website */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onAddWebsite}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  网站
                </Button>

                {/* Add Group */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onAddGroup}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  <FolderPlus className="w-4 h-4 mr-1" />
                  分组
                </Button>
              </>
            )}

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettings}
            >
              <Settings className="w-4 h-4" />
            </Button>

            {/* Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}