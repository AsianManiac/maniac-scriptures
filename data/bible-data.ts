import { Book, Devotional } from "@/types/bible";

export const BOOKS: Book[] = [
  { id: "genesis", name: "Genesis", testament: "old", chapters: 50 },
  { id: "exodus", name: "Exodus", testament: "old", chapters: 40 },
  { id: "psalms", name: "Psalms", testament: "old", chapters: 150 },
  { id: "proverbs", name: "Proverbs", testament: "old", chapters: 31 },
  { id: "isaiah", name: "Isaiah", testament: "old", chapters: 66 },
  { id: "matthew", name: "Matthew", testament: "new", chapters: 28 },
  { id: "john", name: "John", testament: "new", chapters: 21 },
  { id: "romans", name: "Romans", testament: "new", chapters: 16 },
  { id: "philippians", name: "Philippians", testament: "new", chapters: 4 },
  { id: "james", name: "James", testament: "new", chapters: 5 },
];

export const DEVOTIONALS: Devotional[] = [
  {
    id: "1",
    title: "God's Unfailing Love",
    content:
      "In times of uncertainty and fear, we can find comfort in knowing that God's love never fails. His love is constant, unchanging, and ever-present. When we feel alone or afraid, we can remember that nothing can separate us from His love. Today, rest in the assurance that you are deeply loved by your Creator.",
    verseReference: { book: "Romans", chapter: 8, verse: 38 },
    verseText:
      "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.",
    category: "Faith",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "2",
    title: "Trust in His Plan",
    content:
      "When life feels overwhelming and the path ahead is unclear, we are called to trust in the Lord with all our hearts. Our human understanding is limited, but God sees the complete picture. He knows what's best for us, even when we can't see it ourselves. Today, surrender your worries and trust that He is directing your steps.",
    verseReference: { book: "Proverbs", chapter: 3, verse: 5 },
    verseText:
      "Trust in the Lord with all thine heart; and lean not unto thine own understanding.",
    category: "Wisdom",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "3",
    title: "The Good Shepherd",
    content:
      "Like a shepherd cares for his sheep, God cares for you. He provides for your needs, leads you to places of rest, and protects you from harm. Even in the darkest valleys, you don't have to fear because He is with you. His presence is your comfort and your peace. Today, rest in the care of your Good Shepherd.",
    verseReference: { book: "Psalms", chapter: 23, verse: 1 },
    verseText: "The Lord is my shepherd; I shall not want.",
    category: "Prayer",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "4",
    title: "Strength in Christ",
    content:
      "You are stronger than you think because Christ gives you strength. Whatever challenges you face today, you don't face them alone. His power is available to you in every moment of weakness. When you feel like giving up, remember that you can do all things through Christ who strengthens you.",
    verseReference: { book: "Philippians", chapter: 4, verse: 13 },
    verseText: "I can do all things through Christ which strengtheneth me.",
    category: "Grace",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "5",
    title: "Eternal Life Through Faith",
    content:
      "God's love for the world is so great that He gave His only Son so that whoever believes in Him will have eternal life. This gift is available to everyone, regardless of their past or present. Today, receive this gift of love and grace, and know that through faith in Jesus, you have eternal life.",
    verseReference: { book: "John", chapter: 3, verse: 16 },
    verseText:
      "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    category: "Love",
    date: new Date().toISOString().split("T")[0],
  },
];
