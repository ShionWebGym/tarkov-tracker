'use client'

import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/context/language-context"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureItem {
  title: string;
  description: string[];
}

interface ReleaseNote {
  date: string;
  version: string;
  features: {
      en: FeatureItem[];
      ja: FeatureItem[];
  };
  fixes: {
      en: string[];
      ja: string[];
  };
}

const releaseNotes: ReleaseNote[] = [
  {
    date: "2026.02.06",
    version: "v1.1.0",
    features: {
        en: [
            {
                title: "Implemented real-time search functionality",
                description: [
                    "You can now instantly filter and find your desired items from the item list.",
                    "It supports both Japanese and English, so you'll get hits regardless of which language you input."
                ]
            },
            {
                title: "Item pinning feature",
                description: [
                    "You can now pin items that you want to prioritize collecting for tasks or your Hideout to the top of the list.",
                    "This is perfect for quickly checking items you need during a raid."
                ]
            },
            {
                title: "Added release notes",
                description: [
                    "You can now review past update contents and revision history within the site."
                ]
            }
        ],
        ja: [
            {
                title: "リアルタイム検索機能の実装",
                description: [
                    "アイテム一覧から目的のアイテムを即座に絞り込めるようになりました。",
                    "日本語・英語の両方に対応しており、どちらの言語で入力してもヒットします。"
                ]
            },
            {
                title: "アイテムのピン留め機能",
                description: [
                    "タスクや隠れ家（Hideout）で最優先に集めたいアイテムを一覧の上部に固定できるようになりました。",
                    "レイド中に必要なアイテムをひと目で確認するのに最適です。"
                ]
            },
            {
                title: "リリースノートの設置",
                description: [
                    "これまでのアップデート内容や修正履歴をサイト内で確認できるようになりました。"
                ]
            }
        ]
    },
    fixes: {
        en: [
            "Fixed item count logic for Wires",
            "Fixed data inconsistency between pages",
            "Fixed mobile layout overflow issues",
        ],
        ja: [
            "Wiresなどのアイテム必要数計算ロジックを修正",
            "ページ間のデータ不整合を修正",
            "モバイルレイアウトの表示崩れを修正",
        ]
    },
  },
  {
    date: "2026.01.26",
    version: "v1.0.0",
    features: {
        en: [
            { title: "Initial Release", description: [] },
            { title: "Dashboard with item tracking", description: [] },
            { title: "Task list tracking", description: [] },
            { title: "Hideout station tracking", description: [] },
        ],
        ja: [
            { title: "初回リリース", description: [] },
            { title: "アイテム追跡ダッシュボード", description: [] },
            { title: "タスク一覧追跡", description: [] },
            { title: "ハイドアウト施設追跡", description: [] },
        ]
    },
    fixes: {
        en: [],
        ja: []
    },
  }
];

export default function ReleaseNotesPage() {
  const { language } = useLanguage()

  const isJa = language === 'ja';

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Navbar />
      <main className="container mx-auto max-w-3xl py-8 px-4 sm:px-6 space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
                {isJa ? "リリースノート" : "Release Notes"}
            </h1>
            <p className="text-muted-foreground">
                {isJa
                    ? "最新の変更点や改善情報をお届けします。"
                    : "Stay up to date with the latest changes and improvements."
                }
            </p>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted-foreground/30 before:to-transparent">
            {releaseNotes.map((note, index) => (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                    {/* Icon/Dot */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-git-commit-vertical"><path d="M12 3v6"/><circle cx="12" cy="12" r="3"/><path d="M12 15v6"/></svg>
                    </div>

                    {/* Card */}
                    <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg font-bold">{note.version}</CardTitle>
                                <time className="text-sm text-muted-foreground font-mono">{note.date}</time>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {note.features[isJa ? 'ja' : 'en'].length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                        <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                                            {isJa ? "機能追加" : "Feature"}
                                        </Badge>
                                    </h4>
                                    <div className="space-y-4">
                                        {note.features[isJa ? 'ja' : 'en'].map((feat, i) => (
                                            <div key={i} className="space-y-1">
                                                <div className="font-medium text-sm leading-none flex items-start gap-2">
                                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                                    <span className="leading-5">{feat.title}</span>
                                                </div>
                                                {feat.description.length > 0 && (
                                                    <div className="pl-3.5 text-xs text-muted-foreground space-y-1">
                                                        {feat.description.map((desc, j) => (
                                                            <p key={j}>{desc}</p>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {note.fixes[isJa ? 'ja' : 'en'].length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                        <Badge variant="destructive">
                                            {isJa ? "修正" : "Fix"}
                                        </Badge>
                                    </h4>
                                    <ul className="list-disc list-outside ml-4 text-sm text-muted-foreground space-y-1">
                                        {note.fixes[isJa ? 'ja' : 'en'].map((fix, i) => (
                                            <li key={i}>{fix}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
      </main>
    </div>
  )
}
