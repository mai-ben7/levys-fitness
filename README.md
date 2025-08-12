# Levy's Fitness - אתר מאמן אישי

אתר מאמן אישי מודרני ואנימטיבי בעברית, בנוי עם Next.js 14, TypeScript, Tailwind CSS ו-Framer Motion.

**Hebrew RTL Website** - אתר בעברית מימין לשמאל

## 🚀 Features

- **Hebrew RTL Support**: Full right-to-left layout support for Hebrew content
- **Modern Design**: Clean, professional design with fitness-themed color palette
- **Smooth Animations**: Framer Motion animations for engaging user experience
- **Responsive**: Fully responsive design that works on all devices
- **SEO Optimized**: Built-in SEO features with metadata, sitemap, and robots.txt
- **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Performance**: Optimized for speed with Next.js 14 App Router
- **Contact Form**: Functional lead capture form with validation
- **Interactive Components**: Before/After gallery, testimonials carousel, FAQ accordion
- **Video Integration**: Professional video showcase with custom controls
- **Professional Media**: Photo and video components with fallback support

## 📸 Adding Media Files

### Adding Oren Levy's Photo
1. Save Oren Levy's photo as `oren-levy.jpg`
2. Place it in: `public/images/oren-levy.jpg`
3. The photo will automatically appear in the About section

### Adding Oren Levy's Video
1. Save Oren Levy's training video as `oren-levy-training.mp4`
2. Place it in: `public/videos/oren-levy-training.mp4`
3. The video will automatically appear in the Video Showcase section

### Optional: Video Poster Image
1. Create a poster image (thumbnail) as `oren-levy-video-poster.jpg`
2. Place it in: `public/images/oren-levy-video-poster.jpg`
3. This will be shown before the video plays

### File Structure
```
public/
├── images/
│   ├── oren-levy.jpg                    # Oren Levy's photo
│   └── oren-levy-video-poster.jpg       # Video thumbnail (optional)
└── videos/
    └── oren-levy-training.mp4           # Oren Levy's training video
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd levys-fitness-main
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Customization

### Colors
The website uses CSS variables for easy color customization. Edit the colors in `src/app/globals.css`:

```css
:root {
  --primary: #dc2626; /* Main brand color */
  --fitness-orange: #f97316;
  --fitness-green: #22c55e;
  --fitness-blue: #3b82f6;
  --fitness-purple: #8b5cf6;
  --fitness-yellow: #eab308;
}
```

### Content
Update the content in the respective component files:
- `src/app/page.tsx` - Main page content and sections
- Update trainer information, services, testimonials, etc.

### Images
Replace placeholder images with actual photos:
1. Add images to the `public/images/` directory
2. Update image paths in components
3. Use Next.js Image component for optimization

## 📱 Sections

### 1. Header
- Sticky navigation with scroll behavior
- Mobile-responsive menu
- Contact information and CTA button

### 2. Hero
- Animated headline and call-to-action
- Background decorative elements
- Statistics display
- Floating testimonial card

### 3. About
- Oren Levy's photo and credentials
- Professional statistics and experience
- Certification badges
- Animated elements

### 4. Video Showcase
- Oren Levy's training video
- Professional video controls
- Feature highlights
- Interactive play/pause functionality

### 5. Programs
- Four main fitness programs
- Pricing and features
- Animated cards with hover effects
- CTA for consultation

### 6. Results
- Client testimonials and success stories
- Before/after transformations
- Rating display
- Transformation statistics

### 7. Contact Form
- Lead capture form with validation
- Contact information display
- Free consultation CTA
- Success/error handling

### 8. Footer
- Company information
- Quick links
- Newsletter signup
- Social media links

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific settings:

```env
NEXT_PUBLIC_SITE_URL=https://levysfitness.com
NEXT_PUBLIC_CONTACT_EMAIL=hello@levysfitness.com
NEXT_PUBLIC_CONTACT_PHONE=(555) 123-4567
```

### SEO Settings
Update SEO metadata in `src/app/layout.tsx`:
- Site title and description
- Open Graph tags
- Twitter Card settings
- Google verification code

### API Integration
The contact form is ready for backend integration. Update the form submission in the contact section to connect with your preferred backend service.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The website can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email hello@levysfitness.com or create an issue in this repository.
