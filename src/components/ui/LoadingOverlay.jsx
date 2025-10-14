import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const LoadingOverlay = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md"
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <p className="mt-4 text-amber-700 font-medium">Loading...</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingOverlay;
