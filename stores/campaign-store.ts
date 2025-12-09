import { CAMPAIGN_DATA } from "@/data/campaign-data";
import { secureStorage } from "@/utils/storage-adapter";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CampaignState {
  unlockedStageIds: string[]; // Changed from single ID to array
  unlockedLevelIds: string[];
  completedLevelIds: string[];
  levelStars: Record<string, number>;
  stagePieces: Record<string, number[]>;
  relicsRestored: string[]; // StageIDs where user has clicked "Restore"

  // Actions
  completeLevel: (
    stageId: string,
    levelId: string,
    scorePercentage: number
  ) => { stars: number; newPiece: boolean; stageUnlocked: boolean };

  unlockRelic: (stageId: string) => void;
  isLevelUnlocked: (id: string) => boolean;
  isStageUnlocked: (id: string) => boolean;
  getStageProgress: (stageId: string) => number;
  getTotalStarsForStage: (stageId: string) => number;
  resetCampaign: () => void;
}

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set, get) => ({
      unlockedStageIds: ["stage_1"],
      unlockedLevelIds: ["lvl_1_1"],
      completedLevelIds: [],
      levelStars: {},
      stagePieces: {},
      relicsRestored: [],

      isLevelUnlocked: (id) => get().unlockedLevelIds.includes(id),
      isStageUnlocked: (id) => get().unlockedStageIds.includes(id),

      getTotalStarsForStage: (stageId) => {
        const stage = CAMPAIGN_DATA.find((s) => s.id === stageId);
        if (!stage) return 0;
        return stage.levels.reduce(
          (acc, lvl) => acc + (get().levelStars[lvl.id] || 0),
          0
        );
      },

      getStageProgress: (stageId) => {
        const stage = CAMPAIGN_DATA.find((s) => s.id === stageId);
        if (!stage) return 0;
        const stageLevelIds = stage.levels.map((l) => l.id);
        const completedCount = stageLevelIds.filter((id) =>
          get().completedLevelIds.includes(id)
        ).length;
        return (completedCount / stageLevelIds.length) * 100;
      },

      unlockRelic: (stageId) => {
        set((state) => ({
          relicsRestored: [...state.relicsRestored, stageId],
        }));
      },

      completeLevel: (stageId, levelId, scorePercentage) => {
        const state = get();

        // 1. Calculate Stars
        // >99% = 3 Stars (Perfect)
        // >75% = 2 Stars (Great) -> Unlocks next level
        // >50% = 1 Star (Good)
        const stars =
          scorePercentage >= 99
            ? 3
            : scorePercentage >= 75
            ? 2
            : scorePercentage >= 50
            ? 1
            : 0;

        // If 0 stars, no progress
        if (stars === 0)
          return { stars: 0, newPiece: false, stageUnlocked: false };

        // Save high score
        const currentStars = state.levelStars[levelId] || 0;
        const newStarsRecord = {
          ...state.levelStars,
          [levelId]: Math.max(currentStars, stars),
        };

        // Prepare Unlock Lists
        const newUnlockedLevels = new Set(state.unlockedLevelIds);
        const newUnlockedStages = new Set(state.unlockedStageIds);
        const newCompletedLevels = new Set(state.completedLevelIds);

        let stageUnlocked = false;

        // Mark Level Completed
        newCompletedLevels.add(levelId);

        const stage = CAMPAIGN_DATA.find((s) => s.id === stageId);

        // 2. Logic: If stars >= 2, unlock next level
        if (stage && stars >= 2) {
          const currentLevelIdx = stage.levels.findIndex(
            (l) => l.id === levelId
          );

          // if (currentIdx !== -1 && currentIdx < stage.levels.length - 1) {
          //   // Unlock next level in this stage
          //   const nextLevel = stage.levels[currentIdx + 1];
          //   if (!newUnlockedLevels.includes(nextLevel.id)) {
          //     newUnlockedLevels.push(nextLevel.id);
          //   }
          // } else if (currentIdx === stage.levels.length - 1) {
          //   // Finished last level of this stage!
          //   // Check if we can unlock next stage
          //   const currentStageIdx = CAMPAIGN_DATA.findIndex(
          //     (s) => s.id === stageId
          //   );
          //   if (currentStageIdx < CAMPAIGN_DATA.length - 1) {
          //     const nextStage = CAMPAIGN_DATA[currentStageIdx + 1];
          //     if (!newUnlockedStages.includes(nextStage.id)) {
          //       newUnlockedStages.push(nextStage.id);
          //       // Unlock first level of next stage
          //       if (nextStage.levels.length > 0)
          //         newUnlockedLevels.push(nextStage.levels[0].id);
          //       stageUnlocked = true;
          //     }
          //   }
          // }
          if (currentLevelIdx !== -1) {
            // A. Unlock Next Level in Same Stage
            if (currentLevelIdx < stage.levels.length - 1) {
              const nextLevel = stage.levels[currentLevelIdx + 1];
              newUnlockedLevels.add(nextLevel.id);
            }
            // B. Stage Complete! Unlock Next Stage
            else {
              const currentStageIdx = CAMPAIGN_DATA.findIndex(
                (s) => s.id === stageId
              );
              if (
                currentStageIdx !== -1 &&
                currentStageIdx < CAMPAIGN_DATA.length - 1
              ) {
                const nextStage = CAMPAIGN_DATA[currentStageIdx + 1];

                if (!newUnlockedStages.has(nextStage.id)) {
                  newUnlockedStages.add(nextStage.id);
                  stageUnlocked = true;

                  // Also unlock the first level of the new stage
                  if (nextStage.levels.length > 0) {
                    newUnlockedLevels.add(nextStage.levels[0].id);
                  }
                }
              }
            }
          }
        }

        // 3. Logic: Puzzle Pieces (Relics)
        // 1 Level = 1 Piece (specifically tied to index)
        // Only awarded if stars >= 2
        let newPieces = { ...state.stagePieces };
        let pieceAwarded = false;

        if (stars >= 2 && stage) {
          const currentPieces = newPieces[stageId] || [];
          const lvlIndex = stage.levels.findIndex((l) => l.id === levelId);
          // 9 levels map perfectly to 0-8 pieces
          // If more levels, we use modulo, or map specifically in data
          const pieceIndex = lvlIndex % 9;

          if (!currentPieces.includes(pieceIndex)) {
            newPieces[stageId] = [...currentPieces, pieceIndex];
            pieceAwarded = true;
          }
        }

        set({
          levelStars: newStarsRecord,
          unlockedLevelIds: Array.from(newUnlockedLevels),
          unlockedStageIds: Array.from(newUnlockedStages),
          completedLevelIds: Array.from(newCompletedLevels),
          stagePieces: newPieces,
        });

        return { stars, newPiece: pieceAwarded, stageUnlocked };
      },

      resetCampaign: () => {
        set({
          unlockedStageIds: ["stage_1"],
          unlockedLevelIds: ["lvl_1_1"],
          completedLevelIds: [],
          levelStars: {},
          stagePieces: {},
          relicsRestored: [],
        });
      },
    }),
    {
      name: "biblical-chronicles-storage",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
