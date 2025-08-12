import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Badge } from './components/ui/badge';
import { Dumbbell, Target, Users, Award, ChevronDown, Menu, X, Star, Play, CheckCircle, ArrowLeft } from 'lucide-react';

// Advanced text reveal component
const RevealText = ({ children, delay = 0 }) => {
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
const StaggerContainer = ({ children, staggerDelay = 0.1 }) => {
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
const StaggerItem = ({ children, className = "" }) => {
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

export default function App() {
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

  // Complex parallax transformations
  const heroY = useTransform(heroProgress, [0, 1], [0, -400]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.2]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);
  
  const textY = useTransform(heroProgress, [0, 1], [0, -200]);
  const textOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);
  
  // Services section animations
  const servicesY = useTransform(servicesProgress, [0, 1], [100, -100]);
  const servicesRotate = useTransform(servicesProgress, [0, 1], [0, 5]);

  // Navigation scroll effect
  const navY = useTransform(scrollYProgress, [0, 0.1], [-100, 0]);
  const navOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-x-hidden" dir="rtl">
      {/* Advanced Navigation */}
      <motion.nav 
        className="fixed top-0 w-full z-50 backdrop-blur-xl bg-background/70 border-b border-border/50"
        style={{ y: navY, opacity: navOpacity }}
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
      <section ref={heroRef} id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ 
            y: heroY, 
            scale: heroScale,
            opacity: heroOpacity 
          }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="רקע חדר כושר"
            className="w-full h-full object-cover"
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"
            animate={{ 
              background: [
                "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.4), rgba(0,0,0,0.7))",
                "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3), rgba(0,0,0,0.8))",
                "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.4), rgba(0,0,0,0.7))"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400/30 rounded-full"
            style={{
              right: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
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
          style={{ y: textY, opacity: textOpacity }}
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
              <Button size="lg" className="bg-gradient-to-l from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 text-lg px-8 py-4 rounded-full shadow-2xl">
                <Play className="ml-2 h-5 w-5" />
                התחל את המסע שלך
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black text-lg px-8 py-4 rounded-full backdrop-blur-sm">
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
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          <ChevronDown className="h-10 w-10 text-white/70" />
        </motion.div>
      </section>

      {/* Services Section with Advanced Animations */}
      <section ref={servicesRef} id="services" className="py-32 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
        {/* Background pattern */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{ y: servicesY, rotate: servicesRotate }}
        >
          <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#000_1px,_transparent_1px)] bg-[length:50px_50px]" />
        </motion.div>

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
                },
                {
                  icon: Award,
                  title: "מאסטר תזונה",
                  description: "הדרכת תזונה מקיפה עם תכנון ארוחות ואופטימיזציה מטבולית.",
                  price: "₪280/אימון",
                  features: ["תכנון ארוחות", "מעקב מאקרו", "מדריך תוספים"],
                  gradient: "from-yellow-500 to-amber-600"
                },
                {
                  icon: Target,
                  title: "שינוי מבנה הגוף",
                  description: "תוכניות שינוי מבנה הגוף המלא עם תוצאות מובטחות או החזר כספי.",
                  price: "₪420/אימון",
                  features: ["הרכב גוף", "מעקב התקדמות", "אחריות"],
                  gradient: "from-pink-500 to-rose-600"
                },
                {
                  icon: Users,
                  title: "אימון וירטואלי",
                  description: "אימונים מקוונים בשידור חי עם משוב בזמן אמת ותיקון תנוחה.",
                  price: "₪230/אימון",
                  features: ["אימונים חיים", "ניתוח תנוחה", "לוח זמנים גמיש"],
                  gradient: "from-indigo-500 to-blue-600"
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
                    <Card className="h-full border-0 shadow-2xl bg-gradient-to-br from-card to-card/80 backdrop-blur-sm overflow-hidden relative">
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                      />
                      <CardContent className="p-8 relative z-10">
                        <motion.div
                          className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.gradient} mb-6`}
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <service.icon className="h-8 w-8 text-white" />
                        </motion.div>
                        
                        <h3 className="text-2xl mb-4 font-bold text-right">{service.title}</h3>
                        <p className="text-muted-foreground mb-6 leading-relaxed text-right">
                          {service.description}
                        </p>
                        
                        <div className="space-y-3 mb-6">
                          {service.features.map((feature, featureIndex) => (
                            <motion.div
                              key={featureIndex}
                              className="flex items-center gap-3 justify-end"
                              initial={{ opacity: 0, x: 20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: featureIndex * 0.1 }}
                            >
                              <span className="text-sm">{feature}</span>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                              ← למד עוד
                            </Button>
                          </motion.div>
                          <Badge 
                            variant="outline" 
                            className={`text-lg px-4 py-2 bg-gradient-to-l ${service.gradient} text-white border-0`}
                          >
                            {service.price}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* About Section with Split Screen Effect */}
      <section id="about" className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <RevealText>
              <div className="space-y-8 order-2 lg:order-1">
                <div>
                  <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                    מאמן מומחה ומנטור
                  </Badge>
                  <h2 className="text-4xl md:text-6xl mb-6 font-bold text-right">
                    פגש את 
                    <span className="block text-primary">מדריך השינוי שלך</span>
                  </h2>
                </div>
                
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed text-right">
                  <p>
                    עם למעלה מ-8 שנות ניסיון באימונים ברמה עלית, הקדשתי את חיי 
                    לשליטה במדע הביצועים האנושיים והשינוי. הגישה שלי משלבת מדע התרגול 
                    המתקדם ביותר עם מתודולוגיות אימון אישיות.
                  </p>
                  <p>
                    כל לקוח מקבל תוכנית מותאמת אישית לחלוטין המבוססת על הפיזיולוגיה, 
                    היעדים ואורח החיים הייחודיים שלו. אני מאמין בדחיפת גבולות תוך 
                    שמירה על טכניקה מושלמת והתקדמות בת קיימא.
                  </p>
                </div>

                <StaggerContainer staggerDelay={0.1}>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      'מאמן מוסמך ACSM',
                      'מומחה עילית NASM', 
                      'מאמן הרמות אולימפיות',
                      'מומחה תזונה'
                    ].map((cert, index) => (
                      <StaggerItem key={index}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="bg-gradient-to-l from-primary/10 to-primary/5 p-4 rounded-xl border border-primary/20"
                        >
                          <div className="flex items-center gap-3 justify-end">
                            <span className="font-medium">{cert}</span>
                            <Star className="h-5 w-5 text-primary" />
                          </div>
                        </motion.div>
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerContainer>

                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="bg-gradient-to-l from-primary to-primary/80 text-primary-foreground">
                    הזמן ייעוץ חינם
                  </Button>
                </motion.div>
              </div>
            </RevealText>
            
            <RevealText delay={0.3}>
              <motion.div 
                className="relative order-1 lg:order-2"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-l from-primary/20 to-primary/10 rounded-3xl blur-xl"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                    alt="מאמן אישי"
                    className="w-full h-[600px] object-cover"
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  />
                  
                  {/* Floating achievement badges */}
                  <motion.div
                    className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-full p-3"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Award className="h-6 w-6 text-yellow-500" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 text-right"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  >
                    <div className="text-2xl font-bold text-primary">500+</div>
                    <div className="text-sm text-muted-foreground">סיפורי הצלחה</div>
                  </motion.div>
                </div>
              </motion.div>
            </RevealText>
          </div>
        </div>
      </section>

      {/* Results/Testimonials Section */}
      <section id="results" className="py-32 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <RevealText>
            <div className="text-center mb-20">
              <Badge className="bg-green-100 text-green-700 border-green-200 mb-4">
                תוצאות מוכחות
              </Badge>
              <h2 className="text-4xl md:text-6xl mb-6 font-bold">
                אנשים אמיתיים, 
                <span className="block text-green-600">שינויים אמיתיים</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                צפו במסעות המדהימים של לקוחות שבחרו לשנות את חייהם
              </p>
            </div>
          </RevealText>
          
          <StaggerContainer staggerDelay={0.2}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "שרה כהן",
                  result: "ירדה 16 ק״ג ב-4 חודשים",
                  testimonial: "הגישה האישית והתמיכה הבלתי פוסקת עזרו לי להשיג מה שחשבתי שבלתי אפשרי. אני חזקה ובטוחה יותר מתמיד.",
                  image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=387&q=80",
                  before: "84 ק״ג",
                  after: "68 ק״ג",
                  stats: ["16 ק״ג ירידה", "25% פחות שומן", "כוח כפול"]
                },
                {
                  name: "מיכאל לוי",
                  result: "הוסיף 9 ק״ג שריר טהור",
                  testimonial: "תוכנית הכוח הייתה בדיוק מה שהייתי צריך. תשומת הלב לטכניקה והעמסה הדרגתית הביאו תוצאות מעבר לציפיות.",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=387&q=80",
                  before: "73 ק״ג",
                  after: "82 ק״ג",
                  stats: ["9 ק״ג שריר", "40% עלייה בכוח", "12% שומן גוף"],
                  gradient: "from-green-500 to-teal-600"
                },
                {
                  name: "רונית דוד",
                  result: "מוכנה למרתון ב-8 חודשים",
                  testimonial: "מהתקשות לרוץ קילומטר אחד לסיום המרתון הראשון שלי. תוכנית האימון המובנית והמוטיבציה שינו את המשחק.",
                  image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
                  before: "1 ק״מ מקסימום",
                  after: "42.2 ק״מ",
                  stats: ["מרתון הושלם", "5 דק׳ מהיר יותר לק״מ", "50% עליה בסיבולת"]
                }
              ].map((testimonial, index) => (
                <StaggerItem key={index}>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="group"
                  >
                    <Card className="h-full border-0 shadow-xl bg-gradient-to-br from-card to-card/90 overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ImageWithFallback
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-full h-48 object-cover"
                            />
                          </motion.div>
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          />
                          <motion.div
                            className="absolute top-4 left-4"
                            whileHover={{ scale: 1.1, rotate: 10 }}
                          >
                            <Badge className="bg-green-500 text-white border-0">
                              סיפור הצלחה
                            </Badge>
                          </motion.div>
                        </div>
                        
                        <div className="p-6">
                          <div className="text-center mb-4">
                            <h3 className="text-xl font-bold mb-1">{testimonial.name}</h3>
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              {testimonial.result}
                            </Badge>
                          </div>
                          
                          <blockquote className="text-muted-foreground italic mb-6 leading-relaxed text-right">
                            "{testimonial.testimonial}"
                          </blockquote>
                          
                          <div className="space-y-2">
                            {testimonial.stats.map((stat, statIndex) => (
                              <motion.div
                                key={statIndex}
                                className="flex items-center gap-2 text-sm justify-end"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: statIndex * 0.1 }}
                              >
                                <span>{stat}</span>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </motion.div>
                            ))}
                          </div>
                        </div>
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
      <section id="contact" className="py-32 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <RevealText>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl mb-6 font-bold">
                מוכן להתחיל את
                <span className="block text-primary">השינוי שלך?</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                עשה את הצעד הראשון להפוך לגרסה הטובה ביותר של עצמך
              </p>
            </div>
          </RevealText>
          
          <div className="grid lg:grid-cols-2 gap-16">
            <RevealText delay={0.2}>
              <div className="space-y-8 order-2 lg:order-1">
                <h3 className="text-2xl font-bold text-right">קבל את מפגש האסטרטגיה החינמי שלך</h3>
                
                <div className="space-y-6">
                  {[
                    { icon: "🎯", title: "הערכת יעדים", desc: "הגדרת המטרות הכושר שלך ויצירת מפת דרכים" },
                    { icon: "📊", title: "ניתוח הרכב גוף", desc: "הערכת בריאות וכושר מלאה" },
                    { icon: "🏋️", title: "תצוגה מקדימה של תוכנית מותאמת", desc: "ראה בדיוק איך נשיג את המטרות שלך" },
                    { icon: "💡", title: "הדרכת תזונה", desc: "מפגש אסטרטגיית תזונה אישית" }
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50"
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: -10 }}
                    >
                      <div>
                        <h4 className="font-semibold mb-1 text-right">{benefit.title}</h4>
                        <p className="text-muted-foreground text-sm text-right">{benefit.desc}</p>
                      </div>
                      <div className="text-2xl">{benefit.icon}</div>
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  className="bg-gradient-to-l from-primary/10 to-primary/5 p-6 rounded-xl border border-primary/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-bold mb-2 text-primary text-right">הצעה מוגבלת בזמן</h4>
                  <p className="text-muted-foreground text-right">
                    הזמן את הייעוץ החינמי שלך החודש וקבל מדריך תזונה חינמי 
                    בשווי ₪365.
                  </p>
                </motion.div>
              </div>
            </RevealText>
            
            <RevealText delay={0.4}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="order-1 lg:order-2"
              >
                <Card className="shadow-2xl border-0 bg-gradient-to-br from-card to-card/80">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6 text-center">הזמן את המפגש החינמי שלך</h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-2 font-medium text-right">שם פרטי</label>
                          <motion.div whileFocus={{ scale: 1.02 }}>
                            <Input placeholder="יוחנן" className="border-2 border-border/50 focus:border-primary text-right" />
                          </motion.div>
                        </div>
                        <div>
                          <label className="block mb-2 font-medium text-right">שם משפחה</label>
                          <motion.div whileFocus={{ scale: 1.02 }}>
                            <Input placeholder="כהן" className="border-2 border-border/50 focus:border-primary text-right" />
                          </motion.div>
                        </div>
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-right">אימייל</label>
                        <motion.div whileFocus={{ scale: 1.02 }}>
                          <Input type="email" placeholder="yohanan@example.com" className="border-2 border-border/50 focus:border-primary text-right" />
                        </motion.div>
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-right">טלפון</label>
                        <motion.div whileFocus={{ scale: 1.02 }}>
                          <Input type="tel" placeholder="050-123-4567" className="border-2 border-border/50 focus:border-primary text-right" />
                        </motion.div>
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-right">המטרות שלך בכושר</label>
                        <motion.div whileFocus={{ scale: 1.02 }}>
                          <Textarea 
                            placeholder="ספר לי על המטרות שלך בכושר ומה שברצונך להשיג..."
                            rows={4}
                            className="border-2 border-border/50 focus:border-primary text-right"
                          />
                        </motion.div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button className="w-full bg-gradient-to-l from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 text-lg py-6 rounded-xl shadow-xl">
                          הזמן את המפגש החינמי שלי
                        </Button>
                      </motion.div>
                    </div>
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
              © 2025 פיט פרو עילית. כל הזכויות שמורות.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}