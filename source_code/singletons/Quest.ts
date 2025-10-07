import {Inventory} from "./Inventory";


export class Quest {

    /* 
    Handles all Quest logic
    
    Required:
    (1) Diaglogs singleton (done)
    (2) Quest giver NPC (done)
    (3) 

    To Do:
    (1) Implement quest translations
    (2) IMplement csv parsing
    */

    public STATUS: Map<string, number> = new Map([
            ['NONEXISTENT', 0],
            ['STARTED', 1],
            ['COMPLETE', 2],
            ['FAILED', 3],
        ]);

    public questList: Record<string, number> = {}; // quest name → status code

   constructor(){}

   // Get the status of a quest. If it's not found it returns STATUS.NONEXISTENT
   get_status(quest_name : string) : number{
        // If the quest exists, return its status
        if (quest_name in this.questList) {
                return this.questList[quest_name];
            }

        else{
            // Otherwise return "NONEXISTENT"
            return this.STATUS.get('NONEXISTENT') ?? 0;
            }
        }


    accept_quest(quest_name: string): boolean {
        // If the quest already exists, reject starting it again
        if (quest_name in this.questList) {
            return false;
        }

        // Otherwise, mark it as started
        const startedStatus = this.STATUS.get('STARTED') ?? 1;
        this.questList[quest_name] = startedStatus;

        // Optional: trigger a signal/event if you have an event system
        // this.emit("quest_changed", quest_name, startedStatus);

        return true;
    }
    change_status(quest_name: string, status: number): boolean {
        if (this.questList.hasOwnProperty(quest_name)) {
            this.questList[quest_name] = status;

            // show this via dialogue
            window.dialogs.show_dialog("",`Quest changed: ${quest_name} → ${status}`);

            return true;
        } else {
            return false;
        }
    }



    get_quest_list(): Record<string, number> {
        // Return a shallow copy (duplicate) of the quest list
        return { ...this.questList };
    }

    remove_quest(quest_name: string): boolean {
        if (quest_name in this.questList) {
            delete this.questList[quest_name];
            window.dialogs.show_dialog("",`Quest changed: ${quest_name} → NONEXISTENT`);
            return true;
        }
        return false;
        }


    list(status: number): string[] {
        const quests = Object.keys(this.questList);

        if (status === -1) {
            return quests;
        }

        const result: string[] = [];
        for (const quest of quests) {
            if (this.questList[quest] === status) {
                result.push(quest);
            }
        }
        return result;
    }


}

export class QuestGivers {

    /**
     * Process a quest interaction from a quest-giver NPC.
     * 
     * Features:
     * (1) documentation
     * 
     * Bugs:
     * (1) quest collision spammer on collision
     *  - this bug hides most of the quest initial quests
     */
    static process(
        questName: string,
        initialText: string,
        requiredItem: string,
        requiredAmount: number,
        rewardItem: string,
        rewardAmount: number,
        deliveredText: string,
        pendingText: string
    ): string {

        let inventory : Inventory =window.inventory;
        let quest : Quest = window.quest; 
        const questStatus = quest.get_status(questName);
//        console.debug("Quest Debug 1:", questStatus, "/", quest);

        // Quest state machine
        switch (questStatus) {
            //New quest logic
            case quest.STATUS.get("NONEXISTENT"):
                quest.accept_quest(questName);
                return initialText;

            // Quest started logic
            case quest.STATUS.get("STARTED"):
                if (inventory.get(requiredItem) >= requiredAmount) {
                    inventory.set(requiredItem, requiredAmount);
                    quest.change_status(questName, quest.STATUS.get("COMPLETE") ?? 2);
                    inventory.set(rewardItem, rewardAmount);
                    return `${deliveredText}. here's your rewards ${rewardAmount} ${rewardItem} `;
                } else {
                    return pendingText;
                }
            // Quest completed logic
            case quest.STATUS.get("COMPLETE"):
                return `Quest already completed. ${deliveredText}`;

            default:
                return "";
        }
    }
}