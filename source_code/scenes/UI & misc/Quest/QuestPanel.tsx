import React, { useEffect, useState } from "react";

/* Quest Status Enum */
export const QUEST_STATUS = {
  NONEXISTENT: 0,
  STARTED: 1,
  COMPLETE: 2,
  FAILED: 3,
} as const;

type QuestStatus = number;

type QuestMap = Record<string, QuestStatus>;

export const QuestPanel: React.FC = () => {
  const [quests, setQuests] = useState<QuestMap>({});
  const [title, setTitle] = useState("Quests");

  /* Sync from legacy window.quest */
  useEffect(() => {
    if (!window.quest) return;

    setTitle(window.ui?.t("Quests"));

    const sync = () => {
      setQuests({ ...window.quest.get_quest_list() });
    };

    sync();

    // Optional: auto refresh
    const id = setInterval(sync, 500);

    return () => clearInterval(id);
  }, []);

  /* Convert status to label */
  const getStatusLabel = (status: QuestStatus) => {
    switch (status) {
      case QUEST_STATUS.STARTED:
        return "🟡 Started";
      case QUEST_STATUS.COMPLETE:
        return "✅ Complete";
      case QUEST_STATUS.FAILED:
        return "❌ Failed";
      default:
        return "⚪ Unknown";
    }
  };

  const questEntries = Object.entries(quests);

  return (
    <div className="quests-tab">
      <h2>{title}</h2>

      {questEntries.length === 0 ? (
        <p>{window.ui.t("questdiag0")}</p>
      ) : (
        <ul className="quest-list">
          {questEntries.map(([name, status]) => (
            <li key={name} className="quest-item">
              <span className="quest-name">📜 {name}</span>
              <span className="quest-status">
                {getStatusLabel(status)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
