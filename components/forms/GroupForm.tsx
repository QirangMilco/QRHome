'use client';

import { useState, useEffect } from 'react';
import { Group } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface GroupFormProps {
  group?: Group;
  onSave: (group: Omit<Group, 'id' | 'order'>) => void;
  onClose: () => void;
  open: boolean;
}

const colorOptions = [
  '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1',
  '#EC4899', '#14B8A6', '#F97316', '#84CC16', '#06B6D4', '#8B5CF6'
];

export function GroupForm({ group, onSave, onClose, open }: GroupFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    collapsed: false,
    color: colorOptions[0]
  });

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        collapsed: group.collapsed,
        color: group.color || colorOptions[0]
      });
    } else {
      setFormData({
        name: '',
        collapsed: false,
        color: colorOptions[0]
      });
    }
  }, [group, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    onSave({
      name: formData.name.trim(),
      collapsed: formData.collapsed,
      color: formData.color
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {group ? '编辑分组' : '新建分组'}
          </DialogTitle>
          <DialogDescription>
            {group ? '修改分组信息' : '创建新的网站分组'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">分组名称 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="例如：工作工具"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>分组颜色</Label>
            <div className="grid grid-cols-6 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color 
                      ? 'border-gray-400 scale-110' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit">
              {group ? '保存' : '创建'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}