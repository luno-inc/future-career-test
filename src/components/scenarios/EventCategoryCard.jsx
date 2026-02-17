import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle } from 'lucide-react';

const CATEGORY_ICONS = {
  '気候・環境': '🌍',
  'エネルギー・資源': '⚡',
  '人口・都市・移動': '🏙️',
  '経済・金融': '💹',
  '技術・AI・デジタル': '🤖',
  '健康・医療・食': '🏥',
  '社会構造・働き方': '💼',
  '政治・ガバナンス・安全保障': '🛡️',
  '文化・価値観・教育': '📚',
  '宇宙・フロンティア・ハイリスク技術': '🚀'
};

const CATEGORY_COLORS = {
  '気候・環境': 'from-green-500 to-emerald-600',
  'エネルギー・資源': 'from-yellow-500 to-orange-600',
  '人口・都市・移動': 'from-blue-500 to-cyan-600',
  '経済・金融': 'from-purple-500 to-pink-600',
  '技術・AI・デジタル': 'from-indigo-500 to-blue-600',
  '健康・医療・食': 'from-red-500 to-rose-600',
  '社会構造・働き方': 'from-teal-500 to-green-600',
  '政治・ガバナンス・安全保障': 'from-slate-500 to-gray-600',
  '文化・価値観・教育': 'from-violet-500 to-purple-600',
  '宇宙・フロンティア・ハイリスク技術': 'from-fuchsia-500 to-pink-600'
};

export default function EventCategoryCard({ category, isSelected, onToggle }) {
  return (
    <Card
      onClick={onToggle}
      className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 ${
        isSelected 
          ? 'ring-2 ring-indigo-600 shadow-xl' 
          : 'hover:shadow-lg'
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_COLORS[category]} opacity-10`} />
      <div className="relative p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="text-3xl">{CATEGORY_ICONS[category]}</div>
          {isSelected ? (
            <CheckCircle2 className="w-6 h-6 text-indigo-600" />
          ) : (
            <Circle className="w-6 h-6 text-slate-300" />
          )}
        </div>
        <h3 className="font-semibold text-sm leading-tight">{category}</h3>
      </div>
    </Card>
  );
}