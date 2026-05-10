// Components
import { RegisterForm } from './RegisterForm';
import Link from 'next/link';
import Image from 'next/image';

// Icons
import { Rocket, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Sign Up - PostLance',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex bg-[#f9f7f6]">
      {/* Left side: Decorative using Tailscale scheme */}
      <div className="hidden lg:flex flex-1 relative bg-[#2e2d2d] overflow-hidden">
        {/* Abstract decorative background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#5a82de]/20 via-[#2e2d2d] to-[#2e2d2d]" />
        
        {/* Floating elements */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#5a82de]/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#d04841]/10 rounded-full mix-blend-screen filter blur-[100px] opacity-70" />

        <div className="relative z-10 flex flex-col justify-center items-center w-full h-full p-12 text-center">
          <div className="bg-[#1f1e1e]/60 backdrop-blur-2xl p-10 rounded-[32px] max-w-lg border border-white/5 shadow-2xl">
            <div className="w-16 h-16 bg-[#5a82de]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Rocket className="h-8 w-8 text-[#5a82de]" />
            </div>
            <h2 className="text-[32px] font-medium mb-4 tracking-tight text-white">Unlock Your Potential</h2>
            <p className="text-[16px] text-white/70 leading-relaxed font-normal">
              Whether you're looking to hire top student talent or start your freelance career, everything you need is right here.
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Form — fixed width, vertically centered */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:flex-none lg:w-[520px] lg:px-16 xl:px-20 bg-white md:shadow-2xl z-10 relative">
        <div className="w-full max-w-[380px] mx-auto relative py-10">
          
          <Link href="/" className="absolute -top-2 left-0 text-[14px] font-medium text-[#666666] hover:text-[#181717] flex items-center transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Link>

          <div className="text-center lg:text-left mt-10 mb-6">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
              <Image src="/logo.svg" alt="PostLance Logo" width={140} height={40} className="h-9 w-auto" />
            </Link>
            <h1 className="text-[28px] font-medium tracking-tight text-[#181717] leading-none mb-2">Create an account</h1>
            <p className="text-[14px] font-normal text-[#666666] leading-relaxed">
              Enter your details to get started with PostLance.
            </p>
          </div>
          
          <RegisterForm />
          
          <p className="text-center lg:text-left text-[14px] font-normal text-[#666666] mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-[#d04841] font-medium hover:text-[#d04841]/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      
    </div>
  );
}
