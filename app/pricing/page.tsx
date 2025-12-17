"use client"

import { useState } from "react"
import PricingCard from "@/components/pricingCard"
import { X, ShoppingCart, Mail, Loader2, Plus, Minus, Globe, CreditCard, Share, Share2, Video } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDeviceType } from "@/hooks/use-device"

interface CartItem {
  planName: string
  service: string
  price: number
  billingPeriod: "monthly" | "yearly"
}

const PricingPage = () => {
  const [activeService, setActiveService] = useState<string | null>("")
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const [cart, setCart] = useState<CartItem[]>([])
  const [clientEmail, setClientEmail] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [emailStatus, setEmailStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [hoveredCol, setHoveredCol] = useState<number | null>(null)
  const device = useDeviceType()

  const services = {
    website: {
      title: "Website / Web App With Mobile App",
      description: "Professional website solutions with mobile app and advanced features",
      plans: [
        {
          name: "Standard",
          monthlyPrice: 5999,
          yearlyPrice: 265980,
          features: [
            "Up to 5 pages",
            "Social Media Links integration",
            "Simple Contact Form",
            "Email Alerts for Form Inquiries",
            "Basic Mobile App (iOS/Android)",
            "Downloadable APK",
            "App Appears on Google Play",
            "1-Year Domain and Hosting",
          ],
          popular: false,
          cta: "Get Started",
        },
        {
          name: "Premium",
          monthlyPrice: 9999,
          yearlyPrice: 319988,
          features: [
            "Everything in Standard, plus:",
            "Up to 10 Website Pages",
            "Dashboard Login for Clients",
            "Traffic Insights & Analytics",
            "Enhanced Site Customization",
            "Smart Chat System",
            "Design Upgrade",
          ],
          popular: true,
          cta: "Choose Plan",
        },
        {
          name: "Business",
          monthlyPrice: 14999,
          yearlyPrice: 379988,
          features: [
            "Google Play Store Mobile App",
            "SEO Pro Setup +",
            "Dashboard Reports",
            "eCommerce - Ready Products Catalog",
            "Admin Staff & Client Management",
            "Upgraded Motion & Animation Website",
            "Lead Form With Dashboard Tracking",
            "Video Testimonials Section",
          ],
          popular: false,
          cta: "Contact Sales",
        },
        {
          name: "Commerce",
          monthlyPrice: 21999,
          yearlyPrice: 463988,
          features: [
            "Google Play + Apple App Release",
            "Advanced Conversion Tracking",
            "Full eCommerce System",
            "Booking Calendar & Tools",
            "Real-Time Notifications System",
            "VIP Priority Support (Phone, Chat, Email)",
            "Dashboard for Clients",
          ],
          popular: false,
          cta: "Contact Sales",
        },
      ],
    },
    juantap: {
      title: "JuanTap - Modern NFC Card",
      description: "Digital business cards with NFC technology",
      plans: [
        {
          name: "Standard",
          monthlyPrice: 588,
          yearlyPrice: 1588,
          features: [
            "Editable and customizable design",
            "QR Code for non-NFC phones",
            "Simple card design (logo and name in background)",
            "Name on front, Logo or QR on back",
            "Click-to-call, click-to-email",
            "Lifetime reusable",
          ],
          popular: false,
          cta: "Get Started",
          badge: "BEST FOR Freelancers, individuals, basic use",
        },
        {
          name: "Premium",
          monthlyPrice: 888,
          yearlyPrice: 1888,
          features: [
            "Full-Color Premium Design",
            "Choose your style (Silver, Laser, Leather)",
            "Personal info (Name, Title, Company, Contact)",
            "QR Code for non-NFC phones",
            "Business location Maps + Save Contact Button",
            "Social media & website links",
            "Online dashboard (edit anytime)",
            "File upload (PDF / Portfolio)",
            "Lifetime reusable",
          ],
          popular: true,
          cta: "Choose Plan",
          badge: "BEST FOR Small business owners, entrepreneurs",
        },
        {
          name: "Elite",
          monthlyPrice: 1288,
          yearlyPrice: 2288,
          features: [
            "Premium card design (laser printed logo and name)",
            "Premium metal finish",
            "Personal info (Name, Title, Company, Contact)",
            "Business location Maps + Save Contact Button",
            "Analytics (taps/views counts)",
            "Multiple profile support (Business & Personal)",
            "Full-color creative design",
            "File upload (PDF / Portfolio)",
            "QR Code for non-NFC phones",
            "Editable and customizable design",
          ],
          popular: false,
          cta: "Contact Sales",
          badge: "BEST FOR VIP clients, brokers, executives",
        },
      ],
    },
    socialmedia: {
      title: "Social Media Management",
      description: "Complete social media management and content creation services",
      plans: [
        {
          name: "Standard",
          monthlyPrice: 11993,
          yearlyPrice: 74979,
          features: ["Account Setup (FB+IG+TikTok)", "Branding (Profile & Cover)", "8 Posts / Month", "2 Reels / Month", "Monthly Insights Report"],
          popular: false,
          cta: "Get Started",
        },
        {
          name: "Growth",
          monthlyPrice: 18973,
          yearlyPrice: 98919,
          features: [
            "Everything in Standard, plus:",
            "Account Setup (FB+IG+TikTok)",
            "Branding (Profile & Cover)",
            "12-15 Posts / Month",
            "4 Reels / Month",
            "Content Calendar",
            "Monthly Insights Report",
          ],
          popular: true,
          cta: "Choose Plan",
        },
        {
          name: "Premium",
          monthlyPrice: 32947,
          yearlyPrice: 143841,
          features: [
            "Account Setup (FB+IG+TikTok)",
            "Branding (Profile & Cover)",
            "20-25 Posts / Month",
            "2 Reels / Month",
            "Captions & Hashtags",
            "Monthly Insights Report",
          ],
          popular: false,
          cta: "Contact Sales",
        },
        {
          name: "Corporate",
          monthlyPrice: 47973,
          yearlyPrice: 179919,
          features: [
            "Account Setup (FB+IG+TikTok)",
            "Branding (Profile & Cover)",
            "8 Posts / Month",
            "2 Reels / Month",
            "Captions & Hashtags",
            "Monthly Insights Report",
            "30+ Posts / Month",
          ],
          popular: false,
          cta: "Contact Sales",
        },
      ],
    },
    multimedia: {
      title: "Multimedia Advertising",
      description: "Professional multimedia content creation and advertising packages",
      plans: [
        {
          name: "Standard",
          monthlyPrice: 4950,
          yearlyPrice: 14950,
          features: [
            "Product or Corporate Photo Shoot (up to 10 items or 5 pax)",
            "1 Short Promo Video (30–60s)",
            "Basic Editing (Photo + Video)",
            "Background Music",
            "20 Edited Photos",
            "1 Export Format (Web-optimized)",
          ],
          popular: false,
          cta: "Get Started",
        },
        {
          name: "Business Growth",
          monthlyPrice: 14750,
          yearlyPrice: 24750,
          features: [
            "Product + Lifestyle + Corporate Photography (up to 30 items / 8 pax)",
            "1 Full Promo Video (1–3 mins) + 3 Social Media Shorts",
            "Event Coverage (up to 4 hrs)",
            "Scriptwriting & Concept",
            "50 Edited Photos",
            "Subtitles & Captions",
            "Optimized for TikTok, IG, FB & Website",
          ],
          popular: true,
          cta: "Choose Plan",
        },
        {
          name: "Business",
          monthlyPrice: 29500,
          yearlyPrice: 39500,
          features: [
            "Full Product + Corporate + Lifestyle Coverage (unlimited products/team)",
            "Full Event Coverage (up to 8 hrs)",
            "On-site Interviews + Voice-over",
            "Scriptwriting & Storyboarding",
            "1 Main Video (3–5 mins) + 5 Social Media Shorts",
            "Full Color Grading + Advanced Retouching + Creative Branding Overlays",
            "1 Export Format (Web-optimized)",
          ],
          popular: false,
          cta: "Contact Sales",
        },
      ],
    },
  }

  const currentService = services[activeService as keyof typeof services]
  const getPrice = (plan: any) => (billingPeriod === "yearly" ? plan.yearlyPrice : plan.monthlyPrice)

  const isInCart = (planName: string, service: string) => {
    return cart.some((item) => item.planName === planName && item.service === service)
  }

  const toggleCart = (planName: string, service: string, price: number) => {
    if (isInCart(planName, service)) {
      setCart(cart.filter((item) => !(item.planName === planName && item.service === service)))
    } else {
      setCart([...cart, { planName, service, price, billingPeriod }])
    }
  }

  const removeFromCart = (planName: string, service: string) => {
    setCart(cart.filter((item) => !(item.planName === planName && item.service === service)))
  }

  const getServiceTitle = (serviceKey: string) => {
    const titles: Record<string, string> = {
      website: "Website",
      juantap: "JuanTap",
      socialmedia: "Social Media",
      multimedia: "Multimedia",
    }
    return titles[serviceKey] || serviceKey
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0)

  const handleSendEmail = async () => {
    if (!clientEmail) {
      setEmailStatus({ type: "error", message: "Please enter client email" })
      return
    }
    if (cart.length === 0) {
      setEmailStatus({ type: "error", message: "Cart is empty" })
      return
    }

    setIsSending(true)
    setEmailStatus(null)

    const now = new Date()
    const dateStr = now.toLocaleDateString("en-PH", { day: "2-digit", month: "2-digit", year: "numeric" })
    const timeStr = now.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", hour12: true })
    const receiptNo = `N° ${Math.floor(1000 + Math.random() * 9000)}`

    try {
      const response = await fetch("/api/summary-send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: clientEmail,
          subject: `Infinitech - Order Summary #${receiptNo}`,
          cart: cart.map((item) => ({
            ...item,
            serviceTitle: getServiceTitle(item.service),
          })),
          total: cartTotal,
          dateStr,
          timeStr,
          receiptNo,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setEmailStatus({ type: "success", message: "Email sent successfully!" })
        setClientEmail("")
      } else {
        setEmailStatus({ type: "error", message: data.error || "Failed to send email" })
      }
    } catch (error) {
      setEmailStatus({ type: "error", message: "Failed to send email" })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="min-h-screen py-24">
      {/* Header Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8 lg:mb-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className={`text-4xl text-accent font-bold uppercase`}>Pricing Plans</h1>
          <h2 className="text-3xl text-primary font-['Poetsen_One']">
            Choose the perfect plan for your business. All plans include support and updates.
          </h2>

          <div className="flex justify-center gap-2 my-4">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-5 py-2 rounded-full font-semibold transition-all text-sm ${
                billingPeriod === "monthly"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 backdrop-blur-sm rounded-full text-white"
                  : "bg-white text-slate-700 border border-black/20 shadow-lg"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-5 py-2 rounded-full font-semibold transition-all text-sm ${
                billingPeriod === "yearly"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 backdrop-blur-sm rounded-full text-white"
                  : "bg-white text-slate-700 border border-black/20 shadow-lg"
              }`}
            >
              Yearly
            </button>
          </div>

          <p className="text-sm sm:text-base lg:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed animate-fade-in-up mb-8 sm:mb-12 px-4">
            {currentService?.description || ""}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className={`flex ${device === "mobile" ? "flex-col" : "flex-row"} gap-6 max-w-7xl mx-auto`}>
          <div
            className={`flex ${device === "laptop" ? "flex-row" : "flex-col"} gap-6 w-full mx-auto md:gap-6 overflow-hidden md:overflow-visible`}
            onPointerLeave={() => {
              setHoveredCol(null)
              setActiveService(null)
            }}
          >
            {/* Website */}
            <div
              onPointerEnter={() => {
                if (!window.matchMedia("(hover: none)").matches) {
                  setHoveredCol(1)
                  setActiveService("website")
                }
              }}
              className={cn(
                "transform will-change-transform transition-[flex,transform,opacity] duration-300 ease-out",
                hoveredCol === null
                  ? "flex-1 translate-x-0 opacity-100"
                  : hoveredCol === 1
                    ? "flex-[4] translate-x-0 opacity-100"
                    : // non-hovered (to the left of hovered -> slide left)
                      "flex-[0.0001] -translate-x-12 opacity-0 overflow-hidden pointer-events-none",
              )}
            >
              <div className="flex items-center gap-2 mb-4 px-1">
                <h2
                  className={cn(
                    "font-display flex justify-center items-center gap-2 duration-300 w-full px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap text-sm ",
                    hoveredCol === 1
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                      : "bg-slate-700 text-slate-100 hover:bg-slate-600",
                  )}
                >
                  <Globe
                    className={cn(
                      "w-4 h-4 transition-colors duration-300 text-primary-foreground",
                      hoveredCol ? "text-primary-foreground" : "text-slate-100",
                    )}
                  />
                  Website
                </h2>
              </div>
              <div className="space-y-4">
                {services.website.plans.map((plan, idx) => (
                  <div key={idx} className={`${hoveredCol && "mb-30"} `}>
                    <PricingCard
                      key={idx}
                      plan={plan}
                      billingPeriod={billingPeriod}
                      price={getPrice(plan)}
                      currency="₱"
                      onAddToCart={() => toggleCart(plan.name, "website", getPrice(plan))}
                      isInCart={isInCart(plan.name, "website")}
                      isColumnHovered={hoveredCol === 1}
                      index={idx}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* JuanTap */}
            <div
              onPointerEnter={() => {
                if (!window.matchMedia("(hover: none)").matches) {
                  setHoveredCol(2)
                  setActiveService("juantap")
                }
              }}
              className={cn(
                "transform will-change-transform transition-[flex,transform,opacity] duration-300 ease-out",
                hoveredCol === null
                  ? "flex-1 translate-x-0 opacity-100"
                  : hoveredCol === 2
                    ? "flex-[4] translate-x-0 opacity-100"
                    : // non-hovered (to the left of hovered -> slide left)
                      "flex-[0.0001] -translate-x-12 opacity-0 overflow-hidden pointer-events-none",
              )}
            >
              <div className="flex items-center gap-2 mb-4 px-1">
                <h2
                  className={cn(
                    "font-display flex justify-center items-center gap-2 duration-300 w-full px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap text-sm ",
                    hoveredCol === 2
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                      : "bg-slate-700 text-slate-100 hover:bg-slate-600",
                  )}
                >
                  <CreditCard
                    className={cn(
                      "w-4 h-4 transition-colors duration-300 text-primary-foreground",
                      hoveredCol ? "text-primary-foreground" : "text-slate-100",
                    )}
                  />
                  JuanTap
                </h2>
              </div>
              <div className="space-y-4">
                {services.juantap.plans.map((plan, idx) => (
                  <div key={idx} className={`${hoveredCol && "mb-30"} `}>
                    <PricingCard
                      key={idx}
                      plan={plan}
                      billingPeriod={billingPeriod}
                      price={getPrice(plan)}
                      currency="₱"
                      onAddToCart={() => toggleCart(plan.name, "juantap", getPrice(plan))}
                      isInCart={isInCart(plan.name, "juantap")}
                      isColumnHovered={hoveredCol === 2}
                      index={idx}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div
              onPointerEnter={() => {
                if (!window.matchMedia("(hover: none)").matches) {
                  setHoveredCol(3)
                  setActiveService("socialmedia")
                }
              }}
              className={cn(
                "transform will-change-transform transition-[flex,transform,opacity] duration-300 ease-out",
                hoveredCol === null
                  ? "flex-1 translate-x-0 opacity-100"
                  : hoveredCol === 3
                    ? "flex-[4] translate-x-0 opacity-100"
                    : // non-hovered (to the left of hovered -> slide left)
                      "flex-[0.0001] -translate-x-12 opacity-0 overflow-hidden pointer-events-none",
              )}
            >
              <div className="flex items-center gap-2 mb-4 px-1">
                <h2
                  className={cn(
                    "font-display flex justify-center items-center gap-2 duration-300 w-full px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap text-sm ",
                    hoveredCol === 3
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                      : "bg-slate-700 text-slate-100 hover:bg-slate-600",
                  )}
                >
                  <Share2
                    className={cn(
                      "w-4 h-4 transition-colors duration-300 text-primary-foreground",
                      hoveredCol ? "text-primary-foreground" : "text-slate-100",
                    )}
                  />
                  Social Media
                </h2>
              </div>
              <div className="space-y-4">
                {services.socialmedia.plans.map((plan, idx) => (
                  <div key={idx} className={`${hoveredCol && "mb-30"} `}>
                    <PricingCard
                      key={idx}
                      plan={plan}
                      billingPeriod={billingPeriod}
                      price={getPrice(plan)}
                      currency="₱"
                      onAddToCart={() => toggleCart(plan.name, "socialmedia", getPrice(plan))}
                      isInCart={isInCart(plan.name, "socialmedia")}
                      isColumnHovered={hoveredCol === 3}
                      index={idx}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Multimedia */}
            <div
              onPointerEnter={() => {
                if (!window.matchMedia("(hover: none)").matches) {
                  setHoveredCol(4)
                  setActiveService("multimedia")
                }
              }}
              className={cn(
                "transform will-change-transform transition-[flex,transform,opacity] duration-300 ease-out",
                hoveredCol === null
                  ? "flex-1 translate-x-0 opacity-100"
                  : hoveredCol === 4
                    ? "flex-[4] translate-x-0 opacity-100"
                    : // non-hovered (to the left of hovered -> slide left)
                      "flex-[0.0001] -translate-x-12 opacity-0 overflow-hidden pointer-events-none",
              )}
            >
              <div className="flex items-center gap-2 mb-4 px-1">
                <h2
                  className={cn(
                    "font-display flex justify-center items-center gap-2 duration-300 w-full px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap text-sm ",
                    hoveredCol === 4
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                      : "bg-slate-700 text-slate-100 hover:bg-slate-600",
                  )}
                >
                  <Video
                    className={cn(
                      "w-4 h-4 transition-colors duration-300 text-primary-foreground",
                      hoveredCol ? "text-primary-foreground" : "text-slate-100",
                    )}
                  />
                  Multimedia
                </h2>
              </div>
              <div className="space-y-4">
                {services.multimedia.plans.map((plan, idx) => (
                  <div key={idx} className={`${hoveredCol && "mb-30"} `}>
                    <PricingCard
                      key={idx}
                      plan={plan}
                      billingPeriod={billingPeriod}
                      price={getPrice(plan)}
                      currency="₱"
                      onAddToCart={() => toggleCart(plan.name, "multimedia", getPrice(plan))}
                      isInCart={isInCart(plan.name, "multimedia")}
                      isColumnHovered={hoveredCol === 4}
                      index={idx}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart */}
          <div
            className={`${device === "mobile" ? "w-full" : "w-80"} shrink-0 order-last col-span-1`}
            onPointerEnter={() => {
              setHoveredCol(null)
              setActiveService(null)
            }}
          >
            <div id="order-summary" className="bg-slate-50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-primary">Order Summary</h3>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">Your cart is empty</p>
                  <p className="text-slate-500 text-xs mt-1">Add plans to get started</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-2 bg-slate-300/50 rounded-lg p-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-primary font-medium text-sm truncate">{item.planName}</p>
                          <p className="text-slate-400 text-xs">{getServiceTitle(item.service)}</p>
                          <p className="text-primary text-xs font-semibold">
                            ₱{item.price.toLocaleString()} / {item.billingPeriod === "yearly" ? "year" : "mo"}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.planName, item.service)}
                          className="text-slate-400 hover:text-red-400 transition-colors p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-600 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-primary font-medium">Total</span>
                      <span className="text-xl font-bold text-primary">₱{cartTotal.toLocaleString()}</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-slate-400 text-xs mb-1 block">Client Email</label>
                        <input
                          type="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="client@email.com"
                          className="w-full px-3 py-2 border border-slate-400 rounded-lg text-white text-sm placeholder-slate-400 focus:border-cyan-500 transition-colors"
                        />
                      </div>

                      {emailStatus && (
                        <div
                          className={`text-xs p-2 rounded-lg ${
                            emailStatus.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {emailStatus.message}
                        </div>
                      )}

                      <button
                        onClick={handleSendEmail}
                        disabled={isSending}
                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSending ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="w-5 h-5" />
                            Send to Email
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PricingPage
