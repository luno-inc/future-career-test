Deno.serve(async (req) => {
  // リクエストIDを生成（デバッグ用）
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  console.log(`[${requestId}] Request started`);
  
  try {
    console.log(`[${requestId}] Step 1: Parsing request body`);
    const { profileText, eventTexts, documentsContext } = await req.json();
    console.log(`[${requestId}] Received params:`, { profileText: profileText?.substring(0, 50), eventTexts, documentsContext: documentsContext?.substring(0, 50) });

    if (!profileText || !eventTexts || !Array.isArray(eventTexts)) {
      console.log(`[${requestId}] Error: Invalid parameters`);
      return Response.json({ 
        requestId,
        ok: false,
        stage: 'validation',
        error: 'Invalid parameters: profileText and eventTexts are required' 
      }, { status: 400 });
    }

    console.log(`[${requestId}] Step 2: Checking API key`);
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      console.log(`[${requestId}] Error: ANTHROPIC_API_KEY not configured`);
      return Response.json({ 
        requestId,
        ok: false,
        stage: 'config',
        error: 'ANTHROPIC_API_KEY not configured' 
      }, { status: 500 });
    }
    console.log(`[${requestId}] API key found`);

    const prompt = `
    あなたは「未来キャリアシナリオ」を生成する専門家である。

    【シナリオの目的】
    このシナリオの目的は、単にポジティブ/ネガティブな未来を提示することではない。

    読み手が
    「こんな未来は想像していなかったが、この論理なら確かに起こり得る」
    と驚きと納得を同時に感じること
    を最優先とする。

    具体的には：
    1. ユーザーのキャリアの幅を広げること
    2. 「考えていなかったが、確かにあり得る未来」に気づかせること
    3. 適切な危機感と、次の判断余地を同時に提示すること

    単なるネガティブな未来描写や、理想的な成功物語のどちらでもなく、
    「外部環境の変化によって新たな選択肢が現実的になる過程」を描くことである。

    ## 【ユーザープロフィール】
    ${profileText}
    ${documentsContext || ''}

    **重要：大学・企業の背景も文脈として考慮すること**
    ユーザーの出身大学や勤務企業が記載されている場合、それらを文脈の一つとして考慮する。
    ただし、「〇〇大学だから無理」「△△企業出身では通用しない」のような学歴差別的な表現は厳禁。
    構造的な制約を描く場合も、個人の能力や可能性を否定せず、環境や選択肢の変化として中立的に表現すること。

    ## 【外生イベント（Future Drivers）】
    ${eventTexts.map((event, i) => `${i + 1}. ${event}`).join('\n')}

    ⸻

    【本シナリオ生成の思想】

    以下を必ず満たすこと。
    - 各シナリオは **「今のユーザーが視野に入れていない選択肢」** を扱うこと
    - シナリオは「意外だが、構造的には十分にあり得る未来」でなければならない
    - 単なる悲観・破滅・理想的な成功物語は禁止。現実的な可能性と課題の両面を描くこと
    - "なぜそれが起きるのか"の手順（因果の連鎖）を必ず明示すること
    - 各シナリオには「新たな可能性」と「構造的な制約」の両方を含めること

    ⸻

    【STEP 0：ユーザー入力の解釈（必須）】

    シナリオ生成前に、以下を必ず出力する。

    【あなたの入力から読み取れること】
    - ユーザーが大切にしている価値観（3点以内）
    - ユーザーが「自分はやらない」と思っていそうな選択
    - ユーザーが恐れている未来・避けたい状況
    - ユーザーが前提として信じている世界観（暗黙の思い込み）

    ※この解釈が浅い場合、シナリオ生成を行ってはならない

    ⸻

    【STEP 1：シナリオの基本構造（最重要）】

    3つのシナリオを生成すること。

    **【重要：シナリオ分岐の強制】**

    3つのシナリオは、以下の条件を必ず満たすこと。
    この条件を満たさない場合、再生成せよ。

    **シナリオ1（安定重視ルート）：**
    - 経済合理性と社会的必要性が高い選択肢
    - 本人の価値観と大きな矛盾は生じないが、新しい視点が求められる
    - 「考えていなかったが、現実的な選択肢」として描く

    **シナリオ2（価値観優先ルート）：**
    - 本人の価値観を重視した選択
    - 経済的・社会的には不安定だが、新たな可能性もある
    - トレードオフを明確にし、判断余地を示す

    **シナリオ3（適応・転換ルート）：**
    - 外部環境の変化に適応した新しい役割
    - 本人の価値観の再解釈や優先順位の変更が必要
    - 葛藤と新たな可能性の両方を描写する
    - なぜこの選択が合理的かを構造的に説明する

    **【禁止事項】**
    - 3つすべてが「理想的な成功物語」になること
    - 3つすべてが「ネガティブな破滅」になること
    - 結果だけを変えて、心理構造が同じになること

    それぞれは必ず以下の構造を持つ。

    ① 新たな視点（冒頭で明示）
    例：
    - 「自由を重視してきたあなたが、構造の中で新たな自由を見出す未来」
    - 「挑戦を大切にしてきたあなたにとって、安定の中に潜む別の挑戦」
    - 「今は視野に入れていない選択肢が、環境変化により現実的になる未来」

    ② 外部環境の変化（Future Drivers）
    - Future Drivers は 必ず制約として使うこと
    - 以下のような使い方をすること：
    - この変化が起きたため、〇〇という選択肢は成立しなくなる
    - この政策・技術・社会変化によって、新しい役割が生まれる
    - 逆に、これまで成立していた職業・働き方が消滅する

    ※1シナリオにつき最大2つまで

    ⸻

    【STEP 2：「ありえない」が「現実」になる手順】

    各シナリオでは、必ず以下の3段階を描写すること：

    ① 環境変化による選択肢の変容（200文字）
    - 具体的に：従来の選択肢A、B、Cがどう変化したか
    - 例：新卒採用減少 → 新しい雇用形態の出現 → 職域の再定義
    - 「消滅」ではなく「変化」として描く

    ② 価値観の再解釈と適応（150文字）
    - 最初の戸惑いや違和感を明示
    - 何を手放し、何を再発見するのか
    - 例：「挑戦の意味を問い直す」「自由の形が変わる」

    ③ 新たな可能性と課題（100文字）
    - この選択によって得られる新しい視点
    - 同時に直面する現実的な課題
    - トレードオフを明確にする

    ⸻

    【STEP 3：シナリオのトーン】

    以下を厳守する。

    **必須要件：**
    - Future Drivers は、「選択肢の変容や新たな可能性を生む条件」として使用すること
    - 「なぜこの道が現実的になるのか」を、制度・市場・年齢・収入・資格などの構造的理由で説明すること
    - 価値観の再解釈や優先順位の変化が1箇所はっきり描写されていること
    - トレードオフ（何を得て、何を手放すのか）を明確にすること
    - 読後に「考えていなかったが、確かにあり得る」と感じさせることを最優先すること

    **禁止事項：**
    - 単なる理想的な成功物語
    - 単なるネガティブな破滅物語
    - 根拠のない楽観や悲観

    **読後にユーザーが感じるべき感情（最重要）：**
    - 「こんな未来は想像していなかった」という驚き
    - 「この論理なら確かに起こり得る」という納得
    - 視野の広がり
    - 新たな気づき
    - 「これも選択肢なのか」という発見
    - 適切な危機感と判断余地の両方
    
    ※驚きと納得が同時にあることが最も重要

    ⸻

    【STEP 4：Next Step（重要）】

    Next Step は **「この職業が本当に現実か確かめる行動」** にすること。

    必ず以下を満たす。
    - 1週間以内
    - 30分以内
    - Yes / No で完了判定できる
    - 訪問や取材ではなく、ネット検索・資料確認レベル

    例：
    - 「〇〇会社の採用ページで△△職種があるか確認」
    - 「国交省のガイドラインを30分読む」
    - 「Indeed で□□の求人数を調べる」

    ⸻

    【出力形式】

    以下の形式で、前置き説明やコードブロック（\`\`\`）なしで出力してください：

    【USER_INTERPRETATION】
    価値観：
    - 価値観1
    - 価値観2
    - 価値観3
    排除している選択：（1文）
    恐れている未来：（1文）
    暗黙の思い込み：（1文）

    【SCENARIO_1】
    新たな視点：（1文）
    この人生を成立させた外部要因：
    - Driver 1：（具体的な変化・法制度・技術変化として）
    - Driver 2：（具体的な変化・法制度・技術変化として）
    役割：（1文）

    本文：（500〜600文字）

    【重要：出力形式の厳守】
    - ①②③などの番号付き構造、見出し、箇条書き、Markdown記法（**, ##, ---, 等）を一切使わないこと
    - 「本文：」の直後から、改行を含む自然な地の文として1つの連続したテキストを書くこと
    - 段落タイトルや見出し風の行を作らず、普通の文章として記述すること
    - 必ず300文字以上の連続した文章にすること
    - 強調記号や装飾は使用しないこと

    内容の構造（番号や見出しを付けず地の文で描く）：
    - 環境変化により従来の選択肢がどう変容したか（200文字程度）
    - 価値観の再解釈と適応、戸惑いや発見（150文字程度）
    - 新たな可能性と課題、トレードオフ（100文字程度）

    なぜこの道が現実的か：（150〜200文字。因果の連鎖を明示）
    NextStep：（この選択肢の実在性を確認する行動・30分以内・ネット検索レベル）

    【SCENARIO_2】
    新たな視点：
    この人生を成立させた外部要因：
    - 
    - 
    役割：

    本文：（500〜600文字。形式は上記と同じ：番号・見出し・記号なしの地の文）

    なぜこの道が現実的か：
    NextStep：

    【SCENARIO_3】
    新たな視点：
    この人生を成立させた外部要因：
    - 
    - 
    役割：

    本文：（500〜600文字。形式は上記と同じ：番号・見出し・記号なしの地の文）

    なぜこの道が現実的か：
    NextStep：
    `;

    console.log(`[${requestId}] Step 3: Calling Claude API with retry logic`);
    
    // リトライロジック（最大3回試行：初回 + 2回リトライ）
    let response;
    let lastError;
    const maxRetries = 2;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const waitTime = attempt === 1 ? 500 : 1500;
          console.log(`[${requestId}] Retry attempt ${attempt}, waiting ${waitTime}ms`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-5',
            max_tokens: 8000,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ]
          })
        });
        
        // 5xxエラーの場合はリトライ、4xxはリトライしない
        if (response.ok || (response.status >= 400 && response.status < 500)) {
          break;
        }
        
        lastError = `HTTP ${response.status}`;
        console.log(`[${requestId}] Attempt ${attempt + 1} failed with status ${response.status}`);
        
        if (attempt === maxRetries) {
          const error = await response.text();
          console.log(`[${requestId}] Claude API error after all retries:`, error);
          return Response.json({ 
            requestId,
            ok: false,
            stage: 'claude_api_retry',
            error: `Claude API error after ${maxRetries + 1} attempts: ${error}`,
            statusCode: response.status
          }, { status: 500 });
        }
      } catch (error) {
        lastError = error.message;
        console.log(`[${requestId}] Attempt ${attempt + 1} failed with error:`, error.message);
        
        if (attempt === maxRetries) {
          return Response.json({ 
            requestId,
            ok: false,
            stage: 'network_error',
            error: `Network error after ${maxRetries + 1} attempts: ${error.message}`
          }, { status: 500 });
        }
      }
    }

    console.log(`[${requestId}] Step 4: Checking Claude API response status:`, response.status);
    if (!response.ok) {
      const error = await response.text();
      console.log(`[${requestId}] Claude API error:`, error);
      return Response.json({ 
        requestId,
        ok: false,
        stage: 'claude_api',
        error: `Claude API error: ${error}`,
        statusCode: response.status
      }, { status: 500 });
    }

    console.log(`[${requestId}] Step 5: Parsing Claude API response`);
    const data = await response.json();
    console.log(`[${requestId}] Claude response received, content length:`, data.content?.[0]?.text?.length);
    let content = data.content[0].text;
    
    console.log(`[${requestId}] Step 6: Parsing plain text response with robust regex`);
    
    // パースを2回まで試行（初回が失敗したら再生成）
    let scenarioBlocks = [];
    let parseAttempts = 0;
    const maxParseAttempts = 2;
    
    while (parseAttempts < maxParseAttempts && scenarioBlocks.length < 3) {
      parseAttempts++;
      
      if (parseAttempts > 1) {
        console.log(`[${requestId}] Parse attempt ${parseAttempts}: retrying scenario generation`);
        
        // 再生成
        const retryResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-5',
            max_tokens: 8000,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ]
          })
        });
        
        if (!retryResponse.ok) {
          console.log(`[${requestId}] Retry generation failed with status:`, retryResponse.status);
          break;
        }
        
        const retryData = await retryResponse.json();
        content = retryData.content[0].text;
      }
      
      // 頑健なパース：全角数字、空白揺れも許容
      const parts = content.split(/【SCENARIO[ _]?([0-9０-９]+)】/);
      scenarioBlocks = [];

      // parts[0]はUSER_INTERPRETATION、parts[1]以降が「1」「本文」「2」「本文」...
      for (let i = 1; i < parts.length; i += 2) {
        if (parts[i + 1]) {
          scenarioBlocks.push(parts[i + 1].trim());
        }
      }

      console.log(`[${requestId}] Parse attempt ${parseAttempts}: parsed ${scenarioBlocks.length} scenarios`);
    }

    if (scenarioBlocks.length < 3) {
      console.log(`[${requestId}] Warning: Parsed only ${scenarioBlocks.length} scenarios`);
      // 500で落とさず、200でClaudeの生テキストを返す（デバッグ用）
      return Response.json({ 
        requestId,
        ok: false,
        stage: 'parsing',
        error: `パース失敗：${scenarioBlocks.length}個のシナリオのみ検出`, 
        errorType: 'PARSE_ERROR',
        parsedCount: scenarioBlocks.length,
        rawContent: content,
        hint: 'Claudeの出力形式を確認してください'
      }, { status: 200 });
    }
    
    const scenarios = scenarioBlocks.map((block, index) => {
            const lines = block.split('\n');
            const scenario = {
              scenario_type: ['realistic', 'growth', 'risk'][index],
              scenario_title: '',
              role_definition: '',
              scenario_description: '',
              reasoning: '',
              evidence: [],
              next_step_recommendation: '',
              key_opportunities: [],
              required_skills: [],
              action_plan: [],
              probability_level: 'medium',
              positivity_score: 0,
              change_magnitude: 50
            };

            let currentField = '';
            let currentText = '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;

              // マークダウン記号を除去: **, #, 前後の空白
              const cleanTrimmed = trimmed
                .replace(/^[#\s]+/, '')
                .replace(/^\*\*/, '')
                .replace(/\*\*[:：]?$/, '')
                .replace(/[:：]\s*\*\*$/, '')
                .trim();

              if (/^新たな視点\s*[:：]/.test(cleanTrimmed)) {
                const value = cleanTrimmed.replace(/^新たな視点\s*[:：]/, '').trim();
                if (value) {
                  scenario.scenario_title = value;
                  currentField = '';
                } else {
                  currentField = 'title';
                  currentText = '';
                }

              } else if (/^この人生を成立させた外部要因\s*[:：]/.test(cleanTrimmed)) {
                if (currentField === 'title' && currentText) {
                  scenario.scenario_title = currentText.trim();
                }
                currentField = 'evidence';
                currentText = '';

              } else if (/^役割\s*[:：]/.test(cleanTrimmed)) {
                if (currentField === 'title' && currentText) {
                  scenario.scenario_title = currentText.trim();
                } else if (currentField === 'evidence' && currentText) {
                  scenario.evidence.push(currentText.trim());
                }
                const value = cleanTrimmed.replace(/^役割\s*[:：]/, '').trim();
                if (value) {
                  scenario.role_definition = value;
                  currentField = '';
                } else {
                  currentField = 'role';
                  currentText = '';
                }

              } else if (/^本文\s*[:：]/.test(cleanTrimmed)) {
                if (currentField === 'role' && currentText) {
                  scenario.role_definition = currentText.trim();
                }
                const value = cleanTrimmed.replace(/^本文\s*[:：]/, '').trim();
                currentField = 'description';
                currentText = value;

              } else if (/^なぜこの道が現実的か\s*[:：]/.test(cleanTrimmed)) {
                if (currentField === 'description' && currentText) {
                  scenario.scenario_description = currentText.trim();
                }
                const value = cleanTrimmed.replace(/^なぜこの道が現実的か\s*[:：]/, '').trim();
                currentField = 'reasoning';
                currentText = value;

              } else if (/^Next\s*Step\s*[:：]/i.test(cleanTrimmed) || /^NextStep\s*[:：]/i.test(cleanTrimmed)) {
                if (currentField === 'description' && currentText) {
                  scenario.scenario_description = currentText.trim();
                } else if (currentField === 'reasoning' && currentText) {
                  scenario.reasoning = currentText.trim();
                }
                const value = cleanTrimmed
                  .replace(/^Next\s*Step\s*[:：]/i, '')
                  .replace(/^NextStep\s*[:：]/i, '')
                  .trim();
                if (value) {
                  scenario.next_step_recommendation = value;
                } else {
                  currentField = 'nextstep';
                  currentText = '';
                }

              } else if (/^[•\-]\s+/.test(trimmed) && currentField === 'evidence') {
                const evidence = trimmed.replace(/^[•\-]\s+/, '').trim();
                scenario.evidence.push(evidence);

              } else if (currentField === 'title' || currentField === 'role' || currentField === 'nextstep') {
                currentText += (currentText ? ' ' : '') + trimmed;
              } else if (
                currentField &&
                !/^[-—⸻=]+$/.test(trimmed) &&
                !/^[①②③]/.test(trimmed) &&
                !/^#{1,3}\s*【/.test(trimmed)
              ) {
                currentText += (currentText ? ' ' : '') + trimmed;
              }
            }

  if (currentField === 'title' && currentText) {
    scenario.scenario_title = currentText.trim();
  }
  if (currentField === 'role' && currentText) {
    scenario.role_definition = currentText.trim();
  }
  if (currentField === 'description' && currentText) {
    scenario.scenario_description = currentText.trim();
  }
  if (currentField === 'reasoning' && currentText) {
    scenario.reasoning = currentText.trim();
  }
  if (currentField === 'nextstep' && currentText) {
    scenario.next_step_recommendation = currentText.trim();
  }

  if (scenario.scenario_type === 'realistic') scenario.positivity_score = 35;
  if (scenario.scenario_type === 'growth') {
    scenario.positivity_score = 60;
    scenario.change_magnitude = 80;
  }
  if (scenario.scenario_type === 'risk') {
    scenario.positivity_score = -10;
    scenario.change_magnitude = 70;
  }

  return scenario;
});

// デバッグ用：各シナリオのフィールド長を確認
console.log(`[${requestId}] Parsed scenarios field lengths:`);
scenarios.slice(0, 3).forEach((s, i) => {
  console.log(`  Scenario ${i + 1}: title=${s.scenario_title?.length || 0}, desc=${s.scenario_description?.length || 0}, reasoning=${s.reasoning?.length || 0}, next=${s.next_step_recommendation?.length || 0}`);
});

const essentialOk = scenarios.slice(0, 3).every(s =>
  (s.scenario_title && s.scenario_title.length > 0) &&
  (s.scenario_description && s.scenario_description.length > 50)
);

if (!essentialOk) {
  const emptyFields = scenarios.slice(0, 3).map((s, i) => {
    const missing = [];
    if (!s.scenario_title || s.scenario_title.length === 0) missing.push('title');
    if (!s.scenario_description || s.scenario_description.length < 50) missing.push('description');
    return `Scenario ${i + 1}: ${missing.join(', ') || 'OK'}`;
  });
  
  return Response.json({
    requestId,
    ok: false,
    stage: 'parsing',
    errorType: 'PARSE_EMPTY_FIELDS',
    error: 'シナリオの主要項目が空でした',
    emptyFields: emptyFields,
    rawContent: content
  }, { status: 200 });
}

const result = {
  requestId,
  ok: true,
  scenarios: scenarios.slice(0, 3)
};

return Response.json(result);return Response.json(result);
  } catch (error) {
    console.error(`[${requestId}] Function error:`, error);
    return Response.json({ 
      requestId,
      ok: false,
      stage: 'unexpected_error',
      error: error.message,
      stack: error.stack,
      details: String(error)
    }, { status: 500 });
  }
});