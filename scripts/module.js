import { rewordStructureCard, removeSystemTraumaButton, insertHullCheckButton, rewordStructureMultipleOnes } from "./structure.js";
import { rewordStressCard, removeMeltdownButton, rewordStressMultipleOnes } from "./stress.js"

// Unlike some other alternate structure/stress rules out there, the rebakes utilize bespoke mechanics for NPCs, separate from PCs
// As a result, we can't completely overwrite the existing flows; we need to account for both cases
// We do this by adding "postfix" flow steps throughout the regular ones that overwrite, add, or remove things depending on context
Hooks.once("lancer.registerFlows", (flowSteps, flows) => {
  const structureFlow = flows.get("StructureFlow");
  if (structureFlow) {
    // Alter the title and description of the card after it's assembled
    flowSteps.set("rewordStructureCard", rewordStructureCard);
    structureFlow.insertStepAfter("rollStructureTable", "rewordStructureCard");

    // Remove the bespoke button that appears for system trauma...
    flowSteps.set("removeSystemTraumaButton", removeSystemTraumaButton);
    structureFlow.insertStepAfter("structureInsertSecondaryRollButton", "removeSystemTraumaButton");

    // ...and replace it with a regular hull check button instead
    flowSteps.set("insertHullCheckButton", insertHullCheckButton);
    structureFlow.insertStepAfter("structureInsertHullCheckButton", "insertHullCheckButton");

    // ...and replace it with a regular hull check button instead
    flowSteps.set("rewordStructureMultipleOnes", rewordStructureMultipleOnes);
    structureFlow.insertStepAfter("checkStructureMultipleOnes", "rewordStructureMultipleOnes");
  }

  const stressFlow = flows.get("OverheatFlow");
  if (stressFlow) {
    // Alter the title and description of the card after it's assembled, just like structure
    flowSteps.set("rewordStressCard", rewordStressCard);
    stressFlow.insertStepAfter("rollOverheatTable", "rewordStressCard");

    // And always remove the engi check button; rebake NPCs don't use it
    flowSteps.set("removeMeltdownButton", removeMeltdownButton);
    stressFlow.insertStepAfter("overheatInsertEngCheckButton", "removeMeltdownButton");

    // ...and replace it with a regular hull check button instead
    flowSteps.set("rewordStressMultipleOnes", rewordStressMultipleOnes);
    stressFlow.insertStepAfter("checkOverheatMultipleOnes", "rewordStressMultipleOnes");
  }
});

// Wrapper function for game.i18n.localize(`Ilysen.Lancer-Rebake-Structure.${key}`)
export function getTranslation(key) {
  return game.i18n.localize(`Ilysen.Lancer-Rebake-Structure.${key}`)
}

export function isValidTarget(actor) {
	if (!actor.is_npc()) {
		console.log("Actor is not NPC, returning");
		return false;
	}
	if (actor.items.find(x => x.type === "npc_template" && x.name.toLowerCase().includes("ultra"))) {
		console.log("Actor is ultra, returning");
		return false;
	}
  return true;
}
