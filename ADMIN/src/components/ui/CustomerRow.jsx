import { ChevronRight, Mail, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CustomerRow = ({ customer, delay = 0 }) => {
  const router = useRouter();

  return (
    <div 
      onClick={() => router.push(`/customers/${customer.id}`)}
      className="bg-card rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in active:scale-[0.98] touch-manipulation cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-primary font-semibold">
            {customer.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm mb-0.5">{customer.name}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <Mail className="w-3 h-3" />
            <span className="truncate">{customer.email}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <ShoppingBag className="w-3 h-3" />
              <span>{customer.orders} orders</span>
            </div>
            <span>•</span>
            <span>৳{customer.spent} spent</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      </div>
    </div>
  );
};

export default CustomerRow;
