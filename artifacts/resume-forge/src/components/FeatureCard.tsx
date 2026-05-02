import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
}

export default function FeatureCard({ icon, title, description, gradient, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="glass rounded-2xl p-5 sm:p-6 group cursor-default hover:border-violet-500/30 transition-all duration-300 flex flex-col"
    >
      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="font-semibold text-white text-base sm:text-lg mb-2 leading-snug">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
