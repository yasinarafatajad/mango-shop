"use client"
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const statusColors = {
  pending: 'bg-warning/10 text-warning',
  processing: 'bg-primary/10 text-primary',
  shipped: 'bg-accent/10 text-accent',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

const OrderRow = ({ order, delay = 0 }) => {
  const router = useRouter();

  return (
    <div 
      onClick={() => router.push(`/orders/${order.id}`)}
      className="bg-card rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in active:scale-[0.98] touch-manipulation cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">#{order.id}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColors[order.status]}`}>
              {order.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate">{order.customer}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span>{order.items} items</span>
            <span>•</span>
            <span>{order.date}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold">৳{order.total}</span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default OrderRow;
