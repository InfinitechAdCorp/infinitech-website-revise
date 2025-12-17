"use client"

import type React from "react"
import { Check, ShoppingCart, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useDeviceType } from "@/hooks/use-device"

export interface Plan {
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
  isColumnHovered?: boolean
  index: number
}

const gradients = ["from-cyan-600 to-blue-600", "from-pink-500 to-yellow-500", "from-green-400 to-teal-500", "from-purple-600 to-indigo-600"]

const PricingCard: React.FC<PricingCardProps> = ({ plan, billingPeriod, price, currency = "$", onAddToCart, isInCart, isColumnHovered, index }) => {
  const device = useDeviceType()
  const gradient = gradients[index % gradients.length]

  return (
    <motion.div
      className={cn(
        "relative bg-white border border-slate-200 rounded-2xl shadow-md group",
        plan.popular && "bg-amber-500 shadow-xl shadow-amber-500/20 border border-amber-500",
        plan.name === "Elite" && " bg-gray-500 shadow-xl shadow-gray-500/20 border border-gray-500",
        isColumnHovered || device !== "laptop" ? "mb-20 rounded-t-2xl" : "rounded-2xl",
      )}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`absolute -top-3 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-200 rounded-full text-xs font-bold text-black
            ${isColumnHovered || device !== "laptop" ? "left-1/2" : "left-12"}`}
        >
          Most Popular
        </motion.div>
      )}

      {/* CONTENT */}
      <div className="p-5 flex flex-col gap-2 mb-10">
        {/* Plan Header */}
        <div>
          <h3 className={cn("text-lg font-bold text-black", plan.name === "Elite" && "text-white")}>{plan.name}</h3>
          {(isColumnHovered || device !== "laptop") && plan.badge && (
            <p className={cn("text-xs", plan.name === "Elite" && "text-white")}>{plan.badge}</p>
          )}
        </div>

        {/* Features (shown only when column hovered) */}
        <motion.div
          initial={false}
          animate={{
            height: isColumnHovered || device !== "laptop" ? "auto" : 0,
            opacity: isColumnHovered || device !== "laptop" ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {(isColumnHovered || device !== "laptop") && (
            <>
              <div className="grid grid-cols-2 gap-y-2 border-t border-slate-200 pt-3">
                {plan.features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: isColumnHovered || device !== "laptop" ? 1 : 0,
                      x: isColumnHovered || device !== "laptop" ? 0 : -10,
                    }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-2"
                  >
                    <Check className={cn("w-3.5 h-3.5 mt-0.5 text-black", plan.name === "Elite" && "text-yellow-500")} />
                    <span className={cn("text-black text-xs leading-relaxed", plan.name === "Elite" && "text-white")}>{feature}</span>
                  </motion.div>
                ))}
              </div>
            </>
          )}
          {/* PRICE BOX */}
          <div
            className={cn(
              "absolute -bottom-10 right-0 border border-white shadow-xl bg-white rounded-b-3xl p-2",
              plan.popular && "bg-amber-500 shadow-xl shadow-amber-500/20 border border-amber-500",
              plan.name === "Elite" && " bg-gray-500 shadow-xl shadow-gray-500/20 border border-gray-500",
            )}
          >
            <div className={`flex items-end justify-end gap-4 bg-gradient-to-r ${gradient} shadow-lg rounded-2xl p-3`}>
              <div className="text-right">
                <div className="flex items-center gap-0.5">
                  <span className="text-3xl font-black text-white">{currency}</span>
                  <span className="text-2xl font-black text-white">
                    {price.toLocaleString("en-PH", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </span>
                  <span className="text-slate-300 text-xs font-medium">/{billingPeriod === "yearly" ? "year" : "month"}</span>
                </div>
              </div>

              {/* ADD TO CART */}
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToCart?.()
                }}
                className={cn(
                  "relative p-3 rounded-xl transition-all duration-300",
                  isInCart
                    ? "bg-green-500 text-white"
                    : plan.popular
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-xl"
                      : "bg-slate-700 text-white hover:bg-slate-600 border border-slate-600",
                )}
              >
                <ShoppingCart className="w-5 h-5" />
                {!isInCart && <Plus className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full p-0.5" />}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default PricingCard
