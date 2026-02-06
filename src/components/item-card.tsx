import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AggregatedItem } from "@/hooks/use-tarkov-data"
import Image from "next/image"
import Link from "next/link"
import { Pin } from "lucide-react"
import { cn } from "@/lib/utils"

interface ItemCardProps {
  item: AggregatedItem;
  isPinned?: boolean;
  onPinToggle?: () => void;
}

export function ItemCard({ item, isPinned, onPinToggle }: ItemCardProps) {
  return (
    <Card className={cn(
        "h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card/50 backdrop-blur-sm relative group",
        isPinned ? "border-blue-500 border-2" : "hover:border-primary/50"
    )}>
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPinToggle?.();
            }}
            className={cn(
                "absolute top-2 left-2 z-20 p-1.5 rounded-full transition-all duration-200",
                isPinned
                    ? "bg-blue-500 text-white hover:bg-blue-600 opacity-100 shadow-sm"
                    : "bg-muted/80 text-muted-foreground hover:bg-primary hover:text-primary-foreground opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0"
            )}
            title={isPinned ? "Unpin item" : "Pin item"}
        >
            <Pin className="w-3.5 h-3.5" fill={isPinned ? "currentColor" : "none"} />
        </button>

        <Link href={`/items/${item.id}`} className="block h-full">
            <div className="relative p-4 flex flex-col items-center h-full">
                <div className="absolute top-2 right-2 z-10">
                    <Badge variant="secondary" className="font-mono text-xs font-bold bg-secondary/80 backdrop-blur-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        x{item.totalCount}
                    </Badge>
                </div>

                <div className="relative w-full aspect-square mb-4 p-4 flex items-center justify-center bg-gradient-to-br from-muted/50 to-transparent rounded-lg group-hover:from-primary/5 transition-colors">
                {item.item.image512pxLink ? (
                    <Image
                        src={item.item.image512pxLink}
                        alt={item.item.name}
                        fill
                        className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        No Image
                    </div>
                )}
                </div>

                <div className="text-center mt-auto w-full">
                    <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors" title={item.item.name}>
                        {item.item.name}
                    </h3>
                </div>
            </div>
        </Link>
    </Card>
  )
}
