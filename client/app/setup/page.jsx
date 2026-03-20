"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Iconify from "@/components/shared/iconify";
import { Button } from "@/components/ui/button";

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-4xl flex items-center justify-center mx-auto text-primary">
            <Iconify icon="solar:settings-bold-duotone" width={48} />
          </div>

          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
            Store Initialization Required
          </h1>

          <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-lg mx-auto italic">
            Your store is almost ready. Before we can show the public catalog,
            you need to complete the initial setup in the admin dashboard.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-10 rounded-[3rem] shadow-xl shadow-primary/5 border border-gray-100 flex flex-col sm:flex-row items-center gap-8 justify-between"
        >
          <div className="text-left space-y-2">
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">
              Go to Dashboard
            </h3>
            <p className="text-gray-400 text-sm font-medium">
              Update logo, title, and theme colors.
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="h-16 px-10 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] transition-all gap-3"
          >
            <Link href="/admin/login">
              Access Admin
              <Iconify icon="solar:arrow-right-bold" width={20} />
            </Link>
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 text-xs font-black uppercase tracking-widest italic"
        >
          Powered by GreenVille Engine &copy; {new Date().getFullYear()}
        </motion.p>
      </div>
    </div>
  );
}
