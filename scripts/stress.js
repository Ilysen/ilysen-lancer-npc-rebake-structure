import { MODULE_ID } from "./consts.js";
import { debugError, debugLog, getTranslation, isValidTarget } from "./module.js";
import { SETTING_ID_DEBUG_LOGGING } from "./settings.js";

// Rewords the stress card by checking
export async function rewordStressCard(state) {
	try {
		if (!isValidTarget(state.actor))
			return true;
		debugLog("Rewording stress card...");
		if (game.settings.get(MODULE_ID, SETTING_ID_DEBUG_LOGGING))
			console.log(state);
		if (state.data.title === "Emergency Shunt") {
			state.data.title = getTranslation("stress.emergency_shunt.title");
			state.data.desc = getTranslation("stress.emergency_shunt.description");
		} else if (state.data.title === "Destabilized Power Plant") {
			state.data.title = getTranslation("stress.instability.title");
			state.data.desc = getTranslation("stress.instability.description");
		} else if (state.data.title.includes("Meltdown")) {
			state.data.title = getTranslation("stress.meltdown.title");
			state.data.desc = getTranslation("stress.meltdown.description");
		}
		debugLog(`-> ${state.data.title}`);
		return true;
	} catch (error) {
		debugError(state, error);
		return false;
	}
}

export async function rewordStressMultipleOnes(state) {
	try {
		if (!isValidTarget(state.actor))
			return true;
		debugLog("Rewording multiple ones on stress roll...");
		if (state.data.title === "Irreversible Meltdown") {
			state.data.title = getTranslation("stress.meltdown.title");
			state.data.desc = getTranslation("stress.meltdown.description");
			debugLog(`-> ${state.data.title}`);
		} else {
			debugLog(`Actually we only rolled one 1. Oops. Skipping...`);
		}
		return true;
	} catch (error) {
		debugError(state, error);
		return false;
	}
}

export async function removeMeltdownButton(state) {
	try {
		if (!isValidTarget(state.actor))
			return true;
		debugLog(`Removing button for engineering check, if it's present`);
		state.data.embedButtons = state.data.embedButtons?.filter(x => !x.includes(`data-check-type="engineering"`)) || [];
	} catch (error) {
		debugError(state, error);
		return false;
	}
}

export async function npcZeroStressCheck(state) {
	try {
		if (!isValidTarget(state.actor))
			return true;
		debugLog(`Handling zero stress remaining for actor ${state.actor}`);
		if (state.data.remStress > 0) {
			debugLog("We have more than zero structure. Aborting");
			return true;
		}
		debugLog(`We are at zero stress. Assembling card data.`);
		const printCard = game.lancer.flowSteps.get("printOverheatCard");
		state.data.title = getTranslation("stress.meltdown.title");
		state.data.desc = getTranslation("stress.meltdown.description");
		state.data.result = undefined;
		printCard(state);
		debugLog("Card printed. Terminating stress flow (this is intentional).");
		return false;
	} catch (error) {
		debugError(state, error);
		return false;
	}
}
