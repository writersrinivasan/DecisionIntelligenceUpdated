import {
  Compass, Users, Siren, CalendarClock, Scale, CloudUpload, ListOrdered, Bot, Wallet, BookOpenCheck,
  Activity, PiggyBank, Network, ShieldCheck, Target, Trophy, Sparkles, type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Compass, Users, Siren, CalendarClock, Scale, CloudUpload, ListOrdered, Bot, Wallet, BookOpenCheck,
  Activity, PiggyBank, Network, ShieldCheck, Target, Trophy,
};

export default function Icon({ name, size = 22, className }: { name: string; size?: number; className?: string }) {
  const C = MAP[name] ?? Sparkles;
  return <C size={size} className={className} />;
}
