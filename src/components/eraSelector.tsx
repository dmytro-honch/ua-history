import { ERAS, type EraConfig } from '@/config/eras';
import { Select } from './formElements/select';
import { useI18n } from '@/providers';
import { fromIsoLangToKeyLang } from '@/lib/textHelpers';
import { formatYear } from '@/lib/dateUtils';

interface EraSelectorProps {
  currentEra: EraConfig;
  onChange: (eraId: string) => void;
  bcPostfix: string;
  acPostfix: string;
}

export function EraSelector({ currentEra, onChange, bcPostfix, acPostfix }: EraSelectorProps) {
  const { text, lang } = useI18n();

  const options = ERAS.map(({ name, id, startYear, endYear }) => ({
    value: id,
    text: name[fromIsoLangToKeyLang(lang)],
    description: `${formatYear(startYear, bcPostfix, acPostfix)} - ${formatYear(endYear, bcPostfix, acPostfix)}`
  }));

  return (
    <Select openPosition="top" minWidth={22} options={options} current={currentEra.id} onChange={onChange} label={text.map.controls['era-select-label']} />
  );
}
