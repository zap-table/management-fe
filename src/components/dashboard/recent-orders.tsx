import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const recentOrders = [
  {
    id: "1",
    table: "Mesa 1",
    amount: "45,00€",
    status: "completed",
    email: "m.g@example.com",
    name: "Maria G.",
  },
  {
    id: "2",
    table: "Mesa 3",
    amount: "78,50€",
    status: "processing",
    email: "j.s@example.com",
    name: "João S.",
  },
  {
    id: "3",
    table: "Mesa 5",
    amount: "125,00€",
    status: "pending",
    email: "a.r@example.com",
    name: "Ana R.",
  },
];

export function RecentOrders() {
  return (
    <div className="space-y-8">
      {recentOrders.map((order) => (
        <div key={order.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {order.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{order.name}</p>
            <p className="text-sm text-muted-foreground">
              {order.table}
            </p>
          </div>
          <div className="ml-auto font-medium">{order.amount}</div>
        </div>
      ))}
    </div>
  );
} 