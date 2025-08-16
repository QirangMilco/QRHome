'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWebsites } from '@/hooks/useWebsites';
import { useConfig } from '@/hooks/useConfig';
import { LoginForm } from '@/components/auth/LoginForm';
import { Header } from '@/components/layout/Header';
import { GroupSection } from '@/components/navigation/GroupSection';
import { WebsiteForm } from '@/components/forms/WebsiteForm';
import { GroupForm } from '@/components/forms/GroupForm';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { Website, Group } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, isLoading, hasPassword, login, setPassword, logout } = useAuth();
  const { websites, groups, addWebsite, updateWebsite, deleteWebsite, addGroup, updateGroup, deleteGroup, loadData } = useWebsites();
  const { config, updateConfig, resetConfig } = useConfig();

  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [showWebsiteForm, setShowWebsiteForm] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Filter websites based on search query
  const filteredWebsites = useMemo(() => {
    if (!searchQuery) return websites;
    return websites.filter(website => 
      website.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.urls.some(url => url.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [websites, searchQuery]);

  // Group websites
  const groupedWebsites = useMemo(() => {
    const grouped: Record<string, Website[]> = {};
    const ungrouped: Website[] = [];

    filteredWebsites.forEach(website => {
      if (website.groupId) {
        if (!grouped[website.groupId]) {
          grouped[website.groupId] = [];
        }
        grouped[website.groupId].push(website);
      } else {
        ungrouped.push(website);
      }
    });

    return { grouped, ungrouped };
  }, [filteredWebsites]);

  // Sort groups by order
  const sortedGroups = useMemo(() => {
    return [...groups].sort((a, b) => a.order - b.order);
  }, [groups]);

  const handleAddWebsite = () => {
    setEditingWebsite(null);
    setShowWebsiteForm(true);
  };

  const handleEditWebsite = (website: Website) => {
    setEditingWebsite(website);
    setShowWebsiteForm(true);
  };

  const handleSaveWebsite = (websiteData: Omit<Website, 'id' | 'order'>) => {
    if (editingWebsite) {
      updateWebsite(editingWebsite.id, websiteData);
    } else {
      addWebsite(websiteData);
    }
    setShowWebsiteForm(false);
    setEditingWebsite(null);
  };

  const handleUpdateWebsiteUrl = (id: string, urlIndex: number) => {
    updateWebsite(id, { activeUrlIndex: urlIndex });
  };

  const handleAddGroup = () => {
    setEditingGroup(null);
    setShowGroupForm(true);
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setShowGroupForm(true);
  };

  const handleSaveGroup = (groupData: Omit<Group, 'id' | 'order'>) => {
    if (editingGroup) {
      updateGroup(editingGroup.id, groupData);
    } else {
      addGroup(groupData);
    }
    setShowGroupForm(false);
    setEditingGroup(null);
  };

  const handleToggleGroup = (id: string, collapsed: boolean) => {
    updateGroup(id, { collapsed });
  };

  const handleDataReset = () => {
    resetConfig();
    loadData();
  };

  // Background style based on config
  const backgroundStyle = useMemo(() => {
    switch (config.background) {
      case 'gradient':
        return {
          background: `linear-gradient(135deg, 
            ${config.primaryColor}10 0%, 
            ${config.primaryColor}20 25%, 
            transparent 50%, 
            ${config.primaryColor}15 75%, 
            ${config.primaryColor}25 100%)`
        };
      case 'solid':
        return { backgroundColor: '#f8fafc' };
      case 'image':
        return {
          backgroundImage: 'url("https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        };
      default:
        return {};
    }
  }, [config.background, config.primaryColor]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginForm
        onLogin={login}
        hasPassword={hasPassword}
        onSetPassword={setPassword}
      />
    );
  }

  return (
    <div className="min-h-screen" style={backgroundStyle}>
      {/* Header */}
      <Header
        isEditable={isAuthenticated}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddWebsite={handleAddWebsite}
        onAddGroup={handleAddGroup}
        onSettings={() => setShowSettings(true)}
        onLogout={logout}
        layout={config.layout}
        onLayoutChange={(layout) => updateConfig({ layout })}
        theme={config.theme}
        onThemeChange={(theme) => updateConfig({ theme })}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-6">
            <p className="text-gray-600">
              找到 {filteredWebsites.length} 个网站包含 "{searchQuery}"
            </p>
          </div>
        )}

        {/* Groups */}
        {sortedGroups.map(group => {
          const groupWebsites = groupedWebsites.grouped[group.id] || [];
          if (groupWebsites.length === 0 && searchQuery) return null;

          return (
            <GroupSection
              key={group.id}
              group={group}
              websites={groupWebsites}
              isEditable={isAuthenticated}
              onEditWebsite={handleEditWebsite}
              onDeleteWebsite={deleteWebsite}
              onUpdateWebsiteUrl={handleUpdateWebsiteUrl}
              onEditGroup={handleEditGroup}
              onDeleteGroup={deleteGroup}
              onToggleGroup={handleToggleGroup}
              onAddWebsite={handleAddWebsite}
              gridCols={config.gridCols}
            />
          );
        })}

        {/* Ungrouped Websites */}
        {groupedWebsites.ungrouped.length > 0 && (
          <GroupSection
            websites={groupedWebsites.ungrouped}
            isEditable={isAuthenticated}
            onEditWebsite={handleEditWebsite}
            onDeleteWebsite={deleteWebsite}
            onUpdateWebsiteUrl={handleUpdateWebsiteUrl}
            onAddWebsite={handleAddWebsite}
            gridCols={config.gridCols}
          />
        )}

        {/* Empty State */}
        {websites.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              欢迎使用个人导航
            </h2>
            <p className="text-gray-500 mb-6">
              开始添加您常用的网站，创建专属的导航页面
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleAddWebsite}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                添加第一个网站
              </button>
              <button
                onClick={handleAddGroup}
                className="px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
              >
                创建分组
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Forms and Modals */}
      <WebsiteForm
        website={editingWebsite}
        groups={groups}
        onSave={handleSaveWebsite}
        onClose={() => {
          setShowWebsiteForm(false);
          setEditingWebsite(null);
        }}
        open={showWebsiteForm}
      />

      <GroupForm
        group={editingGroup}
        onSave={handleSaveGroup}
        onClose={() => {
          setShowGroupForm(false);
          setEditingGroup(null);
        }}
        open={showGroupForm}
      />

      <SettingsPanel
        open={showSettings}
        onClose={() => setShowSettings(false)}
        config={config}
        onConfigUpdate={updateConfig}
        onDataReset={handleDataReset}
      />
    </div>
  );
}