import { Pharmacist } from '../types';
import { BadgeCheck, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface PharmacistCardProps {
  pharmacist: Pharmacist;
  onSelect: (p: Pharmacist) => void;
  isSelected?: boolean;
}

export default function PharmacistCard({ pharmacist, onSelect, isSelected }: PharmacistCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(pharmacist)}
      className={cn(
        "cursor-pointer p-4 rounded-2xl border transition-all duration-300 bg-white",
        isSelected 
          ? "border-primary ring-2 ring-primary/20 shadow-lg" 
          : "border-slate-100 shadow-sm hover:shadow-md"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <img 
            src={pharmacist.avatar} 
            alt={pharmacist.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-slate-50"
          />
          {pharmacist.isOnline && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <h3 className="font-semibold text-slate-900 truncate">{pharmacist.name}</h3>
            {pharmacist.registered && (
              <BadgeCheck className="w-4 h-4 text-primary fill-primary/10" title="Certified Pharmacist" />
            )}
          </div>
          <p className="text-sm text-slate-500 font-medium">{pharmacist.title}</p>
          <p className="text-xs text-slate-400 mt-1 truncate">{pharmacist.specialization}</p>
        </div>
        <div className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <MessageCircle className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
