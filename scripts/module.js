import { MODULE_ID } from "./consts.js";
import { SETTING_ID_DEBUG_LOGGING, SETTING_ID_LEGENDARY_WORKAROUND, bindSettings } from "./settings.js";
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

		// ...and we need to put this here too
		flowSteps.set(`${MODULE_ID}:hackyLegendaryFixStructure`, hackyLegendaryFix);
		structureFlow.insertStepBefore("preStructureRollChecks", `${MODULE_ID}:hackyLegendaryFixStructure`);
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

		flowSteps.set(`${MODULE_ID}:hackyLegendaryFixStress`, hackyLegendaryFix);
		stressFlow.insertStepBefore("preOverheatRollChecks", `${MODULE_ID}:hackyLegendaryFixStress`);
	}
	debugLog("Flows registered.", true);
});


// This whole section is to set up variables for the Legendary trait workaround, which sucks. :P

let pack;
let docs;
let legendary;
Hooks.once("ready", async function () {
	try {
		debugLog("Searching for the vanilla Legendary trait to facilitate workarounds…");
		pack = game.packs.get("world.npc-items");
		docs = await pack.getDocuments();
		legendary = docs.find(x => x.system.lid == "npcf_legendary_ultra");
		debugLog("-> Feature located successfully.");
	} catch (error) {
		console.error(error)
		if (game.settings.get(MODULE_ID, SETTING_ID_LEGENDARY_WORKAROUND) > 0) {
			ui.notifications.error("Rebaked structure rules failed to locate the Legendary trait from the core book! This will cause things to break! Did you load the core NPCs?")
		}
	}
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
		debugLog("Target is not an NPC - using vanilla rules")
		return false;
	}
	if (actor.items.find(x => x.type === "npc_template" && x.name.toLowerCase().includes("ultra"))) {
		debugLog("NPC is an Ultra - using vanilla rules")
		return false;
	}
	return true;
}

// Determines if the provided roll contains multiple ones.
// Accounts for Legendary and the like. We use this as a function so we don't have to repeat it everywhere.
export function rollHasMultipleOnes(roll) {
	debugLog("Checking roll for multiple ones…")
	if (roll.terms[0].rolls?.length > 1) {
		debugLog("-> We've rolled multiple times - probably Legendary. Picking the one that isn't discarded.")
		const chosenIndex = roll.terms[0].results.findIndex(x => !x.discarded);
		roll = roll.terms[0].rolls[chosenIndex];
	}
	let totalOnes = roll.terms[0].results.filter(x => x.result === 1).length;
	debugLog(`Total rolled ones: ${totalOnes}`);
	return totalOnes > 1;
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
		console.error(`${MODULE_ID} | ${data} (flow state linked below)`);
		console.error(state);
		return;
	}
	ui.notifications.error(`Caught an error during flow ${state.name}, step ${state.currentStep}: ${data} (see console for details)`);
	console.error(state);
}
//#endregion

//#region Hacky fixes

/////////////////////////////////////
//                                 //
//  THIS IS NOT A PLACE OF HONOR   //
//                                 //
/////////////////////////////////////

// Problem: The lancer system will only automate Legendary if it detects the core book version. The ID is hardcoded.
// Solution: This horrible thing. Essentially, we remove the rebake version of Legendary and drop in the core book version.
// Optionally (enabled by default), change the new vanilla copy's name and description to mirror the rebaked one,
// so that it looks the same to things like the Scan macro but under the hood it's the vanilla version.
// If the base system's code ever gets touched up, self-reminder to make this something that isn't Terrible Awful Bad
async function hackyLegendaryFix(state) {
	const workaroundSetting = game.settings.get(MODULE_ID, SETTING_ID_LEGENDARY_WORKAROUND);
	if (!workaroundSetting || !state.actor?.is_npc())
		return true;
	debugLog(`Attempting to implement hacky Legendary fix for ${state.actor.name}...`);
	let rebakeLegendary = state.actor?.items.find(x => x.system.lid == "npc-rebake_npcf_legendary_ultra");
	if (!rebakeLegendary) {
		debugLog("-> NPC lacks the rebake Legendary feature. Skipping.")
		return true;
	}
	if (state.actor.items.find(x => x.system.lid == "npcf_legendary_ultra")) {
		debugLog("-> NPC already has the base Legendary feature. Skipping.")
		return true;
	}
	debugLog("-> Vanilla Legendary is not present but is required. Adding it now…")
	let [newFeature, unused] = await state.actor.quickOwn(legendary);
	console.log(newFeature);
	if (workaroundSetting == 2) {
		debugLog("-> Added. Masking name…")
		await newFeature.update({
			"name": rebakeLegendary.name,
			"system.effect": rebakeLegendary.system.effect,
			"system.origin.name": rebakeLegendary.system.origin.name
		})
	}
	debugLog("-> Vanilla Legendary has been added. Now removing the rebake one…")
	console.log(rebakeLegendary);
	await state.actor.removeClassFeatures(rebakeLegendary);
	await state.actor.deleteEmbeddedDocuments("Item", [rebakeLegendary.id]);
	debugLog("-> Rebake Legendary has been removed. We are good to go!")
}
//#endregion
