import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface ExperienceCardProps {
  slug: string
  title: string
  description: string
  price: number
  duration: string
  category: string
  image?: string
}

export default function ExperienceCard({
  slug,
  title,
  description,
  price,
  duration,
  category,
}: ExperienceCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="h-48 bg-muted" />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{title}</h3>
          <Badge variant="secondary" className="shrink-0">{category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <p className="mt-2 text-xs text-muted-foreground">{duration}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="font-bold">₺{price}</span>
        <Button asChild size="sm">
          <Link href={`/deneyimler/${slug}`}>İncele</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
