'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ja';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    dashboard: "Dashboard",
    tasks: "Tasks",
    hideout: "Hideout",
    login: "Login",
    loggedIn: "Logged in",
    totalItemsNeeded: "Total items needed for your remaining Tasks and Hideout upgrades.",
    noItemsNeeded: "No items needed! You have completed everything (or nothing is selected).",
    loadingData: "Loading Tarkov Data...",
    loadingTasks: "Loading Tasks...",
    loadingHideout: "Loading Hideout Data...",
    errorLoading: "Error loading data. Please try again later.",
    markTasks: "Mark tasks as completed to remove their item requirements from the dashboard.",
    trackHideout: "Track your Hideout upgrades. Completed levels are removed from requirements.",
    signIn: "Sign In",
    signUp: "Sign Up",
    email: "Email",
    password: "Password",
    orContinueWith: "Or continue with",
    twitter: "Twitter (X)",
    alreadyAccount: "Already have an account? Sign In",
    noAccount: "Don't have an account? Sign Up",
    checkEmail: "Check your email for the confirmation link!",
    successSignIn: "Successfully signed in!",
    searchItems: "Search items...",
  },
  ja: {
    dashboard: "ダッシュボード",
    tasks: "タスク",
    hideout: "ハイドアウト",
    login: "ログイン",
    loggedIn: "ログイン済み",
    totalItemsNeeded: "残りのタスクとハイドアウトのアップグレードに必要なアイテムの合計数です。",
    noItemsNeeded: "必要なアイテムはありません！すべて完了したか、何も選択されていません。",
    loadingData: "データを読み込み中...",
    loadingTasks: "タスクを読み込み中...",
    loadingHideout: "ハイドアウトデータを読み込み中...",
    errorLoading: "データの読み込みエラー。後でもう一度お試しください。",
    markTasks: "完了したタスクをマークすると、ダッシュボードの必要数から除外されます。",
    trackHideout: "ハイドアウトのアップグレードを追跡します。完了したレベルは必要数から除外されます。",
    signIn: "ログイン",
    signUp: "サインアップ",
    email: "メールアドレス",
    password: "パスワード",
    orContinueWith: "または次で続行",
    twitter: "Twitter (X)",
    alreadyAccount: "すでにアカウントをお持ちですか？ログイン",
    noAccount: "アカウントをお持ちではありませんか？サインアップ",
    checkEmail: "確認リンクをメールで送信しました！",
    successSignIn: "ログインに成功しました！",
    searchItems: "アイテムを検索...",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ja');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'en' || saved === 'ja')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguage(saved);
    } else {
        // Detect browser language
        const browserLang = navigator.language.startsWith('ja') ? 'ja' : 'en';
        setLanguage(browserLang);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
