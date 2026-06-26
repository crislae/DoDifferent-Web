import {
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Wallet,
  Wand2,
} from 'lucide-react';

const ICONS = {
  sparkles: Sparkles,
  calendar: Calendar,
  'map-pin': MapPin,
  users: Users,
  wallet: Wallet,
};

export function getStepIcon(iconName) {
  return ICONS[iconName] ?? Sparkles;
}

export { Wand2 };
