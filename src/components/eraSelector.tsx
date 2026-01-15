import { ERAS, type EraConfig } from '@/config/eras';

interface EraSelectorProps {
  currentEra: EraConfig;
  onChange: (eraId: string) => void;
  lang: 'uk' | 'en';
}

export function EraSelector({ currentEra, onChange, lang }: EraSelectorProps) {
  return (
    <select value={currentEra.id} onChange={(e) => onChange(e.target.value)} className="era-selector">
      {ERAS.map((era) => (
        <option key={era.id} value={era.id}>
          {era.name[lang]}
        </option>
      ))}
    </select>
  );
}
