import { useTranslation } from 'react-i18next';
import { LuGlobe } from 'react-icons/lu';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('es') ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 flex items-center justify-center font-bold text-xs"
      aria-label="Toggle language"
      title={i18n.language.startsWith('es') ? 'Switch to English' : 'Cambiar a Español'}
    >
      <LuGlobe className="w-5 h-5" />
      <span className="ml-1 uppercase">{i18n.language.split('-')[0]}</span>
    </button>
  );
};
