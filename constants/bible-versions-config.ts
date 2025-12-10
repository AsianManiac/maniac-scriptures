import { BibleVersion } from "@/types/bible";

// Define the interface for remote version metadata
export interface RemoteBibleVersion extends BibleVersion {
  googleDriveUrl: string;
  isStatic: boolean; // true if bundled with app, false if downloadable
}

// Helper to convert View URL to Download URL
export const getGoogleDriveDownloadUrl = (viewUrl: string): string => {
  // Extract ID from: https://drive.google.com/file/d/1_Lf6kUwm8rdTWxkEeY9lO3CO_HuejFdI/view?usp=drive_link
  const match = viewUrl.match(/\/d\/(.+?)\//);
  if (!match || !match[1]) return viewUrl;
  const id = match[1];
  return `https://drive.google.com/uc?export=download&id=${id}`;
};

// Full list of all supported versions (Static + Downloadable)
export const ALL_BIBLE_VERSIONS: RemoteBibleVersion[] = [
  // --- Static Local Versions (Keep your existing ones here) ---
  {
    id: "amp",
    name: "Amplified Bible",
    abbreviation: "AMP",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1GQpcfzQYqdxAwkhiLbigUiKpAg8KHFoG/view?usp=drive_link",
    isStatic: true,
  },
  {
    id: "esv",
    name: "English Standard Version",
    abbreviation: "ESV",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1wGYaco-eTaTdC5FRzLymDp9ln_e3ifuV/view?usp=drive_link",
    isStatic: true,
  },
  {
    id: "kjv",
    name: "King James Version",
    abbreviation: "KJV",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1KDFD3wL9kAjqxvkWx0Y6Nu0X3m40OTOe/view?usp=drive_link",
    isStatic: true,
  },
  {
    id: "niv",
    name: "New International Version",
    abbreviation: "NIV",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1Y_JEMqeIpcvkXBwIiuxAIoA-sxZ2moYL/view?usp=drive_link",
    isStatic: true,
  },
  {
    id: "nkjv",
    name: "New King James Version",
    abbreviation: "NKJV",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1Ydl_4ISCgvLbxsDJy-vllbwMsB3UsgDL/view?usp=drive_link",
    isStatic: true,
  },
  {
    id: "nlv",
    name: "New Life Version",
    abbreviation: "NLV",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1hSp4BbfpdcKv0klg27A7eTFganpM5t_B/view?usp=drive_link",
    isStatic: true,
  },

  // --- Downloadable Versions (New ones from your list) ---
  {
    id: "akjv",
    name: "American King James Version",
    abbreviation: "AKJV",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1_Lf6kUwm8rdTWxkEeY9lO3CO_HuejFdI/view?usp=drive_link",
    isStatic: false,
  },
  {
    id: "asv",
    name: "American Standard Version",
    abbreviation: "ASV",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/13F6aXjcKdiJ1Ha6A5eNoGbR0yy-Dv0Kp/view?usp=drive_link",
    isStatic: false,
  },
  {
    id: "brg",
    name: "Blue Red and Gold Letter Edition",
    abbreviation: "BRG",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/10isDEcd6zrNywswKffoNL5dcTm8jiHWv/view?usp=drive_link",
    isStatic: false,
  },
  {
    id: "csb",
    name: "Christian Standard Bible",
    abbreviation: "CSB",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1lUjgrkxCrUG0kfo9POynEzrIF4aYjqFd/view?usp=drive_link",
    isStatic: false,
  },
  {
    id: "ehv",
    name: "English Heritage Version",
    abbreviation: "EHV",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1weWW9BuEJytfOgMMuyqf-v9WdTOt-A1K/view?usp=drive_link",
    isStatic: false,
  },
  {
    id: "esvuk",
    name: "English Standard Version UK",
    abbreviation: "ESVUK",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1niPpVfz8IkA-RN7wdRbxkGL87ofHEpqx/view?usp=drive_link",
    isStatic: false,
  },
  {
    id: "gnv",
    name: "Geneva Bible",
    abbreviation: "GNV",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/15_m0A-AqBZEcYisDnH6KLTo0e29ck1SP/view?usp=drive_link",
    isStatic: false,
  },
  {
    id: "gw",
    name: "God's Word Translation",
    abbreviation: "GW",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1QzZgYygmp16dP15Ap7dC5eYS4nOrAIrd/view?usp=drive_link",
    isStatic: false,
  },
  {
    id: "isv",
    name: "International Standard Version",
    abbreviation: "ISV",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1nfVwakMrijFoMPG6Y9Onv5NZmqyt_R7a/view?usp=drive_link",
    isStatic: false,
  },
  {
    id: "jub",
    name: "Jubilee Bible",
    abbreviation: "JUB",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1WyxhysS21GkVJqTWixeJHpyfJ5L0T0QZ/view?usp=drive_link",
    isStatic: false,
  },
  {
    id: "leb",
    name: "Lexham English Bible",
    abbreviation: "LEB",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1ojnFPryzbzFjLBCDbxOcYB_jB-NO34ID/view?usp=drive_link",
    isStatic: false,
  },
  {
    id: "mev",
    name: "Modern English Version",
    abbreviation: "MEV",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1z81RrvNzNp57kcY0qpdtJlBb1dtv3eaq/view?usp=drive_link",
    isStatic: false,
  },
  {
    id: "nasb",
    name: "New American Standard Bible",
    abbreviation: "NASB",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1l2Vdlb7nxuisKxfUAxLkfnktP116qjWc/view?usp=drive_link",
    isStatic: false,
  },
  {
    id: "nasb1995",
    name: "New American Standard Bible 1995",
    abbreviation: "NASB1995",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1Yjtv-0iMIzYttuvGvFJsvStlG0FMx9AN/view?usp=drive_link",
    isStatic: false,
  },
  {
    id: "net",
    name: "New English Translation",
    abbreviation: "NET",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1I8Qc58gHjXjaLoTRG3mvOJhKPJYXn9w_/view?usp=drive_link",
    isStatic: false,
  },
  {
    id: "nivuk",
    name: "New International Version UK",
    abbreviation: "NIVUK",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1toDM36yuSbTWT18VmjZY7xk7xszg-QzS/view?usp=drive_link",
    isStatic: false,
  },
  {
    id: "nlt",
    name: "New Living Translation",
    abbreviation: "NLT",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1UgxPk8sFvVr9DIGsHtqob0WzhD-hrUgT/view?usp=drive_link",
    isStatic: false,
  },
  {
    id: "nog",
    name: "Names of God Bible",
    abbreviation: "NOG",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1Z9_YOaDe_pK31fPd1iXLQg1QMpc78T4l/view?usp=drive_link",
    isStatic: false,
  },
  {
    id: "nrsv",
    name: "New Revised Standard Version",
    abbreviation: "NRSV",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/16BNASqSLBBQzsB72hpEKSOcCZIMGMZlU/view?usp=drive_link",
    isStatic: false,
  },
  {
    id: "nrsvue",
    name: "New Revised Standard Version Updated Edition",
    abbreviation: "NRSVUE",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1C0gMgLEYvQYQzo-xw8al9XikeM1nuD4M/view?usp=drive_link",
    isStatic: false,
  },
  {
    id: "web",
    name: "World English Bible",
    abbreviation: "WEB",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1D_FzNsYa30ZFOASwlTccpNExNq0c7DO8/view?usp=drive_link",
    isStatic: false,
  },
  {
    id: "ylt",
    name: "Young's Literal Translation",
    abbreviation: "YLT",
    language: "English",
    googleDriveUrl:
      "https://drive.google.com/file/d/1i_-S01jkY1Ab90MsKAYJAxLN2Zu3znB6/view?usp=drive_link",
    isStatic: false,
  },
];
