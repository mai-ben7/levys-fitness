"use client";

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Dumbbell, Target, Users, Award, ChevronDown, Menu, X, Star, Play, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image'; // Added Image import

// Advanced text reveal component
const RevealText = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 75 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 75 }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
};

// Staggered container for complex animations
const StaggerContainer = ({ children, staggerDelay = 0.1 }: { children: React.ReactNode; staggerDelay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

// Individual stagger item
const StaggerItem = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 60, scale: 0.95 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: {
            duration: 0.8,
            ease: [0.21, 0.47, 0.32, 0.98]
          }
        },
      }}
    >
      {children}
    </motion.div>
  );
};

// Image with fallback component
const ImageWithFallback = (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [didError, setDidError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = () => {
    console.log('❌ Image failed to load:', props.src);
    setDidError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    console.log('✅ Image loaded successfully:', props.src);
    setIsLoading(false);
  };

  const { src, alt, style, className, ...rest } = props;

  // If image failed to load or is loading, show placeholder
  if (didError || isLoading) {
    return (
      <div
        className={`inline-block bg-gradient-to-br from-primary/10 to-primary/5 text-center align-middle rounded-xl ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full p-8">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-6xl mb-4"
            >
              🏋️‍♂️
            </motion.div>
            <h3 className="text-2xl font-bold text-primary mb-2">אורן לוי</h3>
            <p className="text-muted-foreground">מאמן אישי מקצועי</p>
            {didError && (
              <p className="text-xs text-muted-foreground mt-2">תמונה לא זמינה: {String(src)}</p>
            )}
            {isLoading && (
              <p className="text-xs text-muted-foreground mt-2">טוען תמונה...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      style={style} 
      {...rest} 
      onError={handleError}
      onLoad={handleLoad}
    />
  );
};

// Background video component for hero section
const BackgroundVideo = ({ src, className, ...props }: React.VideoHTMLAttributes<HTMLVideoElement>) => {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleError = () => {
    console.log('❌ Background video failed to load:', src);
    setHasError(true);
  };

  const handleLoadedData = () => {
    console.log('✅ Background video loaded successfully:', src);
  };

  // Show fallback if video failed to load
  if (hasError) {
    return (
      <div className={`w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={src}
      className={`w-full h-full object-cover ${className}`}
      onError={handleError}
      onLoadedData={handleLoadedData}
      {...props}
    />
  );
};

// Video component with fallback
const VideoWithFallback = ({ src, poster, className, ...props }: React.VideoHTMLAttributes<HTMLVideoElement>) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };
  const handleLoadedData = () => setIsLoading(false);

  const togglePlay = () => {
    if (videoRef.current && !hasError) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  // Show placeholder if video failed to load or is loading
  if (hasError || isLoading) {
    return (
      <div className={`relative group cursor-pointer ${className}`}>
        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center p-8">
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🎥
            </motion.div>
            <h3 className="text-2xl font-bold text-primary mb-2">סרטון אימון</h3>
            <p className="text-muted-foreground mb-4">אורן לוי מדגים טכניקות אימון</p>
            {hasError && (
              <p className="text-xs text-muted-foreground">סרטון לא זמין</p>
            )}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg inline-block mt-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="h-8 w-8 text-primary ml-1" fill="currentColor" />
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group cursor-pointer ${className}`} onClick={togglePlay}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover rounded-xl"
        onPlay={handlePlay}
        onPause={handlePause}
        onError={handleError}
        onLoadedData={handleLoadedData}
        {...props}
      />
      
      {/* Play overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-xl group-hover:bg-black/40 transition-all duration-300">
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="h-8 w-8 text-primary ml-1" fill="currentColor" />
          </motion.div>
        </div>
      )}
      
      {/* Video controls overlay */}
      {isPlaying && (
        <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-xl">
          <div className="flex items-center justify-between text-white">
            <span className="text-sm font-medium">אורן לוי - אימון אישי</span>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-sm rounded-full p-2"
              suppressHydrationWarning
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const { scrollYProgress: servicesProgress } = useScroll({
    target: servicesRef,
    offset: ["start end", "end start"]
  });

  // Simple scroll-based opacity for smooth transitions
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const textOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);

  // Navigation scroll effect
  const navOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background overflow-x-hidden" dir="rtl" suppressHydrationWarning>
      {/* Advanced Navigation */}
      <motion.nav 
        className="fixed top-0 w-full z-50 backdrop-blur-xl bg-background/70 border-b border-border/50"
        style={{ opacity: navOpacity }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Dumbbell className="h-8 w-8 text-primary" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent">
              פיט פרו עילית
            </span>
          </motion.div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { name: 'בית', href: 'home' },
              { name: 'שירותים', href: 'services' },
              { name: 'אודות', href: 'about' },
              { name: 'תוצאות', href: 'results' },
              { name: 'צור קשר', href: 'contact' }
            ].map((item, index) => (
              <motion.a
                key={item.name}
                href={`#${item.href}`}
                className="text-foreground hover:text-primary transition-colors relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
                <motion.div
                  className="absolute -bottom-1 right-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all"
                  whileHover={{ width: "100%" }}
                />
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
            type="button"
            suppressHydrationWarning
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div 
          className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/50"
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isMenuOpen ? 'auto' : 0, 
            opacity: isMenuOpen ? 1 : 0 
          }}
          transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          style={{ overflow: 'hidden' }}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {[
              { name: 'בית', href: 'home' },
              { name: 'שירותים', href: 'services' },
              { name: 'אודות', href: 'about' },
              { name: 'תוצאות', href: 'results' },
              { name: 'צור קשר', href: 'contact' }
            ].map((item, index) => (
              <motion.a
                key={item.name}
                href={`#${item.href}`}
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: isMenuOpen ? 1 : 0, 
                  x: isMenuOpen ? 0 : 20 
                }}
                transition={{ delay: index * 0.1 }}
              >
                {item.name}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.nav>

      {/* Hero Section with Advanced Parallax */}
      <section ref={heroRef} id="home" className="relative min-h-screen flex items-end justify-center overflow-hidden pb-8">
        {/* Video Background */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ 
            opacity: heroOpacity 
          }}
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <BackgroundVideo
            src="/videos/oren-levy-training.mp4"
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            controls={false}
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </motion.div>

        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400/30 rounded-full"
            style={{
              right: `${20 + i * 15}%`,
              top: `${20 + i * 8}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
        
        <motion.div 
          className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
          style={{ opacity: textOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="mb-8"
          >
            <motion.h1 
              className="text-5xl md:text-8xl mb-6 font-bold"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <motion.span 
                className="block"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                שנה את
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-l from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                הגבולות שלך
              </motion.span>
            </motion.h1>
          </motion.div>
          
          <motion.p 
            className="text-xl md:text-3xl mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            אימון אישי מקצועי ברמה עילית שדוחף גבולות ומספק 
            <motion.span 
              className="text-yellow-400 font-semibold"
              animate={{ textShadow: ["0 0 0px #facc15", "0 0 20px #facc15", "0 0 0px #facc15"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {" "}תוצאות יוצאות דופן
            </motion.span>
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button className="blob-btn text-lg px-8 py-4" suppressHydrationWarning>
                <Play className="ml-2 h-5 w-5 inline" />
                התחל את המסע שלך
                <span className="blob-btn__inner">
                  <span className="blob-btn__blobs">
                    <span className="blob-btn__blob"></span>
                    <span className="blob-btn__blob"></span>
                    <span className="blob-btn__blob"></span>
                    <span className="blob-btn__blob"></span>
                  </span>
                </span>
              </button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-black text-lg px-8 py-4 rounded-full backdrop-blur-sm bg-black/20 shadow-lg" 
                onClick={() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })}
                suppressHydrationWarning
              >
                צפה בסיפורי הצלחה
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
          >
            {[
              { number: "500+", label: "חיים ששונו" },
              { number: "95%", label: "הגשמת יעדים" },
              { number: "8+", label: "שנות ניסיון" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.2 + index * 0.2 }}
              >
                <motion.div 
                  className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-sm md:text-base text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ 
            y: [0, 15, 0],
            opacity: 1
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            delay: 3
          }}
          initial={{ opacity: 0 }}
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          whileHover={{ scale: 1.2, y: 20 }}
        >
          <ChevronDown className="h-10 w-10 text-white/70" />
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left side - Content */}
            <RevealText delay={0.4}>
              <div className="space-y-8">
                <motion.div
                  className="inline-block"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-sm px-4 py-2">
                    אודות פיט פרו עילית
                  </Badge>
                </motion.div>
                <div className="space-y-8">
                  <div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                      קצת עליי
                    </h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      מאמן כושר מוסמך מבוסס מדע, מתחרה נינג'ה ישראל, ובעל ערוץ הכושר הגדול בישראל
                    </p>
                  </div>



                  {/* Main Content */}
                  <div className="space-y-6">
                    <div className="bg-muted/30 rounded-xl p-6">
                      <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                        <span className="text-3xl">🎯</span>
                        הפילוסופיה שלי
                      </h3>
                      <p className="text-lg leading-relaxed text-muted-foreground">
                        כנות היא הערך החשוב ביותר עבורי. אני לא מוכר קיצורי דרך או תוספים לא מבוססים. 
                        אני מאמין בעבודה קשה וחכמה, אבל מהנה ומקצועית.
                      </p>
                    </div>

                    <div className="bg-muted/30 rounded-xl p-6">
                      <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                        <span className="text-3xl">🧠</span>
                        הגישה המדעית
                      </h3>
                      <p className="text-lg leading-relaxed text-muted-foreground">
                        אני לא רק מלמד איך לעשות, אלא גם למה. כל תוכנית מבוססת על מחקרים מדעיים עדכניים 
                        ומתמקדת בהבנה עמוקה של האנטומיה והפיזיולוגיה.
                      </p>
                    </div>

                    <div className="bg-muted/30 rounded-xl p-6">
                      <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                        <span className="text-3xl">💪</span>
                        הסיפור שלי
                      </h3>
                      <p className="text-lg leading-relaxed text-muted-foreground">
                        כשהתחלתי, הייתי מתוסכל מחוסר הידע. אף אחד לא הסביר לי על איזה שרירים אני עובד, 
                        כמה חזרות לעשות, או למה זה חשוב. היום אני נותן לכם את כל המידע הזה.
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
                      <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                        <span className="text-3xl">🚀</span>
                        ההזדמנות שלך
                      </h3>
                      <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                        אין יום שאני לא לומד אנטומיה וקורא מחקרים. היום הכל מסוכם וזמין עבורכם.
                      </p>
                      <p className="text-lg font-semibold text-primary">
                        אתם בידיים הטובות ביותר. הגיע הזמן להיות הגוגל של עצמכם!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealText>

            {/* Right side - Image */}
            <RevealText delay={0.2}>
              <div className="flex justify-center lg:justify-end">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-8 flex items-center justify-center overflow-hidden">
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                      <ImageWithFallback
                        src="/images/oren-levy.png"
                        alt="Oren Levy - Personal Trainer"
                        className="w-full h-full object-cover rounded-xl"
                        style={{
                          backgroundImage: "linear-gradient(45deg, rgba(0,0,0,0.1), rgba(0,0,0,0.05))"
                        }}
                      />
                      
                      {/* Professional overlay with name */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                        <h3 className="text-white text-2xl font-bold mb-1">אורן לוי</h3>
                        <p className="text-white/90 text-sm">מאמן אישי מקצועי</p>
                      </div>
                    </div>
                    
                    {/* Certification badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-primary">מוסמך</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-4 h-4 bg-primary/30 rounded-full"
                      style={{
                        top: `${20 + i * 20}%`,
                        right: `${10 + i * 15}%`,
                      }}
                      animate={{
                        y: [-10, 10, -10],
                        x: [-5, 5, -5],
                        opacity: [0.3, 0.7, 0.3],
                      }}
                      transition={{
                        duration: 2 + i,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.5,
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            </RevealText>
          </div>
        </div>
      </section>



      {/* Services Section */}
      <section ref={servicesRef} id="services" className="py-32 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <RevealText delay={0.2}>
            <div className="text-center mb-20">
              <motion.div
                className="inline-block mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Badge className="bg-yellow-400/10 text-yellow-600 border-yellow-400/20 text-sm px-4 py-2">
                  תוכניות אימונים מתקדמות
                </Badge>
              </motion.div>
              <h2 className="text-4xl md:text-7xl mb-6 font-bold bg-gradient-to-l from-foreground to-foreground/70 bg-clip-text text-transparent">
                שירותים מתמחים
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                פתרונות כושר מתקדמים המיועדים לפתוח את הפוטנציאל המלא שלך
              </p>
            </div>
          </RevealText>
          
          <StaggerContainer staggerDelay={0.15}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Target,
                  title: "אימון אישי עילית 1:1",
                  description: "אימונים אישיים עם ניתוח ביו-מכני מתקדם ותיקון תנוחה בזמן אמת.",
                  price: "₪450/אימון",
                  features: ["ניתוח תנועה", "תזונה מותאמת", "תמיכה 24/7"],
                  gradient: "from-blue-500 to-purple-600"
                },
                {
                  icon: Users,
                  title: "דינמיקת קבוצות קטנות",
                  description: "אימוני קבוצה אנרגטיים עם מקסימום 4 אנשים לתשומת לב ומוטיבציה מיטבית.",
                  price: "₪170/אימון",
                  features: ["מוטיבציה קבוצתית", "יתרון תחרותי", "תמיכה חברתית"],
                  gradient: "from-green-500 to-teal-600"
                },
                {
                  icon: Dumbbell,
                  title: "כוח ועצמה",
                  description: "אימוני כוח מתקדמים והרמת משקולות עם תכנות ברמת תחרויות.",
                  price: "₪380/אימון",
                  features: ["הרמות אולימפיות", "כוח מתקדם", "ביצועים אתלטיים"],
                  gradient: "from-red-500 to-orange-600"
                }
              ].map((service, index) => (
                <StaggerItem key={index}>
                  <motion.div
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 5,
                      rotateX: 5,
                    }}
                    className="group perspective-1000"
                  >
                    <Card className="h-full border-0 shadow-2xl bg-gradient-to-br from-card to-card/80 backdrop-blur-sm overflow-hidden relative transition-all duration-300 hover:shadow-2xl">
                      <CardContent className="p-8 relative z-10">
                        <motion.div
                          className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.gradient} mb-6 transition-all duration-300 group-hover:scale-105 group-hover:rotate-2`}
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <service.icon className="h-8 w-8 text-white" />
                        </motion.div>
                        
                        <h3 className="text-2xl mb-4 font-bold text-right transition-all duration-300 group-hover:text-primary/80">{service.title}</h3>
                        <p className="text-muted-foreground mb-6 leading-relaxed text-right transition-all duration-300 group-hover:text-foreground/90">
                          {service.description}
                        </p>
                        
                        <div className="space-y-3 mb-6">
                          {service.features.map((feature, featureIndex) => (
                            <motion.div
                              key={featureIndex}
                              className="flex items-center gap-3 justify-end transition-all duration-300 group-hover:translate-x-1"
                              initial={{ opacity: 0, x: 20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: featureIndex * 0.1 }}
                            >
                              <span className="text-sm transition-all duration-300 group-hover:text-primary/70 group-hover:font-medium">{feature}</span>
                              <CheckCircle className="h-4 w-4 text-green-500 transition-all duration-300 group-hover:scale-110 group-hover:text-green-400/80" />
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 transition-all duration-300 group-hover:text-primary/80 group-hover:bg-primary/5" suppressHydrationWarning>
                              ← למד עוד
                            </Button>
                          </motion.div>
                          <Badge 
                            variant="outline" 
                            className={`text-lg px-4 py-2 bg-gradient-to-l ${service.gradient} text-white border-0 transition-all duration-300 group-hover:scale-102 group-hover:shadow-md`}
                          >
                            {service.price}
                          </Badge>
                        </div>
                      </CardContent>
                      
                      {/* Hover glow effect based on card color - reduced intensity */}
                      <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none ${
                        service.gradient.includes('blue') ? 'bg-blue-500' :
                        service.gradient.includes('purple') ? 'bg-purple-500' :
                        service.gradient.includes('green') ? 'bg-green-500' :
                        service.gradient.includes('teal') ? 'bg-teal-500' :
                        service.gradient.includes('red') ? 'bg-red-500' :
                        service.gradient.includes('orange') ? 'bg-orange-500' : 'bg-primary'
                      }`} />
                      
                      {/* Animated border effect - reduced intensity */}
                      <div className={`absolute inset-0 rounded-lg border border-transparent group-hover:border-current transition-all duration-300 pointer-events-none ${
                        service.gradient.includes('blue') ? 'text-blue-500' :
                        service.gradient.includes('purple') ? 'text-purple-500' :
                        service.gradient.includes('green') ? 'text-green-500' :
                        service.gradient.includes('teal') ? 'text-teal-500' :
                        service.gradient.includes('red') ? 'text-red-500' :
                        service.gradient.includes('orange') ? 'text-orange-500' : 'text-primary'
                      } opacity-0 group-hover:opacity-20`} />
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-32 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <RevealText>
            <div className="text-center mb-20">
              <motion.div
                className="inline-block mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-sm px-4 py-2">
                  תוצאות אמיתיות
                </Badge>
              </motion.div>
              <h2 className="text-4xl md:text-7xl mb-6 font-bold">
                סיפורי הצלחה
                <span className="block text-primary">שמשנים חיים</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                גלה איך לקוחותינו השיגו את המטרות שלהם והשיגו את הגוף שתמיד רצו
              </p>
            </div>
          </RevealText>
          
          <StaggerContainer staggerDelay={0.2}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "דוד כהן",
                  age: 35,
                  result: "ירד 25 קילו ב-6 חודשים",
                  image: "👨‍💼",
                  rating: 5,
                  review: "האימונים שינו לי את החיים. הרגשתי טוב יותר מאי פעם!"
                },
                {
                  name: "שרה לוי",
                  age: 28,
                  result: "השיגה גוף חטוב ושרירי",
                  image: "👩‍💼",
                  rating: 5,
                  review: "תוכנית האימון הייתה מושלמת בשבילי. התוצאות מדברות בעד עצמן!"
                },
                {
                  name: "יוסי גולדברג",
                  age: 42,
                  result: "שיפר ביצועים אתלטיים",
                  image: "👨‍💼",
                  rating: 5,
                  review: "האימונים הביאו אותי לרמה שלא האמנתי שאגיע אליה!"
                }
              ].map((testimonial, index) => (
                <StaggerItem key={index}>
                  <motion.div
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 5,
                    }}
                    className="group"
                  >
                    <Card className="h-full border-0 shadow-2xl bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
                      <CardContent className="p-8">
                        <div className="text-center mb-6">
                          <motion.div
                            className="text-6xl mb-4"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                          >
                            {testimonial.image}
                          </motion.div>
                          <h3 className="text-xl font-bold mb-1">{testimonial.name}</h3>
                          <p className="text-muted-foreground text-sm mb-2">{testimonial.age} שנים</p>
                          <div className="flex justify-center gap-1 mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        
                        <div className="text-center mb-6">
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/20 mb-4">
                            {testimonial.result}
                          </Badge>
                          <p className="text-muted-foreground text-right leading-relaxed">
                            "{testimonial.review}"
                          </p>
                        </div>
                        
                        <motion.div
                          className="text-center"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button variant="outline" size="sm" className="text-primary hover:bg-primary/10" suppressHydrationWarning>
                            ← קרא עוד
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[
            { top: 18, left: 88, color1: '#3b82f6', color2: '#1d4ed8' },
            { top: 13, left: 7, color1: '#8b5cf6', color2: '#7c3aed' },
            { top: 89, left: 70, color1: '#ec4899', color2: '#db2777' },
            { top: 78, left: 9, color1: '#f59e0b', color2: '#d97706' },
            { top: 32, left: 89, color1: '#3b82f6', color2: '#1d4ed8' },
            { top: 47, left: 50, color1: '#8b5cf6', color2: '#7c3aed' },
            { top: 28, left: 1, color1: '#ec4899', color2: '#db2777' },
            { top: 82, left: 4, color1: '#f59e0b', color2: '#d97706' }
          ].map((element, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 rounded-full opacity-10"
              style={{
                background: `linear-gradient(45deg, ${element.color1}, ${element.color2})`,
                top: `${element.top}%`,
                left: `${element.left}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <RevealText>
            <div className="text-center mb-20">
              <motion.div
                className="inline-block mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 text-sm px-6 py-3 shadow-lg">
                  🚀 התחל את המסע שלך
                </Badge>
              </motion.div>
              <h2 className="text-4xl md:text-6xl mb-6 font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                מוכן להתחיל את
                <span className="block">השינוי שלך?</span>
              </h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
                עשה את הצעד הראשון להפוך לגרסה הטובה ביותר של עצמך
              </p>
            </div>
          </RevealText>
          
          <div className="grid lg:grid-cols-2 gap-16">
            <RevealText delay={0.2}>
              <div className="space-y-8 order-2 lg:order-1">
                <h3 className="text-3xl font-bold text-right bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  קבל את מפגש האסטרטגיה החינמי שלך
                </h3>
                
                <div className="space-y-6">
                  {[
                    { icon: "🎯", title: "הערכת יעדים", desc: "הגדרת המטרות הכושר שלך ויצירת מפת דרכים", color: "from-blue-500 to-blue-600" },
                    { icon: "📊", title: "ניתוח הרכב גוף", desc: "הערכת בריאות וכושר מלאה", color: "from-purple-500 to-purple-600" },
                    { icon: "🏋️", title: "תצוגה מקדימה של תוכנית מותאמת", desc: "ראה בדיוק איך נשיג את המטרות שלך", color: "from-pink-500 to-pink-600" },
                    { icon: "💡", title: "הדרכת תזונה", desc: "מפגש אסטרטגיית תזונה אישית", color: "from-orange-500 to-orange-600" }
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      className={`flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-r ${benefit.color} text-white shadow-lg border-0`}
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, x: -10, rotateY: 5 }}
                    >
                      <div className="flex-1">
                        <h4 className="font-bold mb-2 text-right text-lg">{benefit.title}</h4>
                        <p className="text-white/90 text-sm text-right leading-relaxed">{benefit.desc}</p>
                      </div>
                      <div className="text-3xl bg-white/20 rounded-full p-3 backdrop-blur-sm">
                        {benefit.icon}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 rounded-2xl border-0 shadow-2xl text-white"
                  whileHover={{ scale: 1.02, rotateY: 5 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">⚡</span>
                    <h4 className="font-bold text-xl">הצעה מוגבלת בזמן</h4>
                  </div>
                  <p className="text-white/95 text-right leading-relaxed">
                    הזמן את הייעוץ החינמי שלך החודש וקבל מדריך תזונה חינמי 
                    בשווי ₪365.
                  </p>
                  <div className="mt-4 text-center">
                    <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                      🎁 מתנה חינמית
                    </Badge>
                  </div>
                </motion.div>
              </div>
            </RevealText>
            
            <RevealText delay={0.4}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="order-1 lg:order-2"
              >
                <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-blue-50 to-purple-50 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <motion.div
                        className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <span className="text-2xl text-white">📝</span>
                      </motion.div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        הזמן את המפגש החינמי שלך
                      </h3>
                    </div>
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-2 font-semibold text-right text-gray-700">שם פרטי</label>
                          <motion.div whileFocus={{ scale: 1.02 }}>
                            <Input 
                              placeholder="יוחנן" 
                              className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-right bg-white/80 backdrop-blur-sm" 
                              suppressHydrationWarning 
                            />
                          </motion.div>
                        </div>
                        <div>
                          <label className="block mb-2 font-semibold text-right text-gray-700">שם משפחה</label>
                          <motion.div whileFocus={{ scale: 1.02 }}>
                            <Input 
                              placeholder="כהן" 
                              className="border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-right bg-white/80 backdrop-blur-sm" 
                              suppressHydrationWarning 
                            />
                          </motion.div>
                        </div>
                      </div>
                      <div>
                        <label className="block mb-2 font-semibold text-right text-gray-700">אימייל</label>
                        <motion.div whileFocus={{ scale: 1.02 }}>
                          <Input 
                            type="email" 
                            placeholder="yohanan@example.com" 
                            className="border-2 border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-right bg-white/80 backdrop-blur-sm" 
                            suppressHydrationWarning 
                          />
                        </motion.div>
                      </div>
                      <div>
                        <label className="block mb-2 font-semibold text-right text-gray-700">טלפון</label>
                        <motion.div whileFocus={{ scale: 1.02 }}>
                          <Input 
                            type="tel" 
                            placeholder="050-123-4567" 
                            className="border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-right bg-white/80 backdrop-blur-sm" 
                            suppressHydrationWarning 
                          />
                        </motion.div>
                      </div>
                      <div>
                        <label className="block mb-2 font-semibold text-right text-gray-700">המטרות שלך בכושר</label>
                        <motion.div whileFocus={{ scale: 1.02 }}>
                          <Textarea 
                            placeholder="ספר לי על המטרות שלך בכושר ומה שברצונך להשיג..."
                            rows={4}
                            className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-right bg-white/80 backdrop-blur-sm"
                            suppressHydrationWarning
                          />
                        </motion.div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-lg py-6 rounded-2xl shadow-2xl border-0 font-bold" 
                          suppressHydrationWarning
                        >
                          <span className="mr-2">🚀</span>
                          הזמן את המפגש החינמי שלי
                          <span className="ml-2">⚡</span>
                        </Button>
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </RevealText>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.div 
              className="flex items-center justify-center gap-3 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-2xl font-bold">פיט פרו עילית</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Dumbbell className="h-8 w-8" />
              </motion.div>
            </motion.div>
            <p className="text-primary-foreground/80 mb-4">
              שנה את הגוף שלך. שנה את החיים שלך. שנה את העתיד שלך.
            </p>
            <p className="text-primary-foreground/60 text-sm">
              © 2025 פיט פרו עילית. כל הזכויות שמורות.
            </p>
          </div>
        </div>
      </footer>
      
      {/* SVG Filter for Blob Button Animation */}
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" result="goo"></feColorMatrix>
            <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
