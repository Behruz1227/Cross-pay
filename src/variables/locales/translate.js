export const getTranslation = (translations, key, language) => {
    const translation = translations.find(item => item.key === key);
    if (translation) {
      return language === 'uz' ? translation.uz : translation.ru;
    }
    return '';
  };