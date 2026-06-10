import { Client, Project, Template, TeamMember, WikiArticle } from '../types';

export const mockClients: Client[] = [
  {
    id: 'c1',
    name: 'ツバサ education アカデミー様',
    representative: '翼 翔太',
    email: 'contact@tsubasa-academy.test',
    industry: '教育・受験コンサル',
    phone: '03-1234-5678',
    createdAt: '2026-05-10',
    notes: '個別カウンセリング成約率にこだわりあり。プレミアムコース訴求用に動画特典。'
  },
  {
    id: 'c2',
    name: '木漏れ日ヨガスタジオ様',
    representative: '山田 優佳',
    email: 'info@komorebi-yoga.test',
    industry: '店舗・ヘルスケア',
    phone: '045-987-6543',
    createdAt: '2026-05-20',
    notes: 'アコースティックで落ち着いたイメージ。LINE友だち追加による予約動線を徹底。'
  },
  {
    id: 'c3',
    name: 'フロンティアコンサルのプロ様',
    representative: '前田 健吾',
    email: 'support@frontier-pro.test',
    industry: 'B2Bプロコンサル',
    phone: '06-4321-8765',
    createdAt: '2026-05-01',
    notes: '決済の仕組みとして、分割払いStripe登録を完備させたい。'
  },
  {
    id: 'c4',
    name: '和風ハーブティー工房様',
    representative: '鈴木 雅巳',
    email: 'office@jp-herbtea.test',
    industry: 'EC・物販',
    phone: '050-1111-2222',
    createdAt: '2026-04-10',
    notes: '定期お届けプラン訴求。小冊子をプレゼントとして同梱して発送する。'
  },
  {
    id: 'c5',
    name: 'ネクストステージ英語教室様',
    representative: 'マイケル・ジャクソン',
    email: 'hello@nextstage-english.test',
    industry: '語学スクール',
    phone: '03-5555-6666',
    createdAt: '2026-05-02',
    notes: '会員サイト of ツバサ user requirements.'
  }
];

export const mockTemplates: Template[] = [
  {
    id: 't1',
    name: '【UTAGE標準】個別相談獲得ファネル',
    category: '個別相談ファネル',
    description: '無料動画コンテンツやPDFをフックにオプトインさせ、サンクスページ等から個別カウンセリング、個別説明会（Zoom等）へ誘導する王道ファネル。',
    stepsCount: 4,
    steps: ['1. オプトインLP', '2. 特典送付・価値教育メール', '3. 個別相談申込ページ', '4. 予約完了サンクスページ'],
    assignee: '佐藤 広務',
    expectedDuration: '3週間',
    requiredPlan: 'Starter'
  },
  {
    id: 't2',
    name: '【セミナー・説明会】2ステップ決済ファネル',
    category: 'セミナー集客ファネル',
    description: '有料オンラインセミナー予約と同時にクレジットカード決済 (Stripe) を完了させ、自動でZoomリンクと確認メールを配信するファネル。',
    stepsCount: 3,
    steps: ['1. セミナー募集ページ', '2. Stripe決済完了ページ', '3. 参加証・Zoomリンク案内メール'],
    assignee: '佐藤 広務',
    expectedDuration: '2週間',
    requiredPlan: 'Pro'
  },
  {
    id: 't3',
    name: '【成果保障】エバーグリーン・ウェビナー自動化ファネル',
    category: 'オンラインコンテンツ販売ファネル',
    description: '登録日時に合わせ擬似リアルタイムウェビナーを自動開催。一定時間経過後に特別オファーをポップアップ、クレカ決済へ誘導する最先端自動構築モデル。',
    stepsCount: 5,
    steps: ['1. ウェビナー登録LP', '2. 自動LIVE待機室', '3. 擬似オンデマンド・配信室', '4. 期間限定決済ページ', '5. 受講生会員マイページ'],
    assignee: '鈴木 雅治',
    expectedDuration: '4週間',
    requiredPlan: 'Platinum'
  },
  {
    id: 't4',
    name: '【サブスク高単価】会員制オンラインサロン・継続入会ファネル',
    category: '自社プロダクト販売ファネル',
    description: '独自ブランドサロンや定額コミュニティへ特化したファネル。Stripe Connectを統合し分割回数制限や自動与信再試行を設定し、未払い損失を極少化します。',
    stepsCount: 4,
    steps: ['1. サロン価値体験型レターLP', '2. LINE経由クローズド申込案内', '3. Stripeサブスク定期決済', '4. 決済完了後自動メール（初回ログインキー）'],
    assignee: '田中 美咲',
    expectedDuration: '3週間',
    requiredPlan: 'Platinum'
  }
];

