# 🔥 Portfolio - "Sơn Đầu Hoả" Theme

A modern, dynamic portfolio website built with Next.js 16, featuring the bold "Mountain Fire" (Sơn Đầu Hoả) design theme with red and black aesthetics, advanced animations, and a full-featured admin panel.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7.3.0-2D3748?style=for-the-badge&logo=prisma)
![Three.js](https://img.shields.io/badge/Three.js-Latest-black?style=for-the-badge&logo=three.js)

## ✨ Features

### 🎨 Design & UX
- **"Sơn Đầu Hoả" Theme**: Bold red (#dc2626) and black color scheme with fiery accents
- **Text Scramble Effects**: Dynamic text animations on all section titles
- **Magnetic Buttons**: Interactive hover effects with magnetic pull
- **Smooth Scrolling**: Lenis-powered buttery smooth scroll experience
- **3D Background**: Three.js starfield animation in hero section
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop

### 🎯 Core Sections
- **Hero**: Dynamic introduction with 3D background and animated text
- **About**: Personal introduction with scrambled text effects
- **Experience**: Career history timeline with project showcases
- **Projects**: Portfolio of digital creations with tech stack display
- **Education**: Academic background presentation
- **Certificates**: Professional certifications and licenses
- **Contact**: Interactive contact form with social media links

### 🛠️ Admin Panel
- **Secure Authentication**: Protected admin routes with session management
- **Content Management**: Full CRUD operations for all sections
- **Database Admin**: Direct database management interface
- **Real-time Updates**: Changes reflect immediately on the public site

### 🎵 Interactive Features
- **Sound Effects**: Toggle-able UI sound effects for interactions
- **Custom Selection**: Red highlight color for text selection
- **Magnetic Interactions**: Buttons with magnetic hover effects

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion, GSAP
- **3D Graphics**: Three.js, React Three Fiber
- **Smooth Scroll**: Lenis

### Backend
- **Database**: PostgreSQL (via Neon)
- **ORM**: Prisma 7.3.0
- **API**: Next.js API Routes
- **Authentication**: Custom session-based auth

### UI Components
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Neon account)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd portfolio
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@host:port/database"
ADMIN_USERNAME="your-admin-username"
ADMIN_PASSWORD="your-admin-password"
```

4. **Initialize database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to view the site.

## 🏗️ Project Structure

```
portfolio/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin panel pages
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── 3d/                # Three.js components
│   │   ├── sections/          # Page sections
│   │   └── ui/                # Reusable UI components
│   └── lib/                   # Utilities & configs
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
└── package.json
```

## 🎨 Customization

### Theme Colors
Edit `src/app/globals.css` to customize the color scheme:
```css
::selection {
  background-color: #dc2626; /* Red-600 */
  color: #ffffff;
}
```

### Text Scramble Effect
Adjust animation timing in `src/components/ui/text-scramble.tsx`:
```typescript
<TextScramble duration={1500} delay={200}>
  Your Text
</TextScramble>
```

### Sound Effects
Toggle sound effects via the speaker icon in the top-right corner.

## 🔐 Admin Access

1. Navigate to `/admin/login`
2. Enter credentials from `.env` file
3. Access admin dashboard at `/admin`

### Admin Features
- **About**: Manage personal information sections
- **Experience**: Add/edit work experience and projects
- **Projects**: Manage portfolio projects
- **Education**: Update educational background
- **Certificates**: Add professional certifications
- **Skills**: Manage technical skills
- **Contact**: View contact form submissions

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Deploy to Other Platforms
The app is a standard Next.js application and can be deployed to:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Docker

## 📝 Database Schema

Key models:
- `About`: Personal information sections
- `Experience`: Work experience entries
- `ExperienceProject`: Projects within experiences
- `Project`: Portfolio projects
- `Education`: Educational background
- `Certificate`: Professional certifications
- `Skill`: Technical skills
- `Contact`: Contact form submissions

## 🎯 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Smooth Animations**: 60fps with hardware acceleration

## 🤝 Contributing

This is a personal portfolio project. Feel free to fork and customize for your own use!

## 📄 License

MIT License - feel free to use this project as a template for your own portfolio.

## 🙏 Credits

**Design & Development**: Yang Yang  
**Theme**: "Sơn Đầu Hoả" (Mountain Fire)

### Technologies Used
- [Next.js](https://nextjs.org/)
- [Three.js](https://threejs.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)

## 📞 Contact

- **LinkedIn**: [lntduong](https://www.linkedin.com/in/lntduong/)
- **GitHub**: [lntduong](https://github.com/lntduong)
- **Facebook**: [lntd.179](https://www.facebook.com/lntd.179/)

---

**© 2026 By Yang Yang** - Built with ❤️ and 🔥
