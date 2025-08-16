import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '个人导航页 - 精美的网站导航管理工具',
  description: '现代化的个人导航页面，支持网站管理、分组功能、主题自定义等特性',
  keywords: '导航页,网站管理,书签管理,个人主页',
  authors: [{ name: '个人导航页' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}