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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass rounded-2xl p-6 group cursor-default hover:border-violet-500/30 transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="font-semibold text-white text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
