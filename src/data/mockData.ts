import { Client, Project, Template, TeamMember } from '../types';

export const mockClients: Client[] = [
  {
    id: 'c1',
    name: 'ツバサ教育アカデミー様',
    email: 'contact@tsubasa-academy.test',
    industry: '教育・受験コンサル',
    phone: '03-1234-5678',
    createdAt: '2026-05-10',
    notes: '個別カウンセリング成約率にこだわりあり。プレミアムコース訴求用に動画特典。'
  },
  {
    id: 'c2',
    name: '木漏れ日ヨガスタジオ様',
    email: 'info@komorebi-yoga.test',
    industry: '店舗・ヘルスケア',
    phone: '045-987-6543',
    createdAt: '2026-05-20',
    notes: 'アコースティックで落ち着いたイメージ。LINE友だち追加による予約動線を徹底。'
  },
  {
    id: 'c3',
    name: 'フロンティアコンサルのプロ様',
    email: 'support@frontier-pro.test',
    industry: 'B2Bプロコンサル',
    phone: '06-4321-8765',
    createdAt: '2026-05-01',
    notes: '決済の仕組みとして、分割払いStripe登録を完備させたい。'
  },
  {
    id: 'c4',
    name: '和風ハーブティー工房様',
    email: 'office@jp-herbtea.test',
    industry: 'EC・物販',
    phone: '050-1111-2222',
    createdAt: '2026-04-10',
    notes: '定期お届けプラン訴求。小冊子をプレゼントとして同梱して発送する。'
  },
  {
    id: 'c5',
    name: 'ネクストステージ英語教室様',
    email: 'hello@nextstage-english.test',
    industry: '語学スクール',
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
    category: 'セミナー決済ファネル',
    description: '有料オンラインセミナー予約と同時にクレジットカード決済 (Stripe) を完了させ、自動でZoomリンクと確認メールを配信するファネル。',
    stepsCount: 3,
    steps: ['1. セミナー募集ページ', '2. Stripe決済完了ページ', '3. 参加証・Zoomリンク案内メール'],
    assignee: '佐藤 広務',
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
