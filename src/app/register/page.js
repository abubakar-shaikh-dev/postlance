import { RegisterForm } from './RegisterForm';
import Link from 'next/link';
import Image from 'next/image';
import { Zap } from 'lucide-react';

export const metadata = {
  title: 'Create Account - PostLance',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left side: Decorative */}
      <div className="hidden lg:flex flex-1 relative bg-muted overflow-hidden">
        {/* Abstract decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

        <div className="relative z-10 flex flex-col justify-center items-center w-full h-full p-12 text-center">
          <div className="glass-card p-8 rounded-2xl max-w-lg border-white/10 shadow-2xl">
            <Zap className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Jumpstart Your Journey</h2>
            <p className="text-muted-foreground leading-relaxed">
              Create your account in seconds. Whether you're a student looking to build your portfolio or a client seeking fresh talent, PostLance is your launchpad.
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:flex-none lg:w-[480px] lg:px-12 xl:px-24 py-12">
        <div className="w-full max-w-sm mx-auto space-y-8">
          <div className="text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
              <Image src="/logo.svg" alt="PostLance Logo" width={140} height={40} className="h-10 w-auto" />
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Create account</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Join thousands of users on PostLance today.
            </p>
          </div>
          
          <RegisterForm />
          
          <p className="text-center lg:text-left text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
