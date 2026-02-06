import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AggregatedItem } from "@/hooks/use-tarkov-data"
import Image from "next/image"
import Link from "next/link"
import { Pin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ItemCardProps {
  item: AggregatedItem;
  isPinned?: boolean;
  onPinToggle?: () => void;
}

export function ItemCard({ item, isPinned, onPinToggle }: ItemCardProps) {
  return (
    <Link href={`/items/${item.id}`} className="block h-full group">
        <Card className={`h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 bg-card/50 backdrop-blur-sm ${isPinned ? 'border-blue-500 border-2' : ''}`}>
        <div className="relative p-4 flex flex-col items-center h-full">
            <div className="absolute top-2 left-2 z-20">
              {onPinToggle && (
                 <Button
                    variant="ghost"
                    size="icon"
                    className={`h-6 w-6 rounded-full ${isPinned ? 'opacity-100 text-blue-500' : 'opacity-0 group-hover:opacity-50 hover:!opacity-100'}`}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onPinToggle();
                    }}
                    title={isPinned ? "Unpin item" : "Pin item"}
                 >
                    <Pin className="h-3.5 w-3.5 fill-current" />
                 </Button>
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
