import React from "react";

export default function About() {
  return (
    <div className="font-body min-h-screen bg-[#FAF8F1]">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#064E3B] mb-6">About Nithi Collection</h1>
          <p className="text-lg text-[#5C635E] max-w-2xl mx-auto leading-relaxed">
            Nithi Collection is an ode to authentic Indian textile heritage and contemporary couture.
            We specialize in handcrafted sarees, exquisite ethnic wear, and luxury daily ensembles woven with pure craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="aspect-[4/5] bg-[#E8E2D5] rounded-sm overflow-hidden border border-[#C9A227]/30">
            <img 
              src="https://images.unsplash.com/photo-1610030469983-98e550d61dc0?auto=format&fit=crop&q=80&w=800" 
              alt="Traditional craftsmanship" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-[#1A1008] mb-4">Our Heritage</h2>
            <p className="text-sm text-[#5C635E] mb-6 leading-relaxed">
              Rooted in the rich cultural landscape of Madurai, Tamil Nadu, we bring generations of weaving expertise 
              straight to your wardrobe. Our journey started with a simple belief: that traditional elegance should 
              be celebrated in our everyday lives.
            </p>
            <h2 className="font-display text-2xl font-bold text-[#1A1008] mb-4">Our Promise</h2>
            <p className="text-sm text-[#5C635E] leading-relaxed">
              We promise uncompromising quality, sustainable practices, and designs that resonate with the modern Indian aesthetic.
              Every piece in our collection is curated with love and attention to detail.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
