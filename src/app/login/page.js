// Components
import { LoginForm } from './LoginForm';
import Link from 'next/link';
import Image from 'next/image';

// Icons
import { Sparkles, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Login - PostLance',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex bg-[#f9f7f6]">
      {/* Left side: Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:flex-none lg:w-[480px] lg:px-12 xl:px-24 bg-white md:shadow-2xl">
        <div className="w-full max-w-sm mx-auto space-y-8 relative">
          
          <Link href="/" className="absolute -top-16 -left-2 text-[14px] font-medium text-[#666666] hover:text-[#181717] flex items-center transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Link>

          <div className="text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
              <Image src="/logo.svg" alt="PostLance Logo" width={140} height={40} className="h-10 w-auto" />
            </Link>
            <h1 className="text-4xl font-medium tracking-tight text-[#181717] leading-none mb-3">Welcome back</h1>
            <p className="text-[15px] font-normal text-[#666666] leading-relaxed">
              Enter your credentials to access your account.
            </p>
          </div>
          
          <LoginForm />
          
          <p className="text-center lg:text-left text-[15px] font-normal text-[#666666]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#d04841] font-medium hover:text-[#d04841]/80 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      
      {/* Right side: Decorative using Tailscale scheme */}
      <div className="hidden lg:flex flex-1 relative bg-[#2e2d2d] overflow-hidden">
        {/* Abstract decorative background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#d04841]/20 via-[#2e2d2d] to-[#2e2d2d]" />
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#d04841]/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#5a82de]/10 rounded-full mix-blend-screen filter blur-[100px] opacity-70" />

        <div className="relative z-10 flex flex-col justify-center items-center w-full h-full p-12 text-center">
          <div className="bg-[#1f1e1e]/60 backdrop-blur-2xl p-10 rounded-[32px] max-w-lg border border-white/5 shadow-2xl">
            <div className="w-16 h-16 bg-[#d04841]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-8 w-8 text-[#d04841]" />
            </div>
            <h2 className="text-[32px] font-medium mb-4 tracking-tight text-white">The Future of Freelance</h2>
            <p className="text-[16px] text-white/70 leading-relaxed font-normal">
              Join the platform where students build careers and clients find exceptional emerging talent. Powered by AI matching to ensure the perfect fit every time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
