'use client';

import { useState } from 'react';
import { Website } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink, Edit2, Trash2, MoreVertical, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface WebsiteCardProps {
  website: Website;
  isEditable: boolean;
  onEdit: (website: Website) => void;
  onDelete: (id: string) => void;
  onUpdateUrl: (id: string, urlIndex: number) => void;
}

export function WebsiteCard({ website, isEditable, onEdit, onDelete, onUpdateUrl }: WebsiteCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const currentUrl = website.urls[website.activeUrlIndex] || website.urls[0];

  const handleVisit = () => {
    if (currentUrl) {
      window.open(currentUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleUrlSwitch = (urlIndex: number) => {
    onUpdateUrl(website.id, urlIndex);
  };

  return (
    <Card
      className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={!isEditable ? handleVisit : undefined}
    >
      <div className="p-4 text-center">
        {/* Website Icon */}
        <div className="mx-auto w-12 h-12 mb-3 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
          {website.icon ? (
            <img 
              src={website.icon} 
              alt={website.name}
              className="w-8 h-8 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <Globe className={`w-6 h-6 text-blue-500 ${website.icon ? 'hidden' : ''}`} />
        </div>

        {/* Website Name */}
        <h3 className="font-medium text-gray-900 mb-1 truncate">
          {website.name}
        </h3>

        {/* Description */}
        {website.description && (
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">
            {website.description}
          </p>
        )}

        {/* URL indicator for multiple URLs */}
        {website.urls.length > 1 && (
          <div className="flex justify-center mb-2">
            <div className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
              {website.activeUrlIndex + 1}/{website.urls.length}
            </div>
          </div>
        )}

        {/* Action buttons - only show when editable and hovered */}
        {isEditable && isHovered && (
          <div className="absolute inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleVisit();
                }}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(website);
                }}
              >
                <Edit2 className="w-4 h-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {website.urls.length > 1 && (
                    <>
                      {website.urls.map((url, index) => (
                        <DropdownMenuItem
                          key={index}
                          onClick={() => handleUrlSwitch(index)}
                          className={index === website.activeUrlIndex ? 'bg-blue-50' : ''}
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          <span className="truncate">URL {index + 1}</span>
                          {index === website.activeUrlIndex && (
                            <span className="ml-auto text-blue-500">●</span>
                          )}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={() => onDelete(website.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    删除网站
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}