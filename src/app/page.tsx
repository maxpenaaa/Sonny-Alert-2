import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import { Bell, Zap, Shield, Clock } from 'lucide-react';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen noise-texture">
      <Navbar />
      <Hero />

      <section className="py-24 bg-white border-y-4 border-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase">WHY USE THIS?</h2>
            <p className="text-xl font-medium max-w-2xl mx-auto">Stop refreshing product pages. We do the monitoring for you.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Bell className="w-8 h-8" />, title: "INSTANT ALERTS", description: "Get notified the second your product is back", color: "bg-[#ff69b4]" },
              { icon: <Zap className="w-8 h-8" />, title: "LIGHTNING FAST", description: "Real-time monitoring every few minutes", color: "bg-[#ffff00]" },
              { icon: <Shield className="w-8 h-8" />, title: "100% RELIABLE", description: "Never miss a restock again", color: "bg-[#32ff32]" },
              { icon: <Clock className="w-8 h-8" />, title: "24/7 TRACKING", description: "We watch while you sleep", color: "bg-[#00d4ff]" }
            ].map((feature, index) => (
              <div key={index} className="bg-white border-4 border-[#1a1a1a] brutalist-shadow p-6 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200">
                <div className={`inline-flex p-4 ${feature.color} border-2 border-[#1a1a1a] mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black mb-2 uppercase">{feature.title}</h3>
                <p className="font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#ff69b4] border-b-4 border-[#1a1a1a]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase text-white">
            READY TO NEVER MISS A DROP?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto font-bold text-white">
            Join collectors who trust us to track their favorite Sonny Angel products
          </p>
          <a 
            href={user ? "/dashboard" : "/sign-up"} 
            className="inline-block px-12 py-6 bg-[#32ff32] text-[#1a1a1a] font-black text-xl uppercase border-4 border-[#1a1a1a] brutalist-shadow-lg hover:bg-[#00ff00] transition-all duration-200 active:translate-x-2 active:translate-y-2 active:shadow-none"
          >
            {user ? "GO TO DASHBOARD" : "START TRACKING FREE"}
          </a>
        </div>
      </section>

      <section className="py-20 bg-white border-b-4 border-[#1a1a1a]">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-black mb-12 uppercase text-center">
            HOW IT WORKS
          </h2>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 flex-shrink-0 bg-[#ff69b4] border-4 border-[#1a1a1a] flex items-center justify-center font-black text-xl text-white">
                1
              </div>
              <div>
                <h3 className="text-xl font-black mb-2 uppercase">PASTE THE URL</h3>
                <p className="font-medium">Copy and paste the product URL from any Sonny Angel retailer into the tracker.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 flex-shrink-0 bg-[#ffff00] border-4 border-[#1a1a1a] flex items-center justify-center font-black text-xl text-[#1a1a1a]">
                2
              </div>
              <div>
                <h3 className="text-xl font-black mb-2 uppercase">WE MONITOR 24/7</h3>
                <p className="font-medium">Our system automatically checks stock status every few minutes, round the clock.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 flex-shrink-0 bg-[#32ff32] border-4 border-[#1a1a1a] flex items-center justify-center font-black text-xl text-[#1a1a1a]">
                3
              </div>
              <div>
                <h3 className="text-xl font-black mb-2 uppercase">GET INSTANT ALERTS</h3>
                <p className="font-medium">The moment your item restocks, you'll receive an email with a direct purchase link. First to know = first to buy!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
