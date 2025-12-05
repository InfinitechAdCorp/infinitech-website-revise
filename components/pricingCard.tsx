"use client"

import type React from "react"
import { Check, ShoppingCart, Plus } from "lucide-react"

interface Plan {
  name: string
  description?: string
  popular: boolean
  features: string[]
  cta: string
  badge?: string
  monthlyPrice?: number
  yearlyPrice?: number
}

interface PricingCardProps {
  plan: Plan
  billingPeriod: "monthly" | "yearly"
  price: number
  currency?: string
  onAddToCart?: () => void
  isInCart?: boolean
}

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  billingPeriod,
  price,
  currency = "$",
  onAddToCart,
  isInCart,
}) => {
  return (
    <div
      className={`relative rounded-2xl transition-all duration-300 ${
        plan.popular
          ? "bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500 shadow-2xl shadow-cyan-500/20"
          : "bg-slate-800/50 border border-slate-700 hover:bg-slate-800/70"
      }`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-6">
          <span className="inline-block px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="p-5 flex flex-row gap-6">
        {/* Left: Plan Info & Features */}
        <div className="flex-1 min-w-0">
          {/* Plan Header */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-white">{plan.name}</h3>
            {plan.badge && <p className="text-xs text-slate-400">{plan.badge}</p>}
          </div>

          {/* Features List - Two columns */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {plan.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Check
                  className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${plan.popular ? "text-cyan-400" : "text-slate-400"}`}
                />
                <span className="text-slate-300 text-xs leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Price & Cart Button */}
        <div className="flex flex-col items-end justify-between shrink-0">
          {/* Price */}
          <div className="text-right">
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-black text-white">{currency}</span>
              <span className="text-2xl font-black text-white">
                {price.toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
            <span className="text-slate-400 font-medium text-xs">/{billingPeriod === "yearly" ? "year" : "month"}</span>
          </div>

          <button
            onClick={onAddToCart}
            className={`relative p-3 rounded-xl transition-all duration-300 ${
              isInCart
                ? "bg-green-500 text-white"
                : plan.popular
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-xl"
                  : "bg-slate-700 text-white hover:bg-slate-600 border border-slate-600"
            }`}
            title={isInCart ? "Added to cart" : "Add to cart"}
          >
            <ShoppingCart className="w-5 h-5" />
            {!isInCart && <Plus className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full p-0.5" />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PricingCard
