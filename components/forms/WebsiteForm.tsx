'use client';

import { useState, useEffect } from 'react';
import { Website, Group } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Trash2, Globe } from 'lucide-react';

interface WebsiteFormProps {
  website?: Website;
  groups: Group[];
  onSave: (website: Omit<Website, 'id' | 'order'>) => void;
  onClose: () => void;
  open: boolean;
}

export function WebsiteForm({ website, groups, onSave, onClose, open }: WebsiteFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    urls: [''],
    activeUrlIndex: 0,
    icon: '',
    description: '',
    groupId: ''
  });

  useEffect(() => {
    if (website) {
      setFormData({
        name: website.name,
        urls: website.urls,
        activeUrlIndex: website.activeUrlIndex,
        icon: website.icon || '',
        description: website.description || '',
        groupId: website.groupId || 'none-group'
      });
    } else {
      setFormData({
        name: '',
        urls: [''],
        activeUrlIndex: 0,
        icon: '',
        description: '',
        groupId: 'none-group'
      });
    }
  }, [website, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validUrls = formData.urls.filter(url => url.trim() !== '');
    if (validUrls.length === 0 || !formData.name.trim()) {
      return;
    }

    onSave({
      name: formData.name.trim(),
      urls: validUrls,
      activeUrlIndex: Math.min(formData.activeUrlIndex, validUrls.length - 1),
      icon: formData.icon.trim() || undefined,
      description: formData.description.trim() || undefined,
      groupId: formData.groupId || undefined
    });
  };

  const addUrl = () => {
    setFormData(prev => ({
      ...prev,
      urls: [...prev.urls, '']
    }));
  };

  const removeUrl = (index: number) => {
    if (formData.urls.length <= 1) return;
    
    const newUrls = formData.urls.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      urls: newUrls,
      activeUrlIndex: Math.min(prev.activeUrlIndex, newUrls.length - 1)
    }));
  };

  const updateUrl = (index: number, url: string) => {
    const newUrls = [...formData.urls];
    newUrls[index] = url;
    setFormData(prev => ({
      ...prev,
      urls: newUrls
    }));
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).origin;
      return `${domain}/favicon.ico`;
    } catch {
      return '';
    }
  };

  const autoFillIcon = () => {
    const firstValidUrl = formData.urls.find(url => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    });

    if (firstValidUrl) {
      setFormData(prev => ({
        ...prev,
        icon: getFaviconUrl(firstValidUrl)
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {website ? '编辑网站' : '添加网站'}
          </DialogTitle>
          <DialogDescription>
            {website ? '修改网站信息' : '添加新的网站到导航页'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">网站名称 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="例如：Google"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>网址 *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addUrl}
              >
                <Plus className="w-4 h-4 mr-1" />
                添加网址
              </Button>
            </div>
            
            {formData.urls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) => updateUrl(index, e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1"
                />
                {formData.urls.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeUrl(index)}
                    className="shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            
            {formData.urls.length > 1 && (
              <div className="space-y-2">
                <Label>默认网址</Label>
                <Select
                  value={formData.activeUrlIndex.toString()}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    activeUrlIndex: parseInt(value) 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.urls.map((url, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        网址 {index + 1}: {url.slice(0, 30)}...
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">图标网址</Label>
            <div className="flex gap-2">
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="https://example.com/favicon.ico"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={autoFillIcon}
                size="icon"
                title="自动获取图标"
              >
                <Globe className="w-4 h-4" />
              </Button>
            </div>
            {formData.icon && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <img
                  src={formData.icon}
                  alt="图标预览"
                  className="w-4 h-4"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span>图标预览</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="网站描述（可选）"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="group">分组</Label>
            <Select
              value={formData.groupId}
              onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                groupId: value === "none-group" ? "" : value 
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择分组（可选）" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none-group">无分组</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit">
              {website ? '保存' : '添加'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}