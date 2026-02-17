'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2, Shuffle, Sparkles } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { EXTERNAL_EVENTS } from '../components/scenarios/externalEvents';
import EventCard from '../components/scenarios/EventCard';
import ScenarioResultCard from '../components/scenarios/ScenarioResultCard';

const TIMEFRAME_LABELS = {
  short: '5〜10年後（2030〜2035年）',
  medium: '15〜25年後（2040〜2050年）',
  long: '25〜50年後（2050〜2075年）'
};

function generateRandomEvents(count = 3) {
  const categories = Object.keys(EXTERNAL_EVENTS);
  const timeframes = ['short', 'medium', 'long'];
  const shuffledTimeframes = [...timeframes].sort(() => 0.5 - Math.random());
  
  const events = [];
  const usedCategories = new Set();
  
  for (let i = 0; i < count; i++) {
    const timeframe = shuffledTimeframes[i];
    
    // カテゴリをシャッフルして未使用のものを優先
    const shuffledCategories = [...categories].sort(() => 0.5 - Math.random());
    let selectedCategory = null;
    
    for (const cat of shuffledCategories) {
      if (!usedCategories.has(cat) && EXTERNAL_EVENTS[cat]?.[timeframe]?.length > 0) {
        selectedCategory = cat;
        break;
      }
    }
    
    // 未使用がなければランダムに選択
    if (!selectedCategory) {
      for (const cat of shuffledCategories) {
        if (EXTERNAL_EVENTS[cat]?.[timeframe]?.length > 0) {
          selectedCategory = cat;
          break;
        }
      }
    }
    
    if (selectedCategory) {
      usedCategories.add(selectedCategory);
      const categoryEvents = EXTERNAL_EVENTS[selectedCategory][timeframe];
      const randomEvent = categoryEvents[Math.floor(Math.random() * categoryEvents.length)];
      
      events.push({
        id: `event-${i}`,
        category: selectedCategory,
        timeframe: timeframe,
        text: randomEvent,
        probability: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)]
      });
    }
  }
  
  return events;
}

