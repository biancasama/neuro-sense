
import React, { useState, useEffect, useRef } from 'react';
import { AnalysisResult, Language, Memory, RiskLevel, GroundingData } from './types';
import { analyzeMessageContext, getNearbySupportPlaces } from './services/geminiService';
import InputSection from './components/InputSection';
import AnalysisDashboard from './components/AnalysisDashboard';
import Header, { BrainLogo } from './components/Header';
import { translations } from './utils/translations';
import { Moon, Sun, ArrowRight, Youtube, Instagram, Twitter, Music, MessageCircle } from 'lucide-react';
import { PhoneMockupIllustration } from './components/Illustrations';
import BodyDoubleAvatar from './components/BodyDoubleAvatar';

// Footer Component tailored for the App Card
const Footer = ({ theme, t, sensorySafe }: { theme: 'light' | 'dark', t: any, sensorySafe: boolean }) => {
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-stone-900';
  const textSecondary = theme === 'dark' ? 'text-stone-400' : 'text-stone-500';
  const borderCol = theme === 'dark' ? 'border-white/10' : 'border-stone-200';

  if (sensorySafe) {
    return (
       <footer className={`w-full py-8 mt-12 border-t ${borderCol} text-center text-xs ${textSecondary}`}>
          <p>{t.footerRights}</p>
       </footer>
    );
  }

  return (
    <footer className={`w-full py-12 mt-16 border-t ${borderCol} transition-colors duration-500`}>
      <div className="flex flex-col gap-12 text-left max-w-5xl mx-auto">
        
        {/* Top Section: Brand + Links */}
        <div className="flex flex-col md:flex-row md:justify-between gap-12">
            
            {/* Brand Section - Aligned with Logo on left, text column on right */}
            <div className="flex flex-row gap-4 md:max-w-xs items-start">
               <div className="pt-1 flex-shrink-0">
                 <BrainLogo size={32} />
               </div>
               <div className="flex flex-col items-start w-full">
                   <div className="flex items-center gap-3 mb-4 h-8">
                     <span className={`font-bold text-xl md:text-2xl ${textPrimary}`}>Neuro-Sense</span>
                   </div>
                   
                   {/* Staggered Footer Subtitle */}
                   <div className={`text-sm ${textSecondary} mb-6 leading-relaxed flex flex-col w-full`}>
                     {t.heroSubtitle.split('. ').map((sent: string, i: number) => {
                       const alignClass = i === 0 ? 'text-left' : (i === 1 ? 'text-right' : 'text-center');
                       return (
                         <span key={i} className={`block ${alignClass}`}>
                           {sent}{i < 2 ? '.' : ''}
                         </span>
                       )
                     })}
                   </div>
                   
                   <div className={`flex items-center gap-4 ${textSecondary}`}>
                    <a href="#" className="hover:text-indigo-500 transition-colors"><Youtube size={20} /></a>
                    <a href="#" className="hover:text-indigo-500 transition-colors"><Instagram size={20} /></a>
                    <a href="#" className="hover:text-indigo-500 transition-colors"><Music size={20} /></a>
                    <a href="#" className="hover:text-indigo-500 transition-colors"><Twitter size={20} /></a>
                   </div>
               </div>
            </div>

            {/* Links Grid - Responsive */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-8 md:gap-x-24">
               {/* Column 1 */}
               <div>
                 <h4 className={`font-bold text-base mb-4 ${textPrimary}`}>{t.footerUseCases}</h4>
                 <ul className={`space-y-3 text-sm ${textSecondary}`}>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerSocialContext}</a></li>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerEmotionalSafety}</a></li>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerClarity}</a></li>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerConflict}</a></li>
                 </ul>
               </div>

               {/* Column 2 */}
               <div>
                 <h4 className={`font-bold text-base mb-4 ${textPrimary}`}>{t.footerCompany}</h4>
                 <ul className={`space-y-3 text-sm ${textSecondary}`}>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerCareers}</a></li>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerBlog}</a></li>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerInfluencer}</a></li>
                 </ul>
               </div>

               {/* Column 3 */}
               <div className="col-span-2 md:col-span-1">
                 <h4 className={`font-bold text-base mb-4 ${textPrimary}`}>{t.footerLegal}</h4>
                 <ul className={`space-y-3 text-sm ${textSecondary} flex flex-col`}>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerTerms}</a></li>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerPrivacy}</a></li>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerRefund}</a></li>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerDisclaimer}</a></li>
                 </ul>
               </div>
            </div>
        </div>

        {/* Divider */}
        <div className={`h-px w-full ${theme === 'dark' ? 'bg-white/10' : 'bg-stone-200'}`}></div>

        {/* Bottom Section */}
        <div className={`text-sm ${textSecondary} text-center md:text-left`}>
           {t.footerRights}
        </div>

      </div>
    </footer>
  );
};

