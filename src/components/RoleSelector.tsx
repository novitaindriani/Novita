import { User, ClipboardList } from 'lucide-react';
import { cn } from '../lib/utils';

interface RoleSelectorProps {
  role: 'patient' | 'pharmacist';
  onRoleChange: (role: 'patient' | 'pharmacist') => void;
}

export default function RoleSelector({ role, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
      <button
        onClick={() => onRoleChange('patient')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
          role === 'patient' 
            ? "bg-white text-slate-900 shadow-sm" 
            : "text-slate-500 hover:text-slate-700"
        )}
      >
        <User className="w-4 h-4" />
        Pasien
      </button>
      <button
        onClick={() => onRoleChange('pharmacist')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
          role === 'pharmacist' 
            ? "bg-white text-slate-900 shadow-sm" 
            : "text-slate-500 hover:text-slate-700"
        )}
      >
        <ClipboardList className="w-4 h-4" />
        Apoteker
      </button>
    </div>
  );
}
