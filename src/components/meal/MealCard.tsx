import Image from "next/image";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

interface MealCardProps {
  meal: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    popular?: boolean;
  };
}

export function MealCard({ meal }: MealCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex">
          <div className="flex-1 p-4">
            <div className="flex justify-between">
              <h3 className="font-medium">{meal.name}</h3>
              {meal.popular && <Badge variant="secondary">Popular</Badge>}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {meal.description}
            </p>
            <p className="font-medium mt-2">${meal.price}</p>
          </div>
          <div className="w-24 h-24 relative">
            <Image
              src={meal.image || "/placeholder.svg"}
              alt={meal.name}
              fill
              className="object-cover rounded-tr-lg rounded-br-lg"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
