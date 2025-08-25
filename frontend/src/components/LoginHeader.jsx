import { motion } from 'framer-motion';

const LoginHeader = ({ config }) => (
  <div className="text-center mb-8">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
      className={`inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br ${config.gradient} rounded-2xl text-white shadow-lg`}
    >
      {config.icon}
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="text-2xl font-bold text-slate-800 mb-2"
    >
      {config.title}
    </motion.h2>
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="text-slate-600"
    >
      {config.subtitle}
    </motion.p>
  </div>
);

export default LoginHeader;