export const mockProjects: Project[] = [
  {
    id: 'p1',
    clientId: 'c1',
    clientName: 'ツバサ教育アカデミー様',
    funnelType: '個別相談ファネル',
    progress: 35,
    status: '原稿執筆中',
    startDate: '2026-05-10',
    targetDate: '2026-06-25',
    description: '「オンライン大学受験合格プログラム」の個別カウンセリング（Zoom）に誘導し、高単価プレミアムコースを成約するためのファネル。',
    revenue: '450,000円',
    funnelSteps: [
      { id: 'p1-1', name: 'オプトインLP制作（ラフ・素材）', status: '完了', assignee: '佐藤 広務', targetDate: '2026-05-18' },
      { id: 'p1-2', name: '特典PDF用スライド原稿執筆', status: '制作中', assignee: '田中 美咲', targetDate: '2026-06-12' },
      { id: 'p1-3', name: '個別カウンセリング申込フォーム（UTAGEフォーム）', status: '未着手', assignee: '佐藤 広務', targetDate: '2026-06-18' },
      { id: 'p1-4', name: 'LINE/メール連動ステップ配信設計（5配信分）', status: '未着手', assignee: '鈴木 雅治', targetDate: '2026-06-21' },
      { id: 'p1-5', name: 'リマインド設定＆サンクスページ', status: '未着手', assignee: '田中 美咲', targetDate: '2026-06-25' }
    ],
    notes: 'メイン講師の動画撮影が6月15日に確定。それまでに原稿をFixさせる。',
    historyLogs: [
      { id: 'h1-1', timestamp: '2026-05-10 10:15', category: 'update_log', author: 'システム管理者', content: 'プロジェクトを初期登録し、ファネルステップのひな形を設定しました。' },
      { id: 'h1-2', timestamp: '2026-05-12 14:00', category: 'client_request', author: '代表 翼様', content: '「ターゲット層に仕事を持つ保護者層も含まれるため、LPの後半に信頼性データと推薦文のエリアを設けてほしい」とのご要望。' },
      { id: 'h1-3', timestamp: '2026-05-18 16:30', category: 'meeting_note', author: '佐藤 広務', content: 'オプトインLPの構成決定会議。合格実績グラフをファーストビュー直後に置く方向でクライアント提案し、合意を頂きました。' }
    ]
  },
  {
    id: 'p2',
    clientId: 'c3',
    clientName: 'フロンティアコンサルのプロ様',
    funnelType: 'セミナー集客ファネル',
    progress: 75,
    status: 'UTAGE実装中',
    startDate: '2026-05-01',
    targetDate: '2026-06-15',
    description: '「年商2000万突破 起業塾」向けオンライン体験セミナー集客ファネル。アンケート回答者への限定配布特典を自動案内。',
    revenue: '600,000円',
    funnelSteps: [
      { id: 'p2-1', name: 'セミナー集客LPデザイン・コーディング', status: '完了', assignee: '鈴木 雅治', targetDate: '2026-05-12' },
      { id: 'p2-2', name: '当日セミナー用Zoom構築・アンケートフォーム', status: '完了', assignee: '高橋 健一', targetDate: '2026-05-20' },
      { id: 'p2-3', name: 'UTAGE決済連携設定（Stripe連携）', status: '完了', assignee: '佐藤 広務', targetDate: '2026-05-28' },
      { id: 'p2-4', name: 'リマインド／フォローアップステップ配信構築', status: '制作中', assignee: '鈴木 雅治', targetDate: '2026-06-10' },
      { id: 'p2-5', name: 'UTAGE独自ドメイン・SSLテスト・通し動作確認', status: '未着手', assignee: '高橋 健一', targetDate: '2026-06-15' }
    ],
    notes: 'Stripeのテスト決済は成功。LINE公式のAPI連携 and Webhook設定に進む。',
    historyLogs: [
      { id: 'h2-1', timestamp: '2026-05-01 09:30', category: 'update_log', author: 'システム管理者', content: 'プロジェクト「セミナー集客ファネル」を開始しました。' },
      { id: 'h2-2', timestamp: '2026-05-15 11:20', category: 'client_request', author: '高橋 健一', content: '決済代行はStripeのほか、銀行振込用の案内メッセージもサンクスページに併記したいと、顧客より要望メールを受領。' },
      { id: 'h2-3', timestamp: '2026-05-28 15:45', category: 'meeting_note', author: '佐藤 広務', content: 'Stripe連携実機テスト合格。決済直後のタグ自動付与とリマインドLINEの連動起動が正常動作することを確認しました。' }
    ]
  },
  {
    id: 'p3',
    clientId: 'c2',
    clientName: '木漏れ日ヨガスタジオ様',
    funnelType: '無料プレゼント配布ファネル',
    progress: 90,
    status: 'クライアント確認中',
    startDate: '2026-05-20',
    targetDate: '2026-06-10',
    description: '「骨盤ストレッチ解説動画」を無料配付し、LINE登録から地域密着ヨガスクールの体験レッスンに誘致するファネル。',
    revenue: '300,000円',
    funnelSteps: [
      { id: 'p3-1', name: '動画視聴LP（UTAGEページ作成機能）', status: '完了', assignee: '田中 美咲', targetDate: '2026-05-24' },
      { id: 'p3-2', name: '友だち追加時自動応答＆クーポン発行', status: '完了', assignee: '田中 美咲', targetDate: '2026-05-28' },
      { id: 'p3-3', name: '動画視聴サンクスページ構築', status: '完了', assignee: '鈴木 雅治', targetDate: '2026-06-01' },
      { id: 'p3-4', name: '体験レッスン自動フォーム予約連携', status: '完了', assignee: '鈴木 雅治', targetDate: '2026-06-05' },
      { id: 'p3-5', name: 'クライアント様全体動作および文章の最終確認', status: '確認中', assignee: '高橋 健一', targetDate: '2026-06-10' }
    ],
    notes: 'スマホ実機でのLINE登録・動画快適再生テストは良好。クライアントの最終チェック待ち。',
    historyLogs: [
      { id: 'h3-1', timestamp: '2026-05-20 13:00', category: 'update_log', author: 'システム管理者', content: 'プレゼント配布型ファネル構築プロジェクトがキックオフされました。' },
      { id: 'h3-3', timestamp: '2026-06-01 10:00', category: 'client_request', author: '代表 佐々木様', content: '「自動返信メッセージのトーン＆マナーについて、親しみやすさを最重視して少しフランクな絵文字入りに変更してほしい」とのご相談。文章をすべて改訂反映しました。' }
    ]
  },
  {
    id: 'p4',
    clientId: 'c5',
    clientName: 'ネクストステージ英語教室様',
    funnelType: 'オンラインコンテンツ販売ファネル',
    progress: 15,
    status: '原稿執筆中',
    startDate: '2026-06-01',
    targetDate: '2026-07-20',
    description: '「TOEIC850突破の短期集中ビデオ講義」の販売パッケージ。UTAGEの「会員サイト機能」を活用した教材受講サイトの同時構築。',
    revenue: '850,000円',
    funnelSteps: [
      { id: 'p4-1', name: 'セールスレターLP原稿決定', status: '未着手', assignee: '佐藤 広務', targetDate: '2026-06-15' },
      { id: 'p4-2', name: 'UTAGE会員サイト（メンバーシップ）メニュー構成作成', status: '未着手', assignee: '高橋 健一', targetDate: '2026-07-02' },
      { id: 'p4-3', name: '動画コンテンツアップロード（UTAGEメディア管理）', status: '制作中', assignee: '鈴木 雅治', targetDate: '2026-07-08' },
      { id: 'p4-4', name: '段階的（ドリップ）公開スケジュール設定', status: '未着手', assignee: '鈴木 雅治', targetDate: '2026-07-12' },
      { id: 'p4-5', name: '購入時オートタグ追加・購入後メール自動化設定', status: '未着手', assignee: '佐藤 広務', targetDate: '2026-07-20' }
    ],
    notes: 'UTAGEの会員サイトはパスワードレスやログインセキュリティが非常に優秀なので、そこに動画教材24講義を配置していく。',
    historyLogs: [
      { id: 'h4-1', timestamp: '2026-06-01 11:00', category: 'update_log', author: '鈴木 雅治', content: '英語教室様の会員制サイト兼ドリップ販売ファネルの新規要件を初期インプットしました。' }
    ]
  },
  {
    id: 'p5',
    clientId: 'c4',
    clientName: '和風ハーブティー工房様',
    funnelType: '無料プレゼント配布ファネル',
    progress: 100,
    status: '本番稼働中',
    startDate: '2026-04-10',
    targetDate: '2026-05-15',
    description: '「美味しいお茶の淹れ方小冊子」無料お届け請求ファネル。リスト登録後に定期購入（サブスクリプション）をオファリング。',
    revenue: '380,000円',
    funnelSteps: [
      { id: 'p5-1', name: '小冊子プレゼント応募LP', status: '完了', assignee: '田中 美咲', targetDate: '2026-04-15' },
      { id: 'p5-2', name: '応募サンクスページ（直後アップセル提案）', status: '完了', assignee: '鈴木 雅治', targetDate: '2026-04-22' },
      { id: 'p5-3', name: 'クレカ定期決済フォーム設定', status: '完了', assignee: '佐藤 広務', targetDate: '2026-04-30' },
      { id: 'p5-4', name: '商品発送管理タグ連動', status: '完了', assignee: '鈴木 雅治', targetDate: '2026-05-08' },
      { id: 'p5-5', name: '自動フォローアップLINE（計7回）', status: '完了', assignee: '田中 美咲', targetDate: '2026-05-15' }
    ],
    notes: '現在稼働中。登録数250件/月、アップセル転換率18%と好調に推移中。',
    historyLogs: [
      { id: 'h5-1', timestamp: '2026-04-10 10:00', category: 'update_log', author: '田中 美咲', content: '無事初期LPセットアップを開始。' },
      { id: 'h5-2', timestamp: '2026-05-15 18:00', category: 'update_log', author: 'システム管理者', content: 'ドメイン紐づけ完了の上、一般広告配信用に本番リリースを行いました。' }
    ]
  }
];

