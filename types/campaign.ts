export type ChallengeType =
  | "quiz"
  | "order"
  | "fill-blank"
  | "matching"
  | "timeline";

export interface CampaignChallenge {
  id: string;
  type: ChallengeType;
  question: string;
  data: string[]; // Options for quiz, Words to order for order, etc.
  correctAnswer: string | string[]; // String for quiz/fill, Array for order
  verseReference?: string;
}

// Bonus: Optional Advanced Challenge Types
export interface AdvancedCampaignChallenge extends CampaignChallenge {
  timeLimit?: number; // Optional time limit in seconds
  hint?: string; // Optional hint for difficult challenges
  explanation?: string; // Explanation shown after answering
}

// Bonus: Level unlock requirements
export interface LevelUnlockRequirements {
  requiredStars?: number; // Minimum stars from previous levels
  requiredLevels?: string[]; // Specific levels that must be completed
  minimumLevel?: number; // Player level requirement
}

export interface CampaignLevel {
  id: string;
  title: string;
  description: string;
  challenges: CampaignChallenge[];
  xpReward: number;
  difficulty: 1 | 2 | 3;
  unlockRequirements?: LevelUnlockRequirements; // Optional unlock conditions
  completionReward?: {
    puzzlePiece?: number; // Which puzzle piece this level awards (0-8)
    specialItem?: string; // Special unlockable item
  };
}

export interface CampaignStage {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // The "Masterpiece" to unlock
  levels: CampaignLevel[];
  order: number;
  unlockedByDefault?: boolean; // First stage only
  stageCompletionReward?: {
    title: string; // e.g., "Master of Genesis"
    badgeUrl: string;
  };
}

export interface UserCampaignProgress {
  unlockedStageId: string;
  unlockedLevelIds: string[]; // IDs of levels user can play
  completedLevelIds: string[]; // IDs of levels finished (3 stars)
  collectedPuzzlePieces: Record<string, number[]>; // StageID -> Array of collected piece indices (0-8)
  stars: Record<string, number>; // LevelID -> Stars (1-3)
  stageCompletionStatus: Record<string, boolean>; // StageID -> completed
  collectedBadges: string[]; // Badge IDs collected
}
