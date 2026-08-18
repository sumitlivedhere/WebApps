import React from 'react';

export default function TownHubView({ onSelectCategory }) {
  const townInterestCategories = [
    { id: 're-commerce', name: 'Re-commerce (खरीदो-बेचो)', desc: 'Used Bikes, Cars, Property & Mobiles', icon: '🛍️', accent: 'from-indigo-500/10 to-blue-500/20 text-indigo-600' },
    { id: 'property', name: 'Property (प्रॉपर्टी)', desc: 'Plots, Flats, Houses, Shops & Land', icon: '🏠', accent: 'from-amber-500/10 to-orange-500/20 text-amber-600' },
    { id: 'shaadi',name: 'Shaadi & Weddings (विवाह आयोजन)',desc: '7-Phase marriage planning, vendors, decor, halwai & baraat logistics',icon: '💍',accent: 'from-rose-500/10 to-amber-500/20 text-rose-700'},
    { id: 'market', name: 'Market (बाज़ार)', desc: 'Local Shops, Showrooms & Products', icon: '🏪', accent: 'from-emerald-500/10 to-teal-500/20 text-emerald-600' },
    { id: 'kaarigar', name: 'Kaarigar (कारीगर)', desc: 'Plumbers, Electricians, Carpenters & Mechanics', icon: '🛠️', accent: 'from-amber-500/10 to-orange-500/20 text-amber-600' },
    { id: 'transporters', name: 'Transporters (ट्रांसपोर्ट)', desc: 'Goods Pickups, Packers & Tempo Services', icon: '🚚', accent: 'from-purple-500/10 to-violet-500/20 text-purple-600' },
    { id: 'wholesellers', name: 'Wholesellers (थोक व्यापारी)', desc: 'Bulk Supplies, Mandi & B2B Dealers', icon: '📦', accent: 'from-rose-500/10 to-pink-500/20 text-rose-600' },
    { id: 'jobs', name: 'Local Jobs (नौकरी)', desc: 'Sales, Shop Staff, Drivers & Office Work', icon: '💼', accent: 'from-cyan-500/10 to-blue-500/20 text-cyan-600' },
    //{ id: 'news', name: 'Local News (खबर)', desc: 'Town Updates, Events & Weather Alerts', icon: '📰', accent: 'from-slate-500/10 to-zinc-500/20 text-slate-700' },
    { id: 'community', name: 'Community Service (जनहित)', desc: 'Blood Donation, NGO & Helplines', icon: '🤝', accent: 'from-red-500/10 to-orange-500/20 text-red-600' },
    { id: 'healthcare', name: 'Healthcare / Medical (स्वास्थ्य सेवाएँ)', desc: 'Emergency Doctors, Chemists, Blood Banks & Labs', icon: '🏥', accent: 'from-emerald-500/10 to-teal-500/20 text-emerald-600' },
    //{ id: 'festival', name: 'Festival / Utsav (त्योहार / उत्सव)', desc: 'Local Mela, Pandal, Garba, Events & Pujas', icon: '🎉', accent: 'from-violet-500/10 to-purple-500/20 text-purple-600' },
    { id: 'construction', name: 'Construction (निर्माण कार्य)', desc: 'Builders, Masons, Architects & Building Material', icon: '🏗️', accent: 'from-amber-600/10 to-yellow-500/20 text-amber-700' },
{
  id: 'education',
  name: 'Coaching & Tuitions (शिक्षा व कोचिंग)',
  desc: 'SSC, Bank, NEET, JEE, School Boards, 1-on-1 Home Tutors & Micro Batches',
  icon: '🎓',
  accent: 'from-blue-500/10 to-cyan-500/20 text-blue-700'
},

{
  id: 'restaurants',
  name: 'Restaurants & Cafes (रेस्टोरेंट और कैफे)',
  desc: 'Dine-in, Aesthetic work cafes, rooftop lounges, pure veg thalis & family garden dhabas',
  icon: '🍔',
  accent: 'from-orange-500/10 to-red-500/20 text-orange-600'
},

    { id: 'malls', name: 'Malls & Shopping (मॉल और बाजार)', desc: 'Clothing Outlets, Multiplexes, Brands & Supermarkets', icon: '🛍️', accent: 'from-pink-600/10 to-rose-500/20 text-pink-700' },

{
  id: 'white-collar',
  name: 'White Collar Services (वाइट कॉलर सेवाएँ)',
  desc: 'CAs, Lawyers, Doctors, Vaidyas, Financial Advisors, Architects & Fitness Trainers',
  icon: '👔',
  accent: 'from-slate-600/10 to-zinc-500/20 text-slate-800'
},
   // { id: 'creative', name: 'Creative Professionals (क्रिएटिव प्रोफेशनल्स)', desc: 'Photographers, Videographers, Designers & Event Planners', icon: '📸', accent: 'from-purple-600/10 to-pink-500/20 text-purple-700' },
    { id: 'advertising', name: 'Advertising & Marketing (विज्ञापन व प्रचार)', desc: 'App promotions, newspaper ads, pamphlets, hoardings, flex & signboards', icon: '📢',accent: 'from-amber-500/10 to-orange-500/20 text-amber-700'}
  ];

  return (
    <section className="px-4 py-3 relative z-10 animate-fade-in">
      <div className="mb-3.5 flex justify-between items-center">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
            Explore Town Hub
          </span>
          <h2 className="text-base font-black text-slate-900 mt-1 leading-tight">
            Aapki Pasand (Select Interest)
          </h2>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Scroll down ↓</span>
      </div>

      <div className="space-y-3.5 pb-6">
        {townInterestCategories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="group relative bg-white/80 backdrop-blur-xl border border-white/90 rounded-2xl p-4 shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(99,102,241,0.15)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden min-h-[92px] flex items-center"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 rounded-l-2xl opacity-80 group-hover:w-2 transition-all"></div>
            <div className="flex items-center justify-between pl-2 w-full">
              <div className="flex items-center space-x-3.5">
                <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${cat.accent} flex items-center justify-center text-2xl shadow-inner border border-white/60 group-hover:scale-110 transition-transform duration-300`}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal mt-0.5 leading-snug">
                    {cat.desc}
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100/80 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-slate-400 text-sm font-bold transition-all duration-300 shadow-sm ml-2 shrink-0">
                ➔
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}