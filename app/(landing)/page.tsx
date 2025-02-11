'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ChevronDown, Book, Shield, Zap, LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    className="group relative rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
  >
    <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-customOrange to-customOrangeGradiant opacity-0 blur transition duration-300 group-hover:opacity-30" />
    <div className="relative flex flex-col items-center text-center">
      <div className="mb-4 rounded-full bg-orange-100 p-3">
        <Icon className="h-6 w-6 text-customOrange" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </motion.div>
);

const FloatingShapes: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1360 578"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute left-1/2 -translate-x-1/2"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="illustration-01">
          <stop stopColor="#FFF" offset="0%" />
          <stop stopColor="#FE4D01" offset="77.402%" />
          <stop stopColor="#FE4D01" offset="100%" />
        </linearGradient>
      </defs>
      <g fill="url(#illustration-01)" fillRule="evenodd" opacity="0.7">
        <motion.circle
          cx="1232"
          cy="128"
          r="128"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: 1,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.circle
          cx="155"
          cy="443"
          r="64"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: 1,
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 1,
          }}
        />
        <motion.circle
          cx="170"
          cy="20"
          r="148"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: 1,
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 2,
          }}
        />
      </g>
    </svg>
  </div>
);

export default function Home(): JSX.Element {
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 50);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-orange-50/30 to-white">
      <FloatingShapes />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-screen flex-col items-center justify-center pb-12 pt-20 md:pb-20 md:pt-32">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8 inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-customOrange"
            >
              Transform Your Teaching Experience
            </motion.div>

            <motion.h1
              className="leading-tighter mb-6 text-4xl font-extrabold tracking-tighter text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Welcome to{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-customOrange to-customOrangeGradiant bg-clip-text text-transparent">
                  Q-Shuffle
                </span>
                <motion.span
                  className="absolute -bottom-2 -left-2 -right-2 -z-10 hidden h-3 bg-orange-200/60 md:block"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </span>
            </motion.h1>

            <motion.p
              className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 sm:text-xl md:text-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Revolutionize your exam creation process with our intelligent question shuffling
              platform. Create, customize, and distribute with confidence.
            </motion.p>

            <motion.div
              className="mx-auto mb-16 flex max-w-xs flex-col gap-4 sm:max-w-none sm:flex-row sm:justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/auth" className="w-full sm:w-auto">
                <Button className="group relative w-full overflow-hidden rounded-lg bg-customOrange px-8 py-6 text-lg font-semibold text-white transition-all duration-300 hover:bg-customOrangeGradiant sm:w-auto">
                  <span className="relative z-10">Get Started Now</span>
                  <div className="absolute inset-0 -z-0 bg-gradient-to-r from-customOrangeGradiant to-customOrange opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full border-2 border-customOrange px-8 py-6 text-lg font-semibold text-customOrange transition-all duration-300 hover:bg-customOrange/10 sm:w-auto"
                >
                  View Dashboard
                </Button>
              </Link>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard
                icon={Zap}
                title="Lightning Fast"
                description="Generate unique question sets in seconds with our advanced shuffling algorithm"
                delay={0.8}
              />
              <FeatureCard
                icon={Shield}
                title="Secure & Reliable"
                description="Bank-grade encryption ensures your content remains protected and private"
                delay={1}
              />
              <FeatureCard
                icon={Book}
                title="Smart Distribution"
                description="Share custom links or export to PDF with just one click"
                delay={1.2}
              />
            </div>

            <motion.footer
              className="mt-16 border-t border-gray-200 pt-8 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <p className="flex items-center justify-center gap-2">
                ©2025 Created with{' '}
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                  className="text-red-500"
                >
                  ❤️
                </motion.span>{' '}
                by{' '}
                <a
                  href="https://github.com/mustapha-jamaaoui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative font-medium text-customOrange transition-colors duration-300 hover:text-customOrangeGradiant"
                >
                  mustapha jamaaoui
                </a>
              </p>
            </motion.footer>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        <ChevronDown className="h-6 w-6 animate-bounce text-gray-400" />
      </motion.div>
    </main>
  );
}
