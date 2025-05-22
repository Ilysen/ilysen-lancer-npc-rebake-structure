import { MODULE_ID } from "./consts.js";
import { SETTING_ID_DEBUG_LOGGING, bindSettings } from "./settings.js";
import { npcZeroStressCheck, removeMeltdownButton, rewordStressCard, rewordStressMultipleOnes } from "./stress.js";
import { insertHullCheckButton, npcZeroStructureCheck, removeSystemTraumaButton, rewordStructureCard, rewordStructureMultipleOnes } from "./structure.js";

bindSettings();

//#region Flow registration

//////////////////////////
//                      //
//  FLOW REGISTRATION   //
//                      //
//////////////////////////

// Unlike some other alternate structure/stress rules out there, the rebakes utilize bespoke mechanics for NPCs, separate from PCs
// As a result, we can't completely overwrite the existing flows; we need to account for both cases
// We do this by adding "postfix" flow steps throughout the regular ones that overwrite, add, or remove things depending on context

Hooks.once("lancer.registerFlows", (flowSteps, flows) => {
	debugLog(`Registering flows...`, true);
	const structureFlow = flows.get("StructureFlow");
	if (structureFlow) {
		debugLog("-> Registering structure hooks", true);
		// Alter the title and description of the structure card after it's assembled
		flowSteps.set(`${MODULE_ID}:rewordStructureCard`, rewordStructureCard);
		structureFlow.insertStepAfter("rollStructureTable", `${MODULE_ID}:rewordStructureCard`);

		// Remove the bespoke button that appears for system trauma...
		flowSteps.set(`${MODULE_ID}:removeSystemTraumaButton`, removeSystemTraumaButton);
		structureFlow.insertStepAfter("structureInsertSecondaryRollButton", `${MODULE_ID}:removeSystemTraumaButton`);

		// ...and replace it with a regular hull check button instead
		flowSteps.set(`${MODULE_ID}:insertHullCheckButton`, insertHullCheckButton);
		structureFlow.insertStepAfter("structureInsertHullCheckButton", `${MODULE_ID}:insertHullCheckButton`);

		// Reword the card that displays when rolling multiple ones
		flowSteps.set(`${MODULE_ID}:rewordStructureMultipleOnes`, rewordStructureMultipleOnes);
		structureFlow.insertStepAfter("checkStructureMultipleOnes", `${MODULE_ID}:rewordStructureMultipleOnes`);

		// Finally, implement our own solution for checking for zero structure
		// This is definitely bad for compat, but since the original method terminates the flow here,
		// we need to use a bespoke thing here 
		flowSteps.set(`${MODULE_ID}:npcZeroStructureCheck`, npcZeroStructureCheck);
		structureFlow.insertStepBefore("noStructureRemaining", `${MODULE_ID}:npcZeroStructureCheck`);
	}

	const stressFlow = flows.get("OverheatFlow");
	if (stressFlow) {
		debugLog("-> Registering stress hooks", true);
		// Alter the title and description of the card after it's assembled, just like structure
		flowSteps.set(`${MODULE_ID}:rewordStressCard`, rewordStressCard);
		stressFlow.insertStepAfter("rollOverheatTable", `${MODULE_ID}:rewordStressCard`);

		// And always remove the engi check button; rebake NPCs don't use it
		flowSteps.set(`${MODULE_ID}:removeMeltdownButton`, removeMeltdownButton);
		stressFlow.insertStepAfter("overheatInsertEngCheckButton", `${MODULE_ID}:removeMeltdownButton`);

		flowSteps.set(`${MODULE_ID}:rewordStressMultipleOnes`, rewordStressMultipleOnes);
		stressFlow.insertStepAfter("checkOverheatMultipleOnes", `${MODULE_ID}:rewordStressMultipleOnes`);

		flowSteps.set(`${MODULE_ID}:npcZeroStressCheck`, npcZeroStressCheck);
		stressFlow.insertStepBefore("noStressRemaining", `${MODULE_ID}:npcZeroStressCheck`);
	}
	debugLog("Flows registered.", true);
});
//#endregion



//#region Helpers

////////////////
//            //
//  HELPERS   //
//            //
////////////////

// Wrapper function for game.i18n.localize(`${MODULE_ID}.${key}`)
export function getTranslation(key) {
	return game.i18n.localize(`${MODULE_ID}.${key}`)
}

// Sanity checks to make sure we only run the rebake stuff on NPCs.
// This excludes non-NPC actors as well as Ultras
export function isValidTarget(actor) {
	if (!actor.is_npc()) {
		debugLog("Target is not an NPC -- ignoring this step")
		return false;
	}
	if (actor.items.find(x => x.type === "npc_template" && x.name.toLowerCase().includes("ultra"))) {
		debugLog("NPC is an Ultra -- ignoring this step")
		return false;
	}
	return true;
}

// Logs to the console with the provided data prefixed by the module ID.
// Only functions when debug logging is enabled unless `override` is true.
export function debugLog(data, override = false) {
	if (!override && !game.settings.get(MODULE_ID, SETTING_ID_DEBUG_LOGGING)) {
		return;
	}
	console.log(`${MODULE_ID} | ${data}`);
}

// Logs the provided error to the console along with the current flow state.
// If debug logging is enabled, it also creates a visible notification for the error.
export function debugError(state, data) {
	if (!game.settings.get(MODULE_ID, SETTING_ID_DEBUG_LOGGING)) {
		console.error(`${MODULE_ID} | ${data} (Flow state: ${state})`);
		return;
	}
	ui.notifications.error(`Caught an error during flow ${state.name}, step ${state.currentStep}: ${data} (see console for details)`);
	console.log(`${MODULE_ID} | Flow state: ${state}`);
}
//#endregion
