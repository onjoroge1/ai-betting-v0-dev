import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "James K.",
      location: "Kenya",
      flag: "🇰🇪",
      rating: 5,
      text: "Made €500 in my first week using the AI predictions. M-Pesa integration makes it so easy to get started!",
      profit: "+€500",
      timeframe: "1 week",
    },
    {
      name: "Priya S.",
      location: "India",
      flag: "🇮🇳",
      rating: 5,
      text: "The Hindi language support and Paytm payments make this perfect for Indian bettors. Great predictions!",
      profit: "+₹25,000",
      timeframe: "1 month",
    },
    {
      name: "Miguel R.",
      location: "Philippines",
      flag: "🇵🇭",
      rating: 5,
      text: "Finally a platform that understands Asian markets. The Tagalog support is amazing!",
      profit: "+₱15,000",
      timeframe: "2 weeks",
    },
    {
      name: "Sarah L.",
      location: "UK",
      flag: "🇬🇧",
      rating: 5,
      text: "Best tipster service I've used. The AI explanations help me understand each bet better.",
      profit: "+£800",
      timeframe: "3 weeks",
    },
  ]

  return (
    <section className="py-16 px-4 bg-slate-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Success Stories from Around the World</h2>
          <p className="text-slate-300 text-lg">Real profits from real users across 25+ countries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 p-6 hover:bg-slate-800/70 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{testimonial.flag}</span>
                  <div>
                    <div className="text-white font-medium">{testimonial.name}</div>
                    <div className="flex items-center text-slate-400 text-sm">
                      <MapPin className="w-3 h-3 mr-1" />
                      {testimonial.location}
                    </div>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-slate-300 text-sm mb-4 leading-relaxed">"{testimonial.text}"</p>

              <div className="flex items-center justify-between">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{testimonial.profit}</Badge>
                <span className="text-slate-400 text-xs">{testimonial.timeframe}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
