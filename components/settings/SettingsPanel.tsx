'use client';

import { useState } from 'react';
import { AppConfig } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StorageService } from '@/lib/storage';
import { Download, Upload, RefreshCw, Palette, Layout, Database } from 'lucide-react';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  config: AppConfig;
  onConfigUpdate: (updates: Partial<AppConfig>) => void;
  onDataReset: () => void;
}

const colorOptions = [
  { name: '蓝色', value: '#3B82F6' },
  { name: '紫色', value: '#8B5CF6' },
  { name: '绿色', value: '#10B981' },
  { name: '橙色', value: '#F97316' },
  { name: '红色', value: '#EF4444' },
  { name: '青色', value: '#06B6D4' },
];

const backgroundOptions = [
  { name: '渐变', value: 'gradient' },
  { name: '纯色', value: 'solid' },
  { name: '图片', value: 'image' },
];

export function SettingsPanel({ open, onClose, config, onConfigUpdate, onDataReset }: SettingsPanelProps) {
  const [importData, setImportData] = useState('');

  const handleExport = () => {
    const data = StorageService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nav-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    try {
      if (StorageService.importData(importData)) {
        alert('导入成功！页面将刷新以应用新配置。');
        window.location.reload();
      } else {
        alert('导入失败，请检查JSON格式是否正确。');
      }
    } catch {
      alert('导入失败，请检查JSON格式是否正确。');
    }
  };

  const handleReset = () => {
    if (confirm('确定要重置所有数据吗？此操作不可撤销。')) {
      onDataReset();
      StorageService.clear();
      window.location.reload();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>设置面板</SheetTitle>
          <SheetDescription>
            自定义您的导航页面外观和功能
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <Tabs defaultValue="appearance" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="appearance" className="text-xs">
                <Palette className="w-4 h-4 mr-1" />
                外观
              </TabsTrigger>
              <TabsTrigger value="layout" className="text-xs">
                <Layout className="w-4 h-4 mr-1" />
                布局
              </TabsTrigger>
              <TabsTrigger value="data" className="text-xs">
                <Database className="w-4 h-4 mr-1" />
                数据
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>主题设置</CardTitle>
                  <CardDescription>自定义页面的色彩和主题</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>主题模式</Label>
                    <Select
                      value={config.theme}
                      onValueChange={(value: 'light' | 'dark') => onConfigUpdate({ theme: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">浅色模式</SelectItem>
                        <SelectItem value="dark">深色模式</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>主色调</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          className={`p-3 rounded-lg border-2 text-white text-sm font-medium transition-all ${
                            config.primaryColor === color.value 
                              ? 'border-gray-400 scale-105' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => onConfigUpdate({ primaryColor: color.value })}
                        >
                          {color.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>背景样式</Label>
                    <Select
                      value={config.background}
                      onValueChange={(value) => onConfigUpdate({ background: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {backgroundOptions.map((bg) => (
                          <SelectItem key={bg.value} value={bg.value}>
                            {bg.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="layout" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>布局设置</CardTitle>
                  <CardDescription>调整网站卡片的显示方式</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>显示模式</Label>
                    <Select
                      value={config.layout}
                      onValueChange={(value: 'grid' | 'list') => onConfigUpdate({ layout: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">网格模式</SelectItem>
                        <SelectItem value="list">列表模式</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {config.layout === 'grid' && (
                    <div className="space-y-2">
                      <Label>网格列数: {config.gridCols}</Label>
                      <Slider
                        value={[config.gridCols]}
                        onValueChange={([value]) => onConfigUpdate({ gridCols: value })}
                        min={3}
                        max={8}
                        step={1}
                        className="py-2"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>3列</span>
                        <span>8列</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>显示网站描述</Label>
                      <p className="text-sm text-gray-500">在网站卡片中显示描述信息</p>
                    </div>
                    <Switch
                      checked={config.showDescriptions}
                      onCheckedChange={(checked) => onConfigUpdate({ showDescriptions: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>数据管理</CardTitle>
                  <CardDescription>备份、恢复和重置您的数据</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>导出数据</Label>
                    <p className="text-sm text-gray-500">将您的配置和数据导出为JSON文件</p>
                    <Button onClick={handleExport} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      导出配置
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>导入数据</Label>
                    <p className="text-sm text-gray-500">从JSON文件恢复您的配置和数据</p>
                    <Input
                      placeholder="粘贴JSON数据..."
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                    />
                    <Button 
                      onClick={handleImport} 
                      className="w-full"
                      disabled={!importData.trim()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      导入配置
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>重置数据</Label>
                    <p className="text-sm text-gray-500 text-red-600">
                      警告：此操作将删除所有数据，不可撤销
                    </p>
                    <Button 
                      onClick={handleReset} 
                      variant="destructive"
                      className="w-full"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      重置所有数据
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}