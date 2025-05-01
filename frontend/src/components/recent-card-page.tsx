import { Card, CardContent } from "./ui/card";

export default function RecentCardPage({ index }: { index: number }) {
    return (
        <Card className="p-1">
            <CardContent className="flex aspect-square items-center justify-center">
                <span className="text-2xl font-semibold">{index + 1}</span>
            </CardContent>
        </Card>
    )
}
