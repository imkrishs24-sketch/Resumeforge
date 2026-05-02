import { motion } from "framer-motion";

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  delay?: number;
}

export default function TestimonialCard({ name, role, company, avatar, content, rating, delay = 0 }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="glass rounded-2xl p-6 flex flex-col gap-4"
    >
      <div className="flex gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed flex-1">"{content}"</p>
      <div className="flex items-center gap-3 pt-2 border-t border-white/5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm">
          {avatar}
        </div>
        <div>
          <p className="text-white text-sm font-medium">{name}</p>
          <p className="text-muted-foreground text-xs">{role} at {company}</p>
        </div>
      </div>
    </motion.div>
  );
}
