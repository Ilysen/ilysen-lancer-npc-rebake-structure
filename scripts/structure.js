import { MODULE_ID } from "./consts.js";
import { debugError, debugLog, getTranslation, isValidTarget } from "./module.js";
import { SETTING_ID_DEBUG_LOGGING } from "./settings.js";

export async function rewordStructureCard(state) {
	try {
		if (!isValidTarget(state.actor))
			return true;
		debugLog("Rewording structure card...");
		if (game.settings.get(MODULE_ID, SETTING_ID_DEBUG_LOGGING))
			console.log(state);
		const structRoll = parseInt(state.data.result.total);
		switch (structRoll) {
			case 6:
			case 5:
				state.data.title = getTranslation("structure.glancing_blow.title");
				state.data.desc = getTranslation("structure.glancing_blow.description");
				break;
			case 4:
			case 3:
			case 2:
				state.data.title = getTranslation("structure.system_failure.title");
				state.data.desc = getTranslation("structure.system_failure.description");
				break;
			case 1:
				state.data.title = getTranslation("structure.staggering_hit.title");
				state.data.desc = getTranslation("structure.staggering_hit.description");
				break;
		}
		debugLog(`-> ${state.data.title}`);
		return true;
	} catch (error) {
		debugError(state, error);
		return false;
	}
}

export async function rewordStructureMultipleOnes(state) {
	try {
		if (!isValidTarget(state.actor))
			return true;
		debugLog("Checking multiple ones on structure roll...");
		if (state.data.result.roll.terms[0].results.filter(x => x.result === 1).length > 1) {
			debugLog("Rolled multiple ones. Rewording.");
			state.data.title = getTranslation("structure.target_destroyed.title");
			state.data.desc = getTranslation("structure.target_destroyed.description");
			debugLog(`-> ${state.data.title}`);
		} else {
			debugLog("Did not rolled multiple ones. Skipping.");
		}
		return true;
	} catch (error) {
		debugError(state, error);
		return false;
	}
}

export async function removeSystemTraumaButton(state) {
	try {
		if (!isValidTarget(state.actor))
			return true;
		debugLog(`Removing button for system trauma roll, if it's present`);
		state.data.embedButtons = state.data.embedButtons?.filter(x => !x.includes(`data-flow-type="secondaryStructure"`)) || [];
		return true;
	} catch (error) {
		debugError(state, error);
		return false;
	}
}

export async function insertHullCheckButton(state) {
	try {
		if (!isValidTarget(state.actor))
			return true;
		debugLog(`Removing button for hull check, if it's erroneously present (button data: ${state.data.embedButtons})`);
		// where were going we won't need buttons to press
		state.data.embedButtons = [] || state.data.embedButtons.filter(x => !x.includes(`data-check-type="hull"`));
		if (state.data.result.roll.total > 1 && state.data.result.roll.total < 5) {
			debugLog(`Structure rolled System Failure. Adding a hull check button. (button data: ${state.data.embedButtons})`);
			// sadly this is hardcoded in the base lancer system -- we need to remake it from scratch
			state.data.embedButtons = state.data.embedButtons || [];
			state.data.embedButtons.push(`<a
			  class="flow-button lancer-button"
			  data-flow-type="check"
			  data-check-type="hull"
			  data-actor-id="${state.actor.uuid}"
			>
			  <i class="fas fa-dice-d20 i--sm"></i> HULL
			</a>`);
			debugLog(`Hull check button should be successfully added (button data: ${state.data.embedButtons})`);
		}
		return true;
	} catch (error) {
		debugError(state, error);
		return false;
	}
}

export async function npcZeroStructureCheck(state) {
	try {
		if (!isValidTarget(state.actor))
			return true;
		debugLog(`Handling zero structure remaining for actor ${state.actor}`);
		if (state.data.remStruct > 0) {
			debugLog("We have more than zero structure. Aborting");
			return true;
		}
		debugLog(`We are at zero structure. Assembling card data.`);
		const printCard = game.lancer.flowSteps.get("printStructureCard");
		state.data.title = getTranslation("structure.target_destroyed.title");
		state.data.desc = getTranslation("structure.target_destroyed.description");
		state.data.result = undefined;
		printCard(state);
		debugLog("Card printed. Terminating structure flow (this is intentional).");
		return false;
	} catch (error) {
		debugError(state, error);
		return false;
	}
}
