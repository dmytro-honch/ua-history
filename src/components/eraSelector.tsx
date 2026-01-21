import { ERAS, type EraConfig } from '@/config/eras';
import { Select } from './formElements/select';
import { useI18n } from '@/providers';
import { fromIsoLangToKeyLang } from '@/lib/textHelpers';

interface EraSelectorProps {
  currentEra: EraConfig;
  onChange: (eraId: string) => void;
}

export function EraSelector({ currentEra, onChange }: EraSelectorProps) {
  const { text, lang } = useI18n();

  const options = ERAS.map(({ name, id }) => ({
    value: id,
    text: name[fromIsoLangToKeyLang(lang)],
  }));

  return (
    <Select openPosition="top" minWidth={20} options={options} current={currentEra.id} onChange={onChange} label={text.map.controls['era-select-label']} />
  );
}