export const mockWikiArticles: WikiArticle[] = [
  {
    id: 'w1',
    title: 'LINE公式友だち登録直後にステップ配信がトリガーされない場合の診断レシピ',
    category: 'LINE・配信',
    excerpt: 'Webhook疎通確認からWebhook URLスラッシュ有無、UTAGE側アクションタグの付与遅延まで、原因特定フローを徹底詳解します。',
    content: '### トラブルシューティング：LINEシナリオ配信が開始されない場合\n\n新規ユーザーがLINE公式アカウントに友だち追加（オプトイン）されたにもかかわらず、用意したUTAGEシナリオ（ステップ配信）が即座に起動しない場合、以下のチェックフローを実行してください。\n\n1. **Webhook URLの記述末尾スラッシュの確認**\n   LINE DevelopersのWebhook URL設定において、末尾に余分な `/` が含まれていないか、また `https://` が重複して登録されていないか確認します。記述を違えると相互のハンドシェイクに失敗します。\n\n2. **ボットのグループ参加許可をチェック**\n   LINE公式アカウントの応答設定（LINE Official Account Manager）の配下に「Webhook」設定があります、これが「有効」になっていることを再確認してください。これが「無効」の場合、LINEサーバーはUTAGE側にイベントを一切リレーしなくなります。\n\n3. **UTAGE側アクション定義のバインド不整合**\n   UTAGE側の友だち追加時アクション設定で、「追加シナリオ」が適正にアサインされているか。タグが正しく追加されるにもかかわらず配信されないケースでは、シナリオのトリガー条件（自動返信）が「即時」ではなく「1分後(内部キュー待機)」になっており数秒のタイムラグが生じているだけというケースが多く見られます。',
    author: 'システム監修: 中村',
    publishedAt: '2026-05-18',
    requiredPlan: 'Starter',
    viewsCount: 145
  },
  {
    id: 'w2',
    title: 'Stripe定期決済のカード期限切れ・滞納時に最大回収率を誇る「リトライ＆自動タグ自動化」設計マニュアル',
    category: 'Stripe決済',
    excerpt: '毎月の未回収・デクラインによる損失を最小化するため、Smart Retriesと、UTAGE側アクセス権ロックの連動タグ付けレシピを公開。',
    content: '### Stripe定期課金の自動フォローアップ構築（損失・離脱ブロック）\n\n月額サブスクリプション(塾・サロン等)において、クレジットカードの限度額オーバーや期限切れによる決済エラー（デクライン）は、全取引の5~9%の頻度で発生します。この「サイレントチャーン(静かな離脱)」を防ぐための高度な連動自動化レシピです。\n\n#### ❶ Stripe Dashboard側：Smart Retries(スマートリトライ)の適用\n- Stripeが持つ機械学習技術を駆使し、顧客アカウントの所在国や曜日、過去の傾向等から「最も回収確率の高い時間帯」に自動で最大4回まで再チャージを試みます（間隔を空けることが重要）。\n\n#### ❷ Webhook連動：支払い失敗による権限自動剥奪プロセス\n- **トリガーイベント:** Stripeの `invoice.payment_failed` または `customer.subscription.deleted` を検知。\n- **UTAGEタグ連動アクション:** 「購入済（アクセス許可）」タグを即座に剥奪し、「決済エラー待機」タグを自動アサインします。\n- **自動配信トリガー:** 「決済エラー待機」タグが付随した瞬間、LINE公式と紐づく専用復旧リンク（Stripe Customer Portalへの誘導）を記載した自動リマインドステップ（全3通：1日後、3日後、7日後）を送出し、再登録フォームへのユーザーアクションを極めて自然に促すことができます。',
    author: '決済連携マネージャー: 翼',
    publishedAt: '2026-05-25',
    requiredPlan: 'Pro',
    viewsCount: 322
  },
  {
    id: 'w3',
    title: '【高単価オンラインサロン】継続入会率（リテンション）を2倍化する「ドリップ（段階的）コンテンツ配置」の黄金律',
    category: 'ファネル設計',
    excerpt: '入会直後に大量の教材を渡すとユーザーは認知負荷を抱えて即脱退します。30日単位でコンテンツを徐々に解放する「ドリップ配信」のUTAGE設定法。',
    content: '### 継続加入率を最高化するUTAGEメンバーシップ設計マニュアル\n\n生徒が入塾・入会した直後にすべての動画、課題、過去アーカイブ、リソースへのフリーリンクを開放することは、一見良質なサポートに見えますがマーケティング心理的には**致命的な敗因**となります（認知的過負荷、早期お腹いっぱいによる即月脱退）。\n\nこれを回避するのが、UTAGEの「会員サイト(メンバーシップ)ドリップ公開」機能です。\n\n#### 【段階解放のスケジュール黄金比】\n- **1日目 (登録直後):** オンボーディング動画（ロードマップ、操作法、自己紹介提出シート等）のみ解放。他のフォルダは「近日解放」マーク。\n- **7日目 (第2週):** 第1章（基礎知識・即金モデルの解説）を自動解放＆LINEで「新しい特典が解放されました」と一斉配信。\n- **14日目 (第3週):** 第2章（マスタリング実践）＋課題提出フォームへの連携。\n- **30日目 (第2ヶ月目突入後):** 2回目決済確定と共に、中級者・応用特典アーカイブへのアクセス特権を自動解放。\n\n#### 【UTAGE管理画面での設定】\n会員サイト各モジュールに「公開条件: 会員登録日から◯日後」というチェックをオンにして定数を割り当てるだけで、LINEおよびメール配信と全く完全に同期したオンタイム自動化が達成できます。これによって入会2ヶ月目のリテンションは平均して73%以上向上することが実証されています。',
    author: 'ファネルデザイナー: 佐藤',
    publishedAt: '2026-06-02',
    requiredPlan: 'Platinum',
    viewsCount: 512
  },
  {
    id: 'w4',
    title: 'Gemini AIをプロンプトインジェクションして最新「競合ファネルのセールスコピー」を1秒で徹底診断・リバースエンジニアリングする究極技法',
    category: 'AI活用',
    excerpt: '競合LPをコピペ入力するだけで、その裏にある顧客ターゲットの「深層痛点、ベネフィット、反論処理マトリクス」を自動で解剖・逆プロンプト設計。',
    content: '### 超加速リサーチ：Geminiモデルを用いたリバースマーケティングプロンプト\n\nAI Studioで稼働するGemini APIの巨大なトークンコンテキストと分析能力を活用し、競合他社や成功事例のLP（ランディングページ）を丸ごとテキスト抽出して入力するだけで、そのファネルが採用しているコピーライティング構成とセールス心理を解剖させ、独自の最強構成案を出力させるプロンプトです。\n\n#### 【AIプロンプトテンプレート】\n```\nあなたはトップレベルのファネルプランナーおよびUTAGE集客の達人です。\n以下に入力する他社LPの構成を、徹底的に機能分解（リバースエンジニアリング）してください。\n以下の項目を論理的に明らかにしてください。\n1. 訪問者の【最深部にある隠された恐怖、痛み、不満】は何と想定し、それをどのように刺激しているか？\n2. 【ベネフィット(感情変化)・フック】の提示順序\n3. 顧客が必ず抱く「価格・再現性・時間制限」に対する【反論処理】がコピーのどこにどのテクニックで仕込まれているか？\n4. このLPからオプトインされるべきUTAGE顧客の理想タグ・アトリビューションを定義すること。\n```\n\n#### 【実践と応用】\nこの診断結果をテンプレート化し、クライアント向け「提案書・設計規定書」として1ボタンでエクスポートできるようにすることで、デザイン・原稿制作にかかるリサーチ期間をこれまでの平均「3日間」から「わずか5分間」へ圧縮することが可能です。',
    author: 'AI Studio統合統括: 佐藤',
    publishedAt: '2026-06-05',
    requiredPlan: 'Platinum',
    viewsCount: 689
  }
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'm1',
    name: '佐藤 広務',
    email: 'hiromu.sato@dots-direction.test',
    role: '管理者',
    joinedAt: '2025-04-10',
    googleConnected: true,
  },
  {
    id: 'm2',
    name: '田中 美咲',
    email: 'misaki.tanaka@dots-direction.test',
    role: '開発者',
    joinedAt: '2025-06-15',
    googleConnected: true,
  },
  {
    id: 'm3',
    name: '鈴木 雅治',
    email: 'masaharu.suzuki@dots-direction.test',
    role: '開発者',
    joinedAt: '2025-09-01',
    googleConnected: true,
  },
  {
    id: 'm4',
    name: '高橋 健一',
    email: 'kenichi.takahashi@dots-direction.test',
    role: 'メンバー',
    joinedAt: '2026-02-15',
    googleConnected: false,
  }
];
