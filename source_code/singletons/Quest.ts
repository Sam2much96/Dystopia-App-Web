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
    (3) Add 100 and 200 enemies kill coint quests from new NPC's
    */

    public STATUS: Map<string, number> = new Map([
            ['NONEXISTENT', 0],
            ['STARTED', 1],
            ['COMPLETE', 2],
            ['FAILED', 3],
        ]);

    public questList: Record<string, number> = {}; // quest name → status code
    public statsUI: HTMLElement | null = null;
    public questUITranslate? :string; 
   constructor(){
    this.statsUI = document.querySelector('.v11_5'); // fetch the status hud ui element
   }

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

      // Convert quest to json string
    toStringData(): string {
        return JSON.stringify(this.questList);
    }

    // Restore quest json from string
    fromStringData(data: string) {
        this.questList = JSON.parse(data);
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



    renderQuests(): void {
        /**
         * Features:
         * (1) serialise quest singleton data to the stats game hud
         * 
         * to do:
         * (1) fix code bloc to fetch quest data from class and render 
         * (2) connect code bloc to the statsHUD UI state machine (done)
         * 
         */
        // Select the element
        //this.statsUI = document.querySelector('.v11_5');
        if (!this.statsUI) return console.warn("debug Inventory UI");

        this.statsUI.innerHTML = ""; // clear UI
        this.questUITranslate = window.dialogs.t("Quests");

        //debug quest list
        //console.log("render quests triggered: ",this.get_quest_list());
        // to do :
        // (1) serialise the quest data into this function
        //const questStatus = quest.get_status(questName);
//        console.debug("Quest Debug 1:", questStatus, "/", quest);

        // Quest state machine
        // to do:
        // (1) format logic to categorize all quests into the game UI
        //switch (questStatus) {
            //New quest logic
       //     case quest.STATUS.get("NONEXISTENT"):
       //         quest.accept_quest(questName);
       //         return initialText;

            // Quest started logic
       //     case quest.STATUS.get("STARTED"):
       //         if (inventory.get(requiredItem) >= requiredAmount) {
       //             inventory.set(requiredItem, requiredAmount);
       //             quest.change_status(questName, quest.STATUS.get("COMPLETE") ?? 2);
       //             inventory.set(rewardItem, rewardAmount);
       //             return `${deliveredText}. here's your rewards ${rewardAmount} ${rewardItem} `;
       //         } else {
       //             return pendingText;
       //         }
       //     // Quest completed logic
       //     case quest.STATUS.get("COMPLETE"):
       //         return `Quest already completed. ${deliveredText}`;
        //to do:
        // (1) serialise quest data into ui to replace placeholder
        // (2) use the commented logic above + web hooks for this render code
        let y = this.toStringData();
        this.statsUI.innerHTML = `
            <div class="quests-tab">
                <h2> ${this.questUITranslate}</h2>
                <ul>
                    <li>🗺️ </li>
                    <li>📜 ${y}</li>
                    
                </ul>
            </div>
        `;

        //old render
                  //  <div class="quests-tab">
                //<h2>Quest Log</h2>
                //<ul>
                 //   <li>🗺️ Started: Explore the world</li>
                 //   <li>📜 Ongoing: ${y}</li>
                 //   <li>✅ Failed: None</li>
                //</ul>
            //</div>
    }

}

export class QuestGivers {

    /**
     * Process a quest interaction from a quest-giver NPC.
     * 
     * Features:
     * (1) documentation
     * 
     * to do:
     * (1) serialise quest logic to map quest states to the stats HUD
     *  
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