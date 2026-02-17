'use client'

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Compass, Sparkles, ChevronRight, Shield } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-10" />
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse" />
              <Compass className="w-20 h-20 text-indigo-600 relative" strokeWidth={1.5} />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Career Compass
          </h1>
          
          <p className="text-xl text-center text-slate-600 mb-4 max-w-3xl mx-auto leading-relaxed">
            生成AIが描く、あなたの未来キャリア
          </p>
          
          <p className="text-center text-slate-500 max-w-2xl mx-auto mb-8">
            技術革新、気候変動、地政学的変動。予測不可能な未来に対して、<br />
            複数のシナリオを通じて、あなた自身の「次の一歩」を見つけましょう。
          </p>

          {/* プライバシー保護の説明 */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 text-sm text-green-800">
              <Shield className="w-4 h-4" />
              <span>入力データは保存されません。セッション終了後に自動削除されます。</span>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all"
            >
              <Link href="/profile">
                <Sparkles className="w-5 h-5 mr-2" />
                診断を開始する
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-indigo-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">深い自己理解</CardTitle>
              <CardDescription>
                27の質問を通じて、あなたの価値観、経験、夢を可視化します。
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-purple-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">複数の未来シナリオ</CardTitle>
              <CardDescription>
                外生イベントを考慮した複数の異なる未来の可能性を生成。
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-indigo-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center mb-4">
                <ChevronRight className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">次の一歩</CardTitle>
              <CardDescription>
                各シナリオに対する具体的なアクションプランを提示します。
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Research Background */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Card className="border-slate-200 bg-white/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-center">研究に基づくアプローチ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-600">
            <p>
              このシステムは「未来適応的キャリア形成（Future Adaptive Career Formation）」の理論に基づいています。
            </p>
            <p>
              従来の「最適化（optimization）」ではなく、「適応化（adaptation）」を重視し、
              変化を脅威ではなく、学習と再構成の契機として捉えます。
            </p>
            <p className="text-sm text-slate-500 italic">
              ※ 本システムは研究目的で設計されており、提供されるシナリオは参考情報です。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}