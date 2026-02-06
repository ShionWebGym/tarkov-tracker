'use client'

import { Navbar } from "@/components/navbar"
import { useLanguage } from "@/context/language-context"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ReleaseNote {
  date: string;
  version: string;
  features: string[];
  fixes: string[];
}

const releaseNotes: ReleaseNote[] = [
  {
    date: "2026.02.06",
    version: "v1.1.0",
    features: [
      "Added Release Notes page",
      "Implemented Hideout cascading checks",
      "Overhauled mobile navigation",
    ],
    fixes: [
      "Fixed item count logic for Wires",
      "Fixed data inconsistency between pages",
      "Fixed mobile layout overflow issues",
    ],
  },
  {
    date: "2024.01.20",
    version: "v1.0.0",
    features: [
      "Initial Release",
      "Dashboard with item tracking",
      "Task list tracking",
      "Hideout station tracking",
    ],
    fixes: [],
  }
];

export default function ReleaseNotesPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useLanguage()

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Navbar />
      <main className="container mx-auto max-w-3xl py-8 px-4 sm:px-6 space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Release Notes</h1>
            <p className="text-muted-foreground">
                Stay up to date with the latest changes and improvements.
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
                            {note.features.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                        <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Feature</Badge>
                                    </h4>
                                    <ul className="list-disc list-outside ml-4 text-sm text-muted-foreground space-y-1">
                                        {note.features.map((feat, i) => (
                                            <li key={i}>{feat}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {note.fixes.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                        <Badge variant="destructive">Fix</Badge>
                                    </h4>
                                    <ul className="list-disc list-outside ml-4 text-sm text-muted-foreground space-y-1">
                                        {note.fixes.map((fix, i) => (
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
