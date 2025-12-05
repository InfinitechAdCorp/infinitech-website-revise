import { ShoppingBag, Trash2, Sparkles, ArrowRight } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  service: string;
  price: number;
  billingPeriod: "monthly" | "yearly";
  yearlyPrice: number;
  monthlyPrice: number;
}

interface CartSummaryProps {
  items: CartItem[];
  currency: string;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

const CartSummary = ({ items, currency, onRemoveItem, onCheckout }: CartSummaryProps) => {
  const formatPrice = (value: number) => value.toLocaleString();
  
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const monthlyTotal = items.reduce((sum, item) => sum + item.monthlyPrice, 0);
  const savings = items.reduce((sum, item) => {
    if (item.billingPeriod === "yearly") {
      return sum + (item.monthlyPrice * 12 - item.yearlyPrice);
    }
    return sum;
  }, 0);

  const getServiceLabel = (service: string) => {
    const labels: Record<string, string> = {
      website: "Website",
      juantap: "JuanTap",
      socialmedia: "Social Media",
      multimedia: "Multimedia",
    };
    return labels[service] || service;
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/80 via-slate-900/90 to-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sticky top-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-primary">
          <ShoppingBag className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Order Summary</h3>
          <p className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"} selected
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Your cart is empty</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Add plans to get started</p>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{getServiceLabel(item.service)}</p>
                  <p className="text-sm text-primary font-medium mt-1">
                    {currency}{formatPrice(item.price)}/mo
                  </p>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

          {/* Calculations */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal (monthly)</span>
              <span className="text-foreground">{currency}{formatPrice(monthlyTotal)}</span>
            </div>
            
            {savings > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Annual Savings
                </span>
                <span className="text-emerald-400">-{currency}{formatPrice(savings)}</span>
              </div>
            )}

            <div className="h-px bg-border/50" />

            <div className="flex justify-between items-baseline">
              <span className="text-foreground font-semibold">Total</span>
              <div className="text-right">
                <span className="text-gradient-gold text-2xl font-extrabold">
                  {currency}{formatPrice(subtotal)}
                </span>
                <span className="text-muted-foreground text-sm">/mo</span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={onCheckout}
            className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-primary text-primary-foreground hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            Proceed to Checkout
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Trust badges */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>🔒 Secure Payment</span>
            <span>•</span>
            <span>💬 24/7 Support</span>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSummary;
