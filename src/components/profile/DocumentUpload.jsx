'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  FileText, 
  BookOpen, 
  MessageSquare, 
  User, 
  Clock,
  X,
  Loader2,
  Plus,
  Check
} from 'lucide-react';

const CONTEXT_TYPES = [
  { id: 'diary', label: '日記・ジャーナル', icon: BookOpen, color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'sns', label: 'SNSエクスポート', icon: MessageSquare, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'resume', label: '自己紹介・履歴書', icon: User, color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'reflection', label: '振り返りメモ', icon: Clock, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'other', label: 'その他', icon: FileText, color: 'bg-slate-100 text-slate-700 border-slate-200' }
];

export default function DocumentUpload({ documents, setDocuments }) {
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newDoc, setNewDoc] = useState({
    type: 'diary',
    title: '',
    content: '',
    file: null
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // テキストファイルの場合は内容を読み込む
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await file.text();
        setNewDoc(prev => ({
          ...prev,
          content: text,
          title: prev.title || file.name.replace(/\.[^/.]+$/, '')
        }));
      } else {
        // ファイルアップロード機能は削除されました
        alert('テキストファイル（.txt, .md）のみ対応しています。ファイルの内容をテキストとして入力してください。');
      }
    } catch (error) {
      console.error('File read error:', error);
      alert('ファイルの読み込みに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = () => {
    if (!newDoc.content) {
      alert('テキストを入力してください');
      return;
    }

    const doc = {
      id: Date.now().toString(),
      type: newDoc.type,
      title: newDoc.title || CONTEXT_TYPES.find(t => t.id === newDoc.type)?.label,
      content: newDoc.content,
      addedAt: new Date().toISOString()
    };

    setDocuments([...documents, doc]);
    setNewDoc({ type: 'diary', title: '', content: '', file: null });
    setIsAdding(false);
  };

  const handleRemove = (id) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  const getTypeConfig = (typeId) => CONTEXT_TYPES.find(t => t.id === typeId) || CONTEXT_TYPES[4];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">追加資料</h3>
          <p className="text-sm text-slate-500">
            あなたについて書かれた資料をアップロードすると、より精度の高い予測ができます
          </p>
        </div>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            variant="outline"
            size="sm"
            className="border-indigo-200 hover:bg-indigo-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            追加
          </Button>
        )}
      </div>

      {/* 追加済みドキュメント一覧 */}
      {documents.length > 0 && (
        <div className="grid gap-3">
          {documents.map(doc => {
            const typeConfig = getTypeConfig(doc.type);
            const Icon = typeConfig.icon;
            return (
              <div
                key={doc.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${typeConfig.color}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{doc.title}</p>
                  <p className="text-xs opacity-70">
                    {doc.content ? `${doc.content.slice(0, 50)}...` : 'ファイルアップロード済み'}
                  </p>
                </div>
                <Check className="w-4 h-4 text-green-600" />
                <button
                  onClick={() => handleRemove(doc.id)}
                  className="p-1 hover:bg-white/50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 新規追加フォーム */}
      {isAdding && (
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardContent className="p-4 space-y-4">
            {/* 種類選択 */}
            <div>
              <Label className="text-sm font-medium mb-2 block">資料の種類</Label>
              <div className="flex flex-wrap gap-2">
                {CONTEXT_TYPES.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setNewDoc(prev => ({ ...prev, type: type.id }))}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                        newDoc.type === type.id
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* タイトル */}
            <div>
              <Label htmlFor="doc-title" className="text-sm font-medium">タイトル（任意）</Label>
              <Input
                id="doc-title"
                value={newDoc.title}
                onChange={(e) => setNewDoc(prev => ({ ...prev, title: e.target.value }))}
                placeholder="例：2024年の振り返り"
                className="mt-1"
              />
            </div>

            {/* ファイルアップロード */}
            <div>
              <Label className="text-sm font-medium mb-2 block">ファイルをアップロード</Label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-indigo-400 hover:bg-white transition-colors">
                    {uploading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          クリックしてファイルを選択
                        </span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".txt,.md,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                対応形式: TXT, MD, PDF, DOC
              </p>
            </div>

            {/* テキスト直接入力 */}
            <div>
              <Label htmlFor="doc-content" className="text-sm font-medium">
                または直接テキストを入力
              </Label>
              <Textarea
                id="doc-content"
                value={newDoc.content}
                onChange={(e) => setNewDoc(prev => ({ ...prev, content: e.target.value }))}
                placeholder="日記やメモの内容をここに貼り付けてください..."
                className="mt-1 min-h-[120px]"
              />
            </div>

            {/* ボタン */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setNewDoc({ type: 'diary', title: '', content: '', file: null });
                }}
              >
                キャンセル
              </Button>
              <Button
                onClick={handleAdd}
                disabled={uploading || !newDoc.content}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                追加する
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 空の状態 */}
      {documents.length === 0 && !isAdding && (
        <div
          onClick={() => setIsAdding(true)}
          className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors"
        >
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-600">
            日記、SNS投稿、自己紹介文などをアップロード
          </p>
          <p className="text-xs text-slate-400 mt-1">
            より詳細な情報があると、精度の高いシナリオを生成できます
          </p>
        </div>
      )}
    </div>
  );
}