'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Trash2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdditionalContextUpload({ profileId, contexts, onContextsChange }) {
  const [uploading, setUploading] = useState(false);
  const [newContext, setNewContext] = useState({
    context_type: 'diary',
    title: '',
    content: ''
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // テキストファイルの場合は内容を読み込む
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await file.text();
        const context = {
          id: Date.now().toString(),
          user_profile_id: profileId,
          context_type: newContext.context_type,
          title: newContext.title || file.name,
          content: text.substring(0, 50000),
          file_url: null
        };
        
        onContextsChange([...contexts, context]);
        setNewContext({ context_type: 'diary', title: '', content: '' });
      } else {
        alert('テキストファイル（.txt, .md）のみ対応しています。ファイルの内容をテキストとして入力してください。');
      }
    } catch (error) {
      console.error('Error reading file:', error);
      alert('ファイルの読み込みに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!newContext.content.trim()) return;

    setUploading(true);
    try {
      const context = {
        id: Date.now().toString(),
        user_profile_id: profileId,
        context_type: newContext.context_type,
        title: newContext.title || '追加コンテキスト',
        content: newContext.content
      };
      
      onContextsChange([...contexts, context]);
      setNewContext({ context_type: 'diary', title: '', content: '' });
    } catch (error) {
      console.error('Error saving context:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      onContextsChange(contexts.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting context:', error);
    }
  };

  const contextTypeLabels = {
    diary: '日記',
    sns_export: 'SNSエクスポート',
    resume: '履歴書',
    journal: 'ジャーナル',
    other: 'その他'
  };

  return (
    <Card className="border-indigo-100">
      <CardHeader>
        <CardTitle>追加情報の提供</CardTitle>
        <CardDescription>
          日記、SNSのエクスポート、履歴書など、あなたをより深く理解するための情報を追加できます
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* アップロードフォーム */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>種類</Label>
              <Select
                value={newContext.context_type}
                onValueChange={(value) => setNewContext({ ...newContext, context_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(contextTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>タイトル（任意）</Label>
              <Input
                value={newContext.title}
                onChange={(e) => setNewContext({ ...newContext, title: e.target.value })}
                placeholder="例：2024年の振り返り"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>テキストで入力</Label>
            <Textarea
              value={newContext.content}
              onChange={(e) => setNewContext({ ...newContext, content: e.target.value })}
              placeholder="日記、SNSの投稿、自己紹介など、自由に入力してください"
              className="min-h-[120px]"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleTextSubmit}
              disabled={uploading || !newContext.content.trim()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  テキストを保存
                </>
              )}
            </Button>

            <Label htmlFor="file-upload" className="cursor-pointer">
              <div className={`inline-flex items-center justify-center px-4 py-2 rounded-md border transition-colors ${
                uploading 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'border-indigo-200 hover:bg-indigo-50'
              }`}>
                <Upload className="w-4 h-4 mr-2" />
                ファイルをアップロード
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
                accept=".txt,.md,.doc,.docx,.pdf"
              />
            </Label>
          </div>
        </div>

        {/* 保存済みコンテキスト */}
        {contexts.length > 0 && (
          <div className="space-y-2">
            <Label>保存済みの情報</Label>
            <div className="space-y-2">
              {contexts.map(context => (
                <div
                  key={context.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {contextTypeLabels[context.context_type]}
                      </Badge>
                      <span className="font-medium text-sm truncate">{context.title}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {context.content?.substring(0, 100)}...
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(context.id)}
                    className="flex-shrink-0 ml-2"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}