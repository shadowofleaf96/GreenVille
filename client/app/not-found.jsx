"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Iconify from "@/components/shared/iconify";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 overflow-hidden">
      <div className="relative max-w-4xl w-full text-center">
        {/* Background 404 text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-[0.03] select-none pointer-events-none">
          <span className="text-[20rem] font-black tracking-tighter">404</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="space-y-6">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-32 h-32 bg-gray-50 text-gray-900 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl border border-gray-100"
            >
              <Iconify icon="solar:ghost-bold-duotone" width={64} />
            </motion.div>

            <h1 className="text-5xl sm:text-7xl font-black text-gray-900 tracking-tighter uppercase">
              Lost in Luxury
            </h1>

            <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-xl mx-auto italic">
              The page you are looking for seems to have vanished. It may have
              been moved, renamed, or never existed in the first place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              asChild
              size="lg"
              className="h-16 px-12 rounded-2xl bg-black text-white font-black uppercase tracking-widest shadow-2xl shadow-black/20 hover:scale-[1.02] transition-all gap-3"
            >
              <Link href="/">
                Take me Home
                <Iconify icon="solar:home-2-bold-duotone" width={20} />
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-16 px-10 rounded-2xl text-gray-400 font-black uppercase tracking-widest hover:bg-gray-50 hover:text-gray-900 transition-all gap-3"
            >
              <Link href="/products">
                Shop Our Catalog
                <Iconify icon="solar:bag-3-bold-duotone" width={20} />
              </Link>
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-8 mt-24 max-w-lg mx-auto opacity-30">
          <div className="h-px bg-linear-to-r from-transparent to-gray-200" />
          <div className="h-px bg-linear-to-l from-transparent to-gray-200" />
        </div>

        <p className="mt-8 text-gray-300 text-[10px] font-black uppercase tracking-[0.3em]">
          Error 404 &middot; Page Not Found &middot; GreenVille
        </p>
      </div>
    </div>
  );
}
