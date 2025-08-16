'use client';

import { useState } from 'react';
import { Group, Website } from '@/lib/types';
import { WebsiteCard } from './WebsiteCard';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Edit2, Trash2, Plus } from 'lucide-react';

interface GroupSectionProps {
  group?: Group;
  websites: Website[];
  isEditable: boolean;
  onEditWebsite: (website: Website) => void;
  onDeleteWebsite: (id: string) => void;
  onUpdateWebsiteUrl: (id: string, urlIndex: number) => void;
  onEditGroup?: (group: Group) => void;
  onDeleteGroup?: (id: string) => void;
  onToggleGroup?: (id: string, collapsed: boolean) => void;
  onAddWebsite?: () => void;
  gridCols: number;
}

export function GroupSection({
  group,
  websites,
  isEditable,
  onEditWebsite,
  onDeleteWebsite,
  onUpdateWebsiteUrl,
  onEditGroup,
  onDeleteGroup,
  onToggleGroup,
  onAddWebsite,
  gridCols
}: GroupSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isCollapsed = group?.collapsed ?? false;
  const hasWebsites = websites.length > 0;

  const handleToggleCollapse = () => {
    if (group && onToggleGroup) {
      onToggleGroup(group.id, !isCollapsed);
    }
  };

  const gridClass = `grid gap-4 ${
    gridCols === 6 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' :
    gridCols === 5 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' :
    gridCols === 4 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' :
    'grid-cols-2 sm:grid-cols-3'
  }`;

  if (!group) {
    // Ungrouped websites
    return (
      <div className="mb-8">
        {hasWebsites && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                未分组
              </h2>
              {isEditable && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAddWebsite}
                  className="bg-white/80 hover:bg-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加网站
                </Button>
              )}
            </div>
            <div className={gridClass}>
              {websites.map((website) => (
                <WebsiteCard
                  key={website.id}
                  website={website}
                  isEditable={isEditable}
                  onEdit={onEditWebsite}
                  onDelete={onDeleteWebsite}
                  onUpdateUrl={onUpdateWebsiteUrl}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div
        className="flex items-center justify-between mb-4 group/header"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleCollapse}
            className="p-1 mr-2"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          
          <div className="flex items-center">
            {group.color && (
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: group.color }}
              />
            )}
            <h2 className="text-lg font-semibold text-gray-800">
              {group.name}
            </h2>
            <span className="ml-2 text-sm text-gray-500">
              ({websites.length})
            </span>
          </div>
        </div>

        {isEditable && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onAddWebsite}
              className="bg-white/80 hover:bg-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加网站
            </Button>
            
            {isHovered && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditGroup?.(group)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteGroup?.(group.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {!isCollapsed && hasWebsites && (
        <div className={gridClass}>
          {websites.map((website) => (
            <WebsiteCard
              key={website.id}
              website={website}
              isEditable={isEditable}
              onEdit={onEditWebsite}
              onDelete={onDeleteWebsite}
              onUpdateUrl={onUpdateWebsiteUrl}
            />
          ))}
        </div>
      )}

      {!isCollapsed && !hasWebsites && isEditable && (
        <div className="text-center py-8 text-gray-500 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="mb-2">该分组暂无网站</p>
          <Button
            variant="outline"
            onClick={onAddWebsite}
          >
            <Plus className="w-4 h-4 mr-2" />
            添加第一个网站
          </Button>
        </div>
      )}
    </div>
  );
}