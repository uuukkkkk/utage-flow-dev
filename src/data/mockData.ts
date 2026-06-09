import { Client, Project, Template, TeamMember } from '../types';

export const mockClients: Client[] = [
  {
    id: 'c1',
    name: 'ツバサ教育アカデミー様',
    industry: 'オンライン受験指導・大学受験',
    representative: '翼 翔太',
    email: 'contact@tsubasa-academy.test',
    phone: '03-1234-5678',
    createdAt: '2026-01-15',
    notes: '毎週木曜日の午前10時に定例ミーティングあり。Zoomのリンクは固定。来季の広告予算増額を検討中。'
  },
  {
    id: 'c2',
    name: '木漏れ日ヨガスタジオ様',
    industry: '店舗・オンラインフィットネスヨガ',
    representative: '佐々木 明美',
    email: 'info@komorebi-yoga.test',
    phone: '090-9876-5432',
    createdAt: '2026-02-10',
    notes: 'LINE公式アカウントの配色のこだわりが強く、パステルグリーンがメイン色をご希望。マッサージ店とのコラボも企画中。'
  },
  {
    id: 'c3',
    name: 'フロンティアコンサルのプロ様',
    industry: '起業・経営コンサルティング',
    representative: '高橋 健一',
    email: 'takahashi@frontier-consult.test',
    phone: '06-4321-8765',
    createdAt: '2026-03-01',
    notes: '成果報酬型での契約。決済完了後の即時自動LINE返信の設定において、タグ連動が最重要要件。'
  },
  {
    id: 'c4',
    name: '和風ハーブティー工房様',
    industry: 'オーガニック食品・D2C物販',
    representative: '森川 小百合',
    email: 'support@wafuu-herb.test',
    phone: '050-1122-3344',
    createdAt: '2026-04-18',
    notes: '商品はすべて国内製造オーガニック。Stripeの明細書表記について念押しあり。'
  },
  {
    id: 'c5',
    name: 'ネクストステージ英語教室様',
    industry: '社会人向けオンライン英語コーチング',
    representative: '大塚 誠',
    email: 'otsuka@nextstage-english.test',
    phone: '03-5555-6666',
    createdAt: '2026-05-02',
    notes: '会員サイトの使いやすさを重視。スマートフォンでPDF教材が崩れないようにレスポンシブ配置を希望。'
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
    expectedDuration: '3週間'
  },
  {
    id: 't2',
    name: '【セミナー・説明会】2ステップ決済ファネル',
    category: 'セミナー集客ファネル',
    description: '有料／無料オンラインウェビナーへの集客から、サンクスページでのアンケート回収、リマインダーLINE配信、当日の説明会内での決済リンク誘導までを一貫する。',
    stepsCount: 5,
    steps: ['1. セミナー募集告知LP', '2. 参加特典・リマインド配信設定', '3. 詳細案内・Zoomリンク送信', '4. セミナー当日本番（決済説明）', '5. 決済完了・会員サイト自動案内'],
    assignee: '鈴木 雅治',
    expectedDuration: '4週間'
  },
  {
    id: 't3',
    name: '【自動ウェビナー】エバーグリーン・ローンチ',
    category: 'オンラインコンテンツ販売ファネル',
    description: 'UTAGEの最大強みである「時間連動型の自動ウェビナー」を活用し、見込み客が登録した瞬間からプログラムが連動して毎日決まった時間に価値教育・動画提供を行う超自動化ファネル。',
    stepsCount: 6,
    steps: ['1. ウェビナー登録予告LP', '2. 登録直後エバーグリーン開始', '3. 3日間価値教育動画（ステップ配信）', '4. オプション限定セールスページ', '5. 注文決済フォーム・タグ連動', '6. 購入者マイページ（会員サイト）'],
    assignee: '高橋 健一',
    expectedDuration: '6週間'
  },
  {
    id: 't4',
    name: '【リード獲得】無料eBookプレゼントファネル',
    category: '無料プレゼント配布ファネル',
    description: '有益な電子書籍や音声ファイルをダウンロードさせることでLINEやメールアドレス高確率に登録してもらい、次のステップへ教育をかける導入用ファネル。',
    stepsCount: 3,
    steps: ['1. ダウンロードLP', '2. サンクスページ（直後アンケート）', '3. 特典付きステップLINE開始'],
    assignee: '田中 美咲',
    expectedDuration: '2週間'
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
    revenue: '450,050円',
    funnelSteps: [
      { id: 'p1-1', name: 'オプトインLP制作（ラフ・素材）', status: '完了', assignee: '佐藤 広務', targetDate: '2026-05-18' },
      { id: 'p1-2', name: '特典PDF用スライド原稿執筆', status: '制作中', assignee: '田中 美咲', targetDate: '2026-06-12' },
      { id: 'p1-3', name: '個別カウンセリング申込フォーム（UTAGEフォーム）', status: '未着手', assignee: '佐藤 広務', targetDate: '2026-06-18' },
      { id: 'p1-4', name: 'LINE/メール連動ステップ配信設計（5配信分）', status: '未着手', assignee: '鈴木 雅治', targetDate: '2026-06-21' },
      { id: 'p1-5', name: 'リマインド設定＆サンクスページ', status: '未着手', assignee: '田中 美咲', targetDate: '2026-06-25' }
    ],
    notes: 'メイン講師の動画撮影が6月15日に確定。それまでに原稿をFixさせる。'
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
    notes: 'Stripeのテスト決済は成功。LINE公式のAPI連携 and Webhook設定に進む。'
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
    notes: 'スマホ実機でのLINE登録・動画快適再生テストは良好。クライアントの最終チェック待ち。'
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
    notes: 'UTAGEの会員サイトはパスワードレスやログインセキュリティが非常に優秀なので、そこに動画教材24講義を配置していく。'
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
    notes: '現在稼働中。登録数250件/月、アップセル転換率18%と好調に推移中。'
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

