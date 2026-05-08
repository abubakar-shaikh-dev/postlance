import Link from 'next/link';
import Image from 'next/image';
import { getSession } from '@/lib/dal';
import { ArrowRight, CheckCircle2, Shield, Zap, Globe, Users, Briefcase } from 'lucide-react';

export default async function LandingPage() {
  const session = await getSession();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      
      {/* Navbar matching Tailscale's simple clean look */}
      <header className="absolute top-0 inset-x-0 z-50 w-full flex justify-center px-4 md:px-8 py-6">
        <div className="flex items-center justify-between w-full max-w-7xl">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/logo.svg" alt="PostLance Logo" width={140} height={40} className="h-10 w-auto" />
          </Link>
          
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link 
                  href={session.role === 'student' ? '/student/dashboard' : '/client/dashboard'}
                  className="hidden sm:block text-sm font-medium text-[#181717] hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/projects"
                  className="btn-pill"
                >
                  Browse Work
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="hidden sm:block text-[15px] font-medium text-[#181717] hover:text-primary transition-colors px-2"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register"
                  className="btn-pill"
                >
                  Try for free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <HeroSection session={session} />
        <FeaturesGrid />
      </main>

      <Footer />
    </div>
  );
}

function HeroSection({ session }) {
  return (
    <section className="pt-40 pb-20 md:pt-48 md:pb-32 px-4">
      <div className="container mx-auto max-w-5xl text-center">
        <h1 className="text-5xl sm:text-6xl md:text-[80px] font-medium text-[#181717] mb-8 leading-[1.05] tracking-tight">
          The best student talent platform for the AI era
        </h1>
        
        <p className="text-lg md:text-[22px] text-[#666666] max-w-3xl mx-auto mb-12 font-normal leading-relaxed">
          A zero-friction, identity-based connection platform that replaces legacy job boards and connects ambitious students directly with fast-growing startups.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {session ? (
            <Link 
              href={session.role === 'student' ? '/projects' : '/client/dashboard'}
              className="btn-filled-2 w-full sm:w-auto inline-flex justify-center items-center"
            >
              {session.role === 'student' ? 'Explore Opportunities' : 'Post a Project'}
            </Link>
          ) : (
            <>
              <Link 
                href="/register"
                className="btn-filled-2 w-full sm:w-auto inline-flex justify-center items-center"
              >
                Try for free
              </Link>
              <Link 
                href="/projects"
                className="btn-ghost w-full sm:w-auto inline-flex justify-center items-center"
              >
                Browse Projects
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function FeaturesGrid() {
  const features = [
    {
      title: "Algorithmic Matchmaking",
      description: "Our proprietary AI engine evaluates thousands of data points to instantly connect your project with the perfect student developer.",
      icon: <Zap className="w-6 h-6 text-primary" />
    },
    {
      title: "Verified Talent",
      description: "Every student profile is rigorously checked, ensuring you hire with complete confidence and trust.",
      icon: <Shield className="w-6 h-6 text-primary" />
    },
    {
      title: "Real Projects",
      description: "Access legitimate, paid projects from innovative startups launching real MVPs and next-gen tools.",
      icon: <Briefcase className="w-6 h-6 text-primary" />
    },
    {
      title: "Zero Trust Connections",
      description: "Secure, milestone-based tracking ensures that deliverables and payments are handled safely.",
      icon: <Globe className="w-6 h-6 text-primary" />
    },
    {
      title: "Unified Workspace",
      description: "A pristine, distraction-free environment to manage milestones, share files, and communicate directly.",
      icon: <CheckCircle2 className="w-6 h-6 text-primary" />
    },
    {
      title: "Exclusive Network",
      description: "Join a curated community of top university students and visionary founders building the future.",
      icon: <Users className="w-6 h-6 text-primary" />
    }
  ];

  return (
    <section className="py-24 px-4 bg-white border-t border-border/20">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-background rounded-2xl p-8 border border-border/10 hover:border-border/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-white border border-border/20 flex items-center justify-center mb-6 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-[20px] font-medium text-[#181717] mb-3">{feature.title}</h3>
              <p className="text-[15px] text-[#666666] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white py-16 border-t border-border/20">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="PostLance Logo" width={120} height={32} className="h-8 w-auto grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all" />
        </div>
        
        <div className="flex gap-8 text-[15px] font-medium text-[#666666]">
          <Link href="#" className="hover:text-[#181717] transition-colors">Platform</Link>
          <Link href="#" className="hover:text-[#181717] transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-[#181717] transition-colors">Terms</Link>
          <Link href="#" className="hover:text-[#181717] transition-colors">Contact</Link>
        </div>
        
        <p className="text-[14px] text-[#666666] font-normal">
          &copy; {new Date().getFullYear()} PostLance Inc.
        </p>
      </div>
    </footer>
  );
}