export default function EventSelection() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [events, setEvents] = useState(() => generateRandomEvents(3));
  const [testResult, setTestResult] = useState(null);
  const [testError, setTestError] = useState(null);

  useEffect(() => {
    const savedProfile = sessionStorage.getItem('careerCompassProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      router.push('/profile');
    }
  }, [router]);

  const getDocumentsContext = () => {
    const savedDocuments = sessionStorage.getItem('careerCompassDocuments');
    if (!savedDocuments) return '';
    
    const documents = JSON.parse(savedDocuments);
    if (documents.length === 0) return '';
    
    const docTexts = documents.map(doc => {
      const typeLabels = {
        diary: '日記・ジャーナル',
        sns: 'SNS投稿',
        resume: '自己紹介・履歴書',
        reflection: '振り返りメモ',
        other: 'その他資料'
      };
      return `【${typeLabels[doc.type] || 'その他'}】${doc.title || ''}\n${doc.content || '(ファイルアップロード済み)'}`;
    }).join('\n\n');
    
    return `\n\n## ユーザーがアップロードした追加資料\n以下はユーザー自身について書かれた資料です。この情報も踏まえてシナリオを生成してください。\n\n${docTexts}`;
  };

  const shuffleEvents = () => {
    setEvents(generateRandomEvents(3));
  };

  const generateScenarios = async () => {
    console.log('[Frontend] ===== generateScenarios called =====');
    
    // 二重送信防止：既に生成中なら何もしない
    if (generating) {
      console.log('[Frontend] Already generating, ignoring click');
      return;
    }
    
    setGenerating(true);
    setTestResult(null);
    setTestError(null);
    
    try {
        console.log('[Frontend] Step 1: Building profileText');
        const profileText = Object.entries(profile)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('\n');
        console.log('[Frontend] profileText length:', profileText.length);

        console.log('[Frontend] Step 2: Building eventTexts');
        const eventTexts = events.map(e => e.text);
        console.log('[Frontend] eventTexts count:', eventTexts.length);

        console.log('[Frontend] Step 3: Building documentsContext');
        const documentsContext = getDocumentsContext();
        console.log('[Frontend] documentsContext length:', documentsContext.length);

        console.log('[Frontend] Step 4: Calling backend function');
        const response = await fetch('/api/generate-scenarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profileText,
            eventTexts,
            documentsContext
          })
        });

        console.log('[Frontend] Step 5: Response received');
        console.log('[Frontend] Response status:', response.status);
        
        const result = await response.json();
        console.log('[Frontend] Response data:', result);

        // レスポンスのokチェック（バックエンドで設定したフラグ）
        if (!response.ok || response.status !== 200) {
          // HTTPエラーの場合
          const errorText = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
          console.error('[Frontend] HTTP Error:', errorText);
          
          setTestError({ 
            error: `サーバーエラー（ステータス: ${response.status}）`,
            technicalDetails: errorText,
            rawText: errorText,
            requestId: result?.requestId || 'N/A'
          });
          
          alert(`エラーが発生しました:\n\nステータス: ${response.status}\n詳細: ${errorText.substring(0, 200)}`);
          return;
        }

        // okフラグチェック（バックエンドで設定）
        if (result.ok === false || result.error) {
          console.error('[Frontend] Backend error:', result);
          
          const errorMessage = result.error || '不明なエラー';
          const stage = result.stage || 'unknown';
          
          // パースエラーの場合は生テキストを表示
          let displayError = `処理ステージ「${stage}」でエラー: ${errorMessage}`;
          if (result.errorType === 'PARSE_ERROR' && result.rawContent) {
            displayError += `\n\nパース結果: ${result.parsedCount}個のシナリオ検出`;
          }
          
          setTestError({ 
            error: displayError,
            technicalDetails: JSON.stringify(result, null, 2),
            rawText: result.rawContent || JSON.stringify(result, null, 2),
            requestId: result.requestId || 'N/A',
            parsedCount: result.parsedCount,
            isParseError: result.errorType === 'PARSE_ERROR'
          });
          
          alert(`シナリオ生成エラー:\n\nステージ: ${stage}\n詳細: ${errorMessage}\nリクエストID: ${result.requestId || 'N/A'}`);
          return;
        }

        // 成功時の処理
        if (result.scenarios && result.scenarios.length > 0) {
          console.log('[Frontend] Success! Scenarios received:', result.scenarios.length);
          setTestResult(result);
        } else {
          console.error('[Frontend] No scenarios in response');
          
          setTestError({ 
            error: 'シナリオが生成されませんでした',
            technicalDetails: 'scenarios配列が空またはundefined',
            rawText: JSON.stringify(result, null, 2),
            requestId: result.requestId || 'N/A'
          });
          
          alert('シナリオが生成されませんでした。もう一度お試しください。');
        }
    } catch (error) {
        console.error('[Frontend] Exception caught!', error);
        
        const errorDetails = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          response: error.response
        };
        
        console.error('[Frontend] Error details:', errorDetails);
        
        setTestError({ 
          error: `エラー: ${error.message}`,
          technicalDetails: JSON.stringify(errorDetails, null, 2),
          rawText: JSON.stringify(errorDetails, null, 2),
          requestId: 'N/A'
        });
        
        alert(`エラーが発生しました:\n\n${error.message}\n\n詳細はエラー表示を確認してください。`);
    } finally {
        console.log('[Frontend] Finally: setting generating to false');
        setGenerating(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/profile')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          プロフィールに戻る
        </Button>

        {/* ヘッダー */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-3">
            外生イベントルーレット
          </h1>
          <p className="text-slate-600 text-lg mb-2">
            あなたのキャリアに影響を与える可能性がある外生イベントを{events.length}つ、ランダムに抽出しました。
          </p>
          <p className="text-slate-600 text-lg mb-2">
            気に入らない組み合わせの場合は、「再抽選」ボタンで別のイベントを選び直すことができます。
          </p>
          <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-2">
            ※ イベントは学術機関やコンサルティングファームの予測レポート（World Economic Forum、McKinsey、OECD等）に基づいて作成されています
          </p>
          <p className="text-slate-600 text-lg">
            これらのイベントをもとに、1つのシナリオを生成します。
          </p>
        </div>

        {/* イベント一覧ヘッダー */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <div>
                <h2 className="text-xl font-bold text-indigo-600">
                  選択された{events.length}つのイベント
                </h2>
                <p className="text-sm text-slate-500">
                  カテゴリーバランスよく抽選されています
                </p>
              </div>
            </div>
            <Button
              onClick={shuffleEvents}
              variant="default"
              className="bg-indigo-600 hover:bg-indigo-700 gap-2"
            >
              <Shuffle className="w-4 h-4" />
              再抽選
            </Button>
          </div>

          {/* イベントカードグリッド */}
          <div className="grid md:grid-cols-2 gap-4">
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>

        {/* 生成ボタン */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => router.push('/profile')}
            className="border-slate-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>

          <Button
            onClick={generateScenarios}
            disabled={generating}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-10"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                シナリオ生成中（1〜2分お待ちください）
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                シナリオを生成
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* 結果表示 */}
        {testResult && testResult.scenarios && (
          <div className="mt-20">
            <div className="mb-16 max-w-2xl">
              <h2 className="text-sm tracking-widest text-slate-400 mb-4">
                YOUR FUTURE PATH
              </h2>
              <p className="text-base leading-relaxed text-slate-600" style={{ lineHeight: '2.0' }}>
                外部環境の変化によって、あなたの選択肢がどう変わるか。
                1つの未来の分岐点を提示します。
              </p>
            </div>

            <div className="space-y-20">
              {testResult.scenarios.map((scenario, index) => (
                <ScenarioResultCard 
                  key={index} 
                  scenario={scenario} 
                  index={index} 
                />
              ))}
            </div>
          </div>
        )}

        {testError && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-red-200 p-6">
            <h3 className="text-lg font-bold text-red-700 mb-3">✗ エラーが発生しました</h3>
            <p className="text-red-600 mb-3 text-base whitespace-pre-line">{testError.error}</p>
            
            {testError.requestId && testError.requestId !== 'N/A' && (
              <p className="text-xs text-slate-500 mb-3">リクエストID: {testError.requestId}</p>
            )}
            
            {testError.isParseError && testError.parsedCount !== undefined && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-amber-800 mb-2">
                  ⚠️ パース結果: {testError.parsedCount}個のシナリオが検出されました（3個必要）
                </p>
                <details>
                  <summary className="cursor-pointer text-xs text-amber-700 hover:text-amber-900">
                    Claudeの生出力を表示
                  </summary>
                  <pre className="mt-2 bg-white rounded p-2 text-xs overflow-auto max-h-96 text-slate-800 border border-amber-200">
                    {testError.rawText}
                  </pre>
                </details>
              </div>
            )}
            
            {testError.technicalDetails && !testError.isParseError && (
              <details className="mb-4">
                <summary className="cursor-pointer text-sm text-slate-600 hover:text-slate-800 mb-2">
                  技術的な詳細を表示
                </summary>
                <div className="bg-red-50 rounded-lg p-3 text-xs text-red-700 mb-2">
                  {testError.technicalDetails}
                </div>
                <pre className="bg-red-50 rounded-lg p-4 text-xs overflow-auto max-h-64 text-red-800">
                  {testError.rawText}
                </pre>
              </details>
            )}
            
            <Button
              onClick={generateScenarios}
              disabled={generating}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              {generating ? '生成中...' : '再試行'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}