const App: React.FC = () => {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Accessibility State
  const [accessibility, setAccessibility] = useState({
    dyslexic: false,
    sensorySafe: false,
    coPilot: true, // Default enabled
  });

  // Navigation State: 'home' (includes hero + input) | 'results'
  const [view, setView] = useState<'home' | 'results'>('home');
  
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<GroundingData | null>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  const decodeSectionRef = useRef<HTMLDivElement>(null);

  // Load theme preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  const t = translations[language];

  const handleAnalyze = async (
    text: string, 
    useDeepContext: boolean, 
    imageBase64?: string, 
    imageMimeType?: string,
    audioBase64?: string,
    audioMimeType?: string,
    voiceAccent?: string,
    videoBase64?: string,
    videoMimeType?: string
  ) => {
    setIsAnalyzing(true);
    setError(null);
    setNearbyPlaces(null);
    
    // Move to results view immediately to show loading state
    setView('results');

    try {
      const langNameMap: Record<Language, string> = {
          en: 'English', es: 'Spanish', fr: 'French', de: 'German', 
          it: 'Italian', pt: 'Portuguese', ja: 'Japanese'
      };
      
      const data = await analyzeMessageContext(
        text, 
        useDeepContext, 
        langNameMap[language], 
        imageBase64, 
        imageMimeType,
        audioBase64, 
        audioMimeType,
        voiceAccent,
        videoBase64,
        videoMimeType
      );
      setResult(data);

      // --- Safety Check: Get Nearby Resources if Crisis or Concern ---
      if (data.riskLevel === RiskLevel.CRISIS || data.riskLevel === RiskLevel.CONCERN) {
         if ('geolocation' in navigator) {
           navigator.geolocation.getCurrentPosition(async (position) => {
             try {
                // Pass data.riskLevel here to apply strict filtering
                const places = await getNearbySupportPlaces(
                  position.coords.latitude, 
                  position.coords.longitude,
                  data.riskLevel
                );
                setNearbyPlaces(places);
             } catch (geoErr) {
               console.warn("Failed to get nearby places", geoErr);
             }
           }, (err) => {
             console.warn("Geolocation denied or failed", err);
           });
         }
      }

    } catch (err: any) {
      setError(t.error);
      setView('home'); // Go back on error
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setNearbyPlaces(null);
    setView('home');
  };

  const scrollToDecode = () => {
    decodeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Determine Background Colors based on Sensory Mode
  let bgClass = '';
  let textClass = '';
  
  if (accessibility.sensorySafe) {
    // Sensory Safe: Low contrast, calm beige or soft dark grey
    bgClass = theme === 'dark' ? 'bg-sensory-dark text-stone-300' : 'bg-sensory-light text-stone-800';
    textClass = theme === 'dark' ? 'text-stone-300' : 'text-stone-800';
  } else {
    // Normal Mode
    bgClass = theme === 'dark' ? 'bg-[#121212] text-[#E0E0E0]' : 'bg-[#F2F4F8] text-[#1F2937]';
    textClass = theme === 'dark' ? 'text-white' : 'text-stone-900';
  }

  // Dyslexic Font Class
  const fontClass = accessibility.dyslexic ? 'font-dyslexic leading-loose' : 'font-sans';

  // Responsive Container Classes
  const containerClass = `
    min-h-screen transition-colors duration-500 ease-in-out flex flex-col items-center justify-center 
    p-4 md:p-8 lg:p-12
    ${bgClass} ${fontClass}
  `;

  // Responsive Card Classes
  const cardClass = `
    w-full relative flex flex-col transition-all duration-500 overflow-hidden
    ${accessibility.sensorySafe 
       ? (theme === 'dark' ? 'bg-[#1E1E1E] border border-stone-700' : 'bg-[#EAE5D9] border border-[#D6D0C0]') 
       : (theme === 'dark' ? 'bg-[#1E1E1E] shadow-2xl shadow-black/40' : 'bg-white shadow-2xl shadow-stone-200')
    }
    
    /* Mobile Defaults */
    max-w-md rounded-[2.5rem] h-[85vh]
    
    /* Desktop Overrides */
    md:max-w-6xl md:h-auto md:min-h-[85vh] md:rounded-[3rem]
  `;

  return (
    <div className={containerClass}>
      
      {/* Matte Sparkle Animation Styles */}
      <style>{`
        .matte-sparkle {
          background: linear-gradient(
            110deg, 
            #a5b4fc 10%, 
            #f0abfc 30%, 
            #ffffff 50%, 
            #67e8f9 70%, 
            #a5b4fc 90%
          );
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shine 5s linear infinite;
          font-weight: 800;
          filter: drop-shadow(0 4px 6px rgba(167, 139, 250, 0.25));
          text-decoration: none;
          display: inline-block;
        }
        @keyframes shine {
          to {
            background-position: -200% center;
          }
        }
        /* Smart Button Styles */
        .btn-wa-active { display: none; }
        body.extension-active .btn-default { display: none !important; }
        body.extension-active .btn-wa-active { display: inline-flex !important; }
      `}</style>
      
      {/* Theme Toggle (Floating) */}
      <button 
        onClick={toggleTheme}
        className={`fixed top-6 left-6 z-50 p-3 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-[#2C2C2C] text-yellow-400 hover:bg-[#383838]' : 'bg-white text-stone-600 shadow-md hover:bg-stone-50'}`}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Main App Card */}
      <div className={cardClass}>
        
        {/* Header */}
        <div className="flex-none z-10 bg-inherit border-b border-transparent">
           <Header 
            view={view} 
            onBack={view === 'results' ? handleReset : undefined}
            theme={theme}
            language={language}
            onLanguageChange={setLanguage}
            accessibility={accessibility}
            onToggleAccessibility={(key) => setAccessibility(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-y-auto custom-scrollbar px-6 pb-8 md:px-16 md:pb-16 scroll-smooth">
          
          {/* VIEW 1: HOME (Hero + Input stacked) */}
          {view === 'home' && (
            <div className="flex flex-col min-h-full pt-4 md:pt-12">
               
               {/* Main Hero Content */}
               <div className={`flex flex-col md:flex-row items-center justify-between gap-12 mb-24 duration-500 pt-8 max-w-5xl mx-auto w-full ${!accessibility.sensorySafe && 'animate-in fade-in slide-in-from-bottom-4'}`}>
                  
                  {/* Hero Text Side */}
                  <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
                    <div className="mb-6 md:mb-8 w-full">
                        {/* Logo logic remains mostly same, just size adjusted */}
                        <div className="md:hidden mb-6 flex justify-center"><BrainLogo size={80} /></div> 
                        {/* Desktop: Increased size to 240px (1.5x of previous 160ish base) and added salient hover effects */}
                        <div className="hidden md:flex mb-6 -ml-8 transition-transform duration-500 ease-in-out hover:scale-110 hover:rotate-2 cursor-pointer group origin-left">
                           <BrainLogo size={240} className="drop-shadow-sm group-hover:drop-shadow-2xl transition-all duration-500" />
                        </div> 
                        
                        <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight transition-transform duration-300 hover:-translate-y-1 hover:scale-105 cursor-default drop-shadow-sm ${textClass}`}>
                          Neuro-Sense
                        </h1>
                        
                        {/* Staggered Alignment Subtitle with Matte Sparkle Effect */}
                        <div className={`w-full max-w-lg flex flex-col gap-2 md:gap-4 text-lg md:text-2xl lg:text-3xl font-medium leading-relaxed ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                           {t.heroSubtitle.split('. ').map((sent: string, i: number) => {
                             // Dynamic Alignment: Left -> Right -> Center
                             const alignClass = i === 0 ? 'text-left' : (i === 1 ? 'text-right' : 'text-center');
                             
                             // Salience Logic: Highlight specific words
                             const parts = sent.split(' ');
                             
                             return (
                               <span key={i} className={`block ${alignClass}`}>
                                 {parts.map((word, wIdx) => {
                                    const cleanWord = word.replace('.', '').toLowerCase();
                                    const isHighlight = ['decoder', 'tone', 'confidence'].includes(cleanWord);
                                    
                                    // Apply "matte-sparkle" class for special highlights ONLY if not in sensory safe mode
                                    const extraClass = (isHighlight && !accessibility.sensorySafe) ? 'matte-sparkle' : '';

                                    return (
                                      <span key={wIdx} className={extraClass}>
                                        {word}{wIdx < parts.length - 1 ? ' ' : ''}
                                      </span>
                                    );
                                 })}
                                 {i < 2 ? '.' : ''}
                               </span>
                             )
                           })}
                        </div>
                    </div>
                    
                    {/* SMART HERO BUTTON: Replaces default button if extension is active */}
                    <div className="w-full md:w-auto">
                        {/* State A: Default (Install / Get Started) */}
                        <button 
                          onClick={scrollToDecode}
                          className={`
                            btn-default
                            w-full md:w-auto md:px-12 py-4 md:py-5 rounded-2xl font-bold text-lg md:text-xl transition-all flex items-center justify-center gap-3
                            ${accessibility.sensorySafe 
                              ? 'bg-stone-600 text-white border border-stone-500 hover:bg-stone-700' 
                              : 'bg-[#6366F1] hover:bg-[#5558DD] text-white shadow-lg shadow-indigo-500/30 transform hover:scale-[1.02]'
                            }
                          `}
                        >
                          {t.getStarted} <ArrowRight size={20} />
                        </button>

                        {/* State B: Active (Open WhatsApp) - Hidden by default, revealed by CSS */}
                        <a 
                          href="https://web.whatsapp.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`
                            btn-wa-active hidden
                            w-full md:w-auto md:px-12 py-4 md:py-5 rounded-2xl font-bold text-lg md:text-xl transition-all items-center justify-center gap-3
                            bg-[#25D366] hover:bg-[#1da851] text-white shadow-lg shadow-green-500/30 transform hover:scale-[1.02]
                          `}
                        >
                          <MessageCircle size={24} />
                          Open WhatsApp
                        </a>
                    </div>

                  </div>

                  {/* Hero Image Side - HIDDEN IN SENSORY MODE */}
                  {!accessibility.sensorySafe && (
                    <div className="flex-1 flex justify-center w-full max-w-sm md:max-w-md lg:max-w-lg transform md:scale-110 lg:scale-125 transition-all duration-500 hover:scale-[1.3] hover:-translate-y-4 hover:rotate-1 cursor-pointer">
                        <PhoneMockupIllustration className="w-full h-auto drop-shadow-2xl hover:drop-shadow-[0_25px_25px_rgba(0,0,0,0.15)] transition-all duration-500" />
                    </div>
                  )}
               </div>

               {/* Separator / Scroll Indicator - Hidden in Sensory */}
               {!accessibility.sensorySafe && (
                 <div className="flex justify-center mb-16 opacity-20 hidden md:flex">
                   <div className="w-1 h-12 bg-current rounded-full animate-bounce"></div>
                 </div>
               )}

               {/* INPUT SECTION */}
               <div id="decode-section" ref={decodeSectionRef} className={`mb-12 scroll-mt-32 max-w-4xl mx-auto w-full ${!accessibility.sensorySafe && 'animate-in fade-in slide-in-from-bottom-8 duration-700'}`}>
                  <div className="mb-8 md:mb-12 text-center md:text-left">
                    <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${textClass} transition-transform duration-300 hover:scale-105 hover:-translate-y-1 origin-left cursor-default`}>
                       {t.decodeTitle.split(' ').map((word: string, i: number) => {
                          const lower = word.toLowerCase();
                          // Target "intention" specifically to apply matte sparkle and lowercase it
                          if (lower.includes('intention') || lower.includes('intención')) {
                             const styleClass = !accessibility.sensorySafe ? "matte-sparkle lowercase" : "lowercase";
                             return <span key={i} className={`${styleClass} inline-block`}>{lower} </span>
                          }
                          return <span key={i}>{word} </span>
                       })}
                    </h2>
                    <p className={`text-lg md:text-xl ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                      {t.decodeDesc}
                    </p>
                  </div>
                  
                  <InputSection 
                    onAnalyze={handleAnalyze} 
                    isAnalyzing={isAnalyzing} 
                    t={t} 
                    theme={theme}
                    sensorySafe={accessibility.sensorySafe}
                  />
               </div>

               {/* Footer */}
               <Footer theme={theme} t={t} sensorySafe={accessibility.sensorySafe} />
            </div>
          )}

          {/* VIEW 2: RESULTS */}
          {view === 'results' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col pt-8 max-w-5xl mx-auto w-full">
               {isAnalyzing ? (
                 <div className="flex-grow flex flex-col items-center justify-center text-center space-y-8 min-h-[500px]">
                    <div className={`w-24 h-24 border-4 rounded-full ${accessibility.sensorySafe ? 'border-stone-400 border-t-stone-600' : 'border-indigo-500/30 border-t-indigo-500 animate-spin'}`}></div>
                    <div>
                      <h3 className={`text-2xl md:text-3xl font-bold ${textClass}`}>{t.analyzingTitle}</h3>
                      <p className={`mt-3 text-lg ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>{t.analyzingDesc}</p>
                    </div>
                 </div>
               ) : (
                 <AnalysisDashboard 
                   result={result} 
                   nearbyPlaces={nearbyPlaces}
                   onSave={() => {}} 
                   t={t} 
                   theme={theme}
                   sensorySafe={accessibility.sensorySafe}
                 />
               )}
            </div>
          )}

        </div>
        
        {/* Co-Pilot Body Double Avatar (Bottom Left) */}
        {!accessibility.sensorySafe && (
             <BodyDoubleAvatar theme={theme} enabled={accessibility.coPilot} />
        )}

      </div>
    </div>
  );
};

export default App;
