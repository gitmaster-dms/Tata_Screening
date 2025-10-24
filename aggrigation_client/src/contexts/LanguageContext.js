// TranslationContext.js
import React, { createContext, useContext, useState } from 'react';
import translate from 'google-translate-api';

const LanguageContext = createContext();

export const TranslationProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    const translateText = async (text, targetLanguage) => {
        try {
            const response = await translate(text, { to: targetLanguage });
            return response.text;
        } catch (error) {
            console.error('Translation error:', error.message);
            throw error;
        }
    };

    const translate = async (text) => {
        const translatedText = await translateText(text, language);
        return translatedText;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, translate }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => {
    return useContext(LanguageContext);
};
