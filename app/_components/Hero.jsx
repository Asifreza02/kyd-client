'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Aurora from "./Aurora";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 max-w-3xl"
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400 animate-text-gradient bg-[200%_auto]">
              Know Your Department
            </h1>
            <p className="mx-auto max-w-[700px] text-zinc-500 md:text-xl dark:text-zinc-400">
              Discover the brilliant minds shaping the future. Connect with faculty, explore research, and stay informed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md space-y-4"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-background-shine bg-[length:200%_100%]"></div>
              <div className="relative flex items-center bg-white dark:bg-zinc-950 rounded-lg p-1 shadow-xl">
                <Search className="w-5 h-5 ml-3 text-zinc-400" />
                <Input
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  placeholder="Search for professors, research areas..."
                />
                <Button size="sm" className="rounded-md">
                  Search
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button variant="outline" className="rounded-full backdrop-blur-sm bg-white/30 dark:bg-black/30 border-white/50 dark:border-white/10 hover:bg-white/50 dark:hover:bg-black/50 transition-all duration-300">
              Browse Faculty
            </Button>
            <Button variant="ghost" className="rounded-full group hover:bg-white/20 dark:hover:bg-black/20">
              View Research <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
