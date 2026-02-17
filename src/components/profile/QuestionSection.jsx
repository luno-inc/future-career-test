import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const QUESTIONS = {
  basic: [
    { 
      id: 'university', 
      label: '大学名・学部・学科・専攻を教えてください', 
      type: 'textarea', 
      placeholder: '例：東京大学 工学部 電気電子工学科\n早稲田大学 政治経済学部 経済学科'
    },
    { 
      id: 'company', 
      label: '勤務企業（就職先）を教えてください', 
      type: 'input', 
      placeholder: '例：株式会社○○、未定、就職活動中など',
      optional: true
    },
    { 
      id: 'age', 
      label: '年齢を教えてください', 
      type: 'select', 
      options: ['18歳以下', '19歳', '20歳', '21歳', '22歳', '23歳', '24歳', '25歳', '26〜29歳', '30〜34歳', '35〜39歳', '40〜44歳', '45〜49歳', '50〜54歳', '55〜59歳', '60歳以上']
    },
    { 
      id: 'grade', 
      label: '現在の立場を教えてください', 
      type: 'select', 
      options: ['大学1年', '大学2年', '大学3年', '大学4年', '修士1年', '修士2年', '博士課程', '教員・研究者', '企業勤務（正社員）', '企業勤務（非正規）', '自営業・フリーランス', '公務員', '求職中', 'その他']
    },
    { 
      id: 'major', 
      label: '専攻分野・専門領域を教えてください', 
      type: 'select', 
      options: ['文学・人文科学', '法学・政治学', '経済学・経営学', '社会学・社会福祉学', '教育学・心理学', '理学', '工学', '農学', '医学・歯学・薬学', '看護・保健', '芸術・デザイン', '体育・スポーツ科学', '情報・データサイエンス', '国際関係・外国語', 'その他', '特になし']
    },
    { 
      id: 'industry', 
      label: '志望業界・現在/今後関わりたい分野を選んでください（複数選択可）', 
      type: 'multiselect', 
      options: ['IT・ソフトウェア', '製造・メーカー', '金融・保険', 'コンサルティング', '商社・流通', 'サービス・小売', '広告・メディア', '医療・福祉', '教育・研究', '公務員・非営利', 'インフラ・エネルギー', 'クリエイティブ', '農業・食品', '不動産・建設', 'その他', 'まだ未定']
    }
  ],
  values: [
    { id: 'core_values', label: 'あなたが大切にしている価値観を3つ挙げてください', type: 'textarea', placeholder: '例：挑戦、安定、家族、創造性、自由など' },
    { id: 'most_dedicated', label: 'これまで一番打ち込んだことは何ですか？', type: 'textarea', placeholder: '部活、研究、アルバイト、趣味など具体的に教えてください' },
    { id: 'influential_people', label: '最も影響を受けた人物は誰ですか？その理由も教えてください', type: 'textarea', placeholder: '例：両親、恩師、友人、著名人など、理由も含めて記述してください' }
  ],
  strengths: [
    { id: 'strengths', label: '人より得意だと思うことは何ですか？', type: 'textarea', placeholder: '例：人の話を聞くこと、論理的思考、プレゼン、細かい作業など' },
    { id: 'weaknesses', label: '苦手で避けたい作業・役割は何ですか？', type: 'textarea', placeholder: '例：細かい事務作業、人前で話すこと、締め切りに追われる仕事など' },
    { id: 'difficult_experience', label: '人生で最もつらかった経験と、そこから学んだことは何ですか？', type: 'textarea', placeholder: 'つらかった出来事とそこから得た学びを教えてください' }
  ],
  continuity: [
    { id: 'past_dreams', label: '過去（高校生の頃など）の自分が持っていた夢や価値観は何でしたか？', type: 'textarea', placeholder: '当時どんな将来を思い描いていましたか？' },
    { id: 'value_evolution', label: 'それは今のあなたにどう受け継がれている、または変化しましたか？', type: 'textarea', placeholder: '過去の夢や価値観が今どうなっているか教えてください' }
  ],
  present: [
    { id: 'what_to_keep', label: '今の生活で「手放したくないもの」は何ですか？', type: 'textarea', placeholder: '大切にしていること、維持したいことを教えてください' },
    { id: 'future_concerns', label: '将来への不安や懸念を具体的に教えてください', type: 'textarea', placeholder: '経済面、キャリア、人間関係など、率直に教えてください' },
    { 
      id: 'location_preference', 
      label: '将来の勤務地・居住地についての希望を教えてください', 
      type: 'select', 
      options: ['現在の地域に留まりたい', '都市部に移りたい', '地方に移りたい', '海外で働きたい', '場所にこだわらない', 'まだ決めていない']
    }
  ],
  future: [
    { id: 'future_challenges', label: '今後10年で挑戦したい領域はありますか？', type: 'textarea', placeholder: '興味のある分野、挑戦したいテーマを教えてください' },
    { 
      id: 'uncertainty_attitude', 
      label: '不確実な未来に対してどう向き合いたいですか？', 
      type: 'select', 
      options: ['リスクを取ってでも挑戦したい', 'ある程度の挑戦はしたい', '安定を重視したい', '状況次第で柔軟に対応したい', 'まだ分からない']
    }
  ]
};

export default function QuestionSection({ sectionId, profile, setProfile }) {
  const questions = QUESTIONS[sectionId] || [];

  const handleChange = (questionId, value) => {
    setProfile(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleMultiselectToggle = (questionId, option) => {
    const currentValues = profile[questionId] || [];
    const newValues = currentValues.includes(option)
      ? currentValues.filter(v => v !== option)
      : [...currentValues, option];
    handleChange(questionId, newValues);
  };

  return (
    <div className="space-y-6">
      {questions.map((question, index) => (
        <div key={question.id} className="space-y-2">
          <Label htmlFor={question.id} className="text-base">
            <span className="text-indigo-600 font-semibold">Q{index + 1}.</span>{' '}
            {question.label}
            {question.optional && (
              <span className="text-sm text-slate-400 ml-2">(任意)</span>
            )}
          </Label>
          
          {question.type === 'textarea' ? (
            <Textarea
              id={question.id}
              value={profile[question.id] || ''}
              onChange={(e) => handleChange(question.id, e.target.value)}
              placeholder={question.placeholder}
              className="min-h-[120px] border-indigo-100 focus:border-indigo-300"
            />
          ) : question.type === 'select' ? (
            <Select
              value={profile[question.id] || ''}
              onValueChange={(value) => handleChange(question.id, value)}
            >
              <SelectTrigger className="border-indigo-100 focus:border-indigo-300">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                {question.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : question.type === 'multiselect' ? (
            <div className="border border-indigo-100 rounded-md p-4 space-y-3">
              {question.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${option}`}
                    checked={(profile[question.id] || []).includes(option)}
                    onCheckedChange={() => handleMultiselectToggle(question.id, option)}
                  />
                  <label
                    htmlFor={`${question.id}-${option}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <Input
              id={question.id}
              value={profile[question.id] || ''}
              onChange={(e) => handleChange(question.id, e.target.value)}
              placeholder={question.placeholder}
              className="border-indigo-100 focus:border-indigo-300"
            />
          )}
        </div>
      ))}
    </div>
  );
}