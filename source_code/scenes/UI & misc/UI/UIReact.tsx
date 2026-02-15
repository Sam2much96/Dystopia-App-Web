/**
 * React-based Game UI Components
 * 
 * Modern React implementation of the game UI system
 * Replaces the legacy DOM manipulation approach with declarative React components
 */

import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

import Papa from "papaparse"; //for parsing a csv file properly

// import UI components
//import { MenuButton } from './MenuButton';
import { GameUIContainer } from './GameUIContainer.tsx';


//import './source_code/singletons/UIReact.css'; // React UI styling
import '../../../styles/core-react.css';




//
//import '../styles/dialogue-react.css';
//import "../styles/pointer-fix.css";









// ============================================================================
// UI MANAGER CLASS (Bridge between old system and React)
// ============================================================================
type Translations = Record<string, Record<string, string>>;

export class UIReact {
  private root: ReactDOM.Root | null = null;
  private containerElement: HTMLElement | null = null;

  public loadedTranslations : boolean = false;
    
    // to do: 
    // (1) this need proper regex to account for multiple sub-region languages
    // locale lists: https://docs.godotengine.org/en/3.5/tutorials/i18n/locales.html#doc-locales
  public language : string = this.normalizeLocale(navigator.language); //set this from user settings or browser language
  public translations : Translations  = {};

  private onTranslationsLoaded?: () => void;

  constructor() {
    this.containerElement = document.getElementById('ui-root');
    
    if (!this.containerElement) {
      console.error('UI root element not found');
      return;
    }

    this.root = ReactDOM.createRoot(this.containerElement);
  }

  /**
   * Initialize and render the React UI
   */
  async initialize() {
    console.log("initialize react ui");

    if (!this.root) {
      console.error('React root not initialized');
      return;
    }


       // })();
    await this.loadTranslations();
    
    this.root.render(<GameUIContainer />);

    

    
  }

setOnTranslationsLoaded(cb: () => void) {
  this.onTranslationsLoaded = cb;
}

    async loadTranslations() : Promise<Translations>{

        console.log("fetching translations file");
        const response  = await fetch ("./Translation_1.csv"); // works
        const csvText = await response.text(); // works

        console.log("Translation files fetched");

        const result = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true
        });
        
        //this.translations = {};

        for (const row of result.data as any[]) {
            const key = row[Object.keys(row)[0]];
            this.translations[key] = row;
        }

        //console.log(this.translations);

        //debug language translations
        console.log("translations debug 0: ",this.translations["new game"]["fr"]); // works
        console.log("language debug:", this.language);
        

        this.loadedTranslations = true;

        if (this.onTranslationsLoaded) {
         this.onTranslationsLoaded(); //notify React
        }

        return this.translations;
      }

       t(word : string, lang: string = this.language!!) : string { // translates the string file

        if (Object.keys(this.translations).length === 0 && !this.loadedTranslations) {
            return word;
        }
        if (!this.loadedTranslations) {
          console.warn("Translations not loaded")
          return word;
        }

        if (!this.translations[word]) {
          console.warn(`word not in translations csv : ${word}`);
          return word;
        }

        //console.log("word debug: ", word); // for debug purposes only
        var y = this.translations[word][lang];        
        //console.log("lang debug 2: ", y, "/ key: ", lang, "/ word: ", word);
        return y
        
    }



    normalizeLocale(input: string): string {
        /**
         * Normalize locale to match translation file formats.
         *
         * Supported locales:
         * en_US, pt_BR, fr, te_IN, hi_IN, yo_NG, ha_NG, ig_NG, ja, zh_CN, ar, ru_RU
         *
         * Examples:
         *  - "en"     => "en_US"
         *  - "ru"     => "ru_RU"
         *  - "tr"     => "pt_BR"
         *  - "en_UK"  => "en_US"
         *  - "ru_UK"  => "ru_RU"
         *  - "es"     => "pt_BR"
         */
        
        // Lowercase and normalize separators
        const locale = input.trim().replace(/-/g, "_").toLowerCase();

        // Base mapping table
        // maps specialisad translations to their supported translations
        const map: Record<string, string> = {
            en: "en_US",
            en_uk: "en_US",
            en_us: "en_US",
            ru: "ru_RU",
            ru_uk: "ru_RU",
            ru_ru: "ru_RU",
            tr: "pt_BR",
            es: "pt_BR",
            fr: "fr",
            te: "te_IN",
            hi: "hi_IN",
            yo: "yo_NG",
            ha: "ha_NG",
            ig: "ig_NG",
            ja: "ja",
            zh: "zh_CN",
            ar: "ar",
        };

        // Try exact match
        if (map[locale]) return map[locale];

        // Try to match just the language code (e.g. "en" from "en_CA")
        const langMatch = locale.match(/^([a-z]{2})/);
        if (langMatch && map[langMatch[1]]) {
            return map[langMatch[1]];
        }

        // Default fallback
        return "en_US";
    }

  /**
   * Destroy the React UI
   */
  destroy() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }

 /**
 * Translates all HTML elements at runtime by using their data-i18n keys.
 */
async translateUIElements(language: string) {
  if (!this.translations) {
    console.warn("Translation system not ready yet.");
    return;
  }

  // Wait until translations file is loaded
  await this.waitForTranslations();

  // Normalize the language code
  const normalizedLang = this.normalizeLocale(language);

  // Select all elements marked for translation
  const elements = document.querySelectorAll<HTMLElement>("[data-i18n]");

  elements.forEach((el) => {
    const key = el.dataset.i18n;
    if (!key) return;

    // Translate text content using your existing Dialogs system
    const translatedText = this.t(key, normalizedLang);
    if (translatedText && translatedText !== key) {
      el.textContent = translatedText;
    }
  });

  console.log(`✅ UI translated to ${normalizedLang}`);
}


private async waitForTranslations(): Promise<void> {
  return new Promise((resolve) => {
    const check = () => {
      if (window.dialogs && this.loadedTranslations) {
        resolve();
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  });
  }
}

// Export for use in main game
export default UIReact;
