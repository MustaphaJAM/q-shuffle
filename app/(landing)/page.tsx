'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Illustration */}
      <div className="pointer-events-none absolute inset-0 -z-10 transform" aria-hidden="true">
        <svg
          width="1360"
          height="578"
          viewBox="0 0 1360 578"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-1/2 -translate-x-1/2"
        >
          <defs>
            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="illustration-01">
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#FE4D01" offset="77.402%" />
              <stop stopColor="#FE4D01" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="url(#illustration-01)" fillRule="evenodd">
            <circle cx="1232" cy="128" r="128" />
            <circle cx="155" cy="443" r="64" />
            <circle cx="170" cy="20" r="148" />
          </g>
        </svg>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex min-h-screen flex-col justify-center pb-12 pt-32 md:pb-20 md:pt-40">
          <div className="text-center">
            {/* Heading */}
            <h1
              className="leading-tighter mb-6 text-4xl font-extrabold tracking-tighter text-gray-900 sm:text-5xl md:text-6xl"
              data-aos="zoom-y-out"
            >
              Welcome to{' '}
              <span className="bg-gradient-to-r from-customOrange to-customOrangeGradiant bg-clip-text text-transparent">
                Q-Shuffle
              </span>
            </h1>

            {/* Subheading */}
            <p
              className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 sm:text-xl"
              data-aos="zoom-y-out"
              data-aos-delay="150"
            >
              Q-Shuffle is the ultimate tool for educators to effortlessly create, shuffle, and
              distribute custom question sheets. Whether you&apos;re crafting exams, generating PDFs, or
              sharing links with students, we&apos;ve streamlined the process to be simple, secure, and
              effective.
            </p>

            {/* Call-to-Action Buttons */}
            <div
              className="mx-auto flex max-w-xs flex-col gap-4 sm:max-w-none sm:flex-row sm:justify-center"
              data-aos="zoom-y-out"
              data-aos-delay="300"
            >
              <Link href="/auth" className="w-full sm:w-auto">
                <Button className="w-full">Login</Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}