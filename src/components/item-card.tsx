import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AggregatedItem } from "@/hooks/use-tarkov-data"
import Image from "next/image"
import Link from "next/link"
import { Pin } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ItemCardProps {
  item: AggregatedItem;
  isPinned?: boolean;
  onPinToggle?: () => void;
}

export function ItemCard({ item, isPinned, onPinToggle }: ItemCardProps) {
  return (
    <Link href={`/items/${item.id}`} className="block h-full group">
        <Card className={cn(
          "h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 bg-card/50 backdrop-blur-sm",
          isPinned && "border-blue-500 border-2"
        )}>
        <div className="relative p-4 flex flex-col items-center h-full">
            <div className="absolute top-2 left-2 z-20">
              {onPinToggle && (
                 <div
                    role="button"
                    tabIndex={0}
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "h-6 w-6 rounded-full cursor-pointer",
                        isPinned ? "opacity-100 text-blue-500" : "opacity-40 hover:!opacity-100"
                    )}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onPinToggle();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            onPinToggle();
                        }
                    }}
                    title={isPinned ? "Unpin item" : "Pin item"}
                 >
                    <Pin className="h-3.5 w-3.5 rotate-45" />
                 </div>
              )}
            </div>
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
        </Card>
    </Link>
  )
}
