export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number; // 0-3
  difficulty: "easy" | "medium" | "hard";
  reference: string;
}

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: "1",
    question: "Who was swallowed by a great fish?",
    options: ["Jonah", "Moses", "Peter", "Noah"],
    correctIndex: 0,
    difficulty: "easy",
    reference: "Jonah 1:17",
  },
  {
    id: "2",
    question: "What is the longest book in the Bible?",
    options: ["Isaiah", "Genesis", "Psalms", "Revelation"],
    correctIndex: 2,
    difficulty: "easy",
    reference: "Psalms",
  },
  {
    id: "3",
    question: "How many days did it rain during the flood?",
    options: ["7 days", "40 days", "150 days", "30 days"],
    correctIndex: 1,
    difficulty: "medium",
    reference: "Genesis 7:12",
  },
  {
    id: "4",
    question: "Who was the first king of Israel?",
    options: ["David", "Solomon", "Saul", "Samuel"],
    correctIndex: 2,
    difficulty: "medium",
    reference: "1 Samuel 10:1",
  },
  {
    id: "5",
    question: "Which disciple denied Jesus three times?",
    options: ["Judas", "John", "Thomas", "Peter"],
    correctIndex: 3,
    difficulty: "easy",
    reference: "Luke 22:61",
  },
  {
    id: "6",
    question: "What is the last word of the Bible?",
    options: ["Amen", "Jesus", "Saints", "Forever"],
    correctIndex: 0,
    difficulty: "hard",
    reference: "Revelation 22:21",
  },
  {
    id: "7",
    question: "Who wrote the majority of the New Testament?",
    options: ["Peter", "John", "Paul", "James"],
    correctIndex: 2,
    difficulty: "medium",
    reference: "Romans - Philemon",
  },
  {
    id: "8",
    question: "What food did God provide for the Israelites in the desert?",
    options: ["Bread and Fish", "Manna and Quail", "Figs and Honey", "Locusts"],
    correctIndex: 1,
    difficulty: "medium",
    reference: "Exodus 16",
  },
  // Add 100+ more here in production
];
