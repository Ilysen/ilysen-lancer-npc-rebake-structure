import { getTranslation, isValidTarget } from "./module.js";

export async function rewordStructureCard(state) {
	if (!isValidTarget(state.actor))
		return true;
	if (state.data.title === "Glancing Blow") {
		state.data.title = getTranslation("structure.glancing_blow.title");
		state.data.desc = getTranslation("structure.glancing_blow.description");
	} else if (state.data.title === "System Trauma") {
		state.data.title = getTranslation("structure.system_failure.title");
		state.data.desc = getTranslation("structure.system_failure.description");
	} else if (state.data.title === "Direct Hit") {
		state.data.title = getTranslation("structure.staggering_hit.title");
		state.data.desc = getTranslation("structure.staggering_hit.description");
	} else if (state.data.title === "Crushing Hit") {
		state.data.title = getTranslation("structure.target_destroyed.title");
		state.data.desc = getTranslation("structure.target_destroyed.description");
	}
	console.log(state);
	return true;
}

export async function rewordStructureMultipleOnes(state) {
	if (!isValidTarget(state.actor))
		return true;
	if (state.data.title === "Crushing Hit") {
		state.data.title = getTranslation("structure.target_destroyed.title");
		state.data.desc = getTranslation("structure.target_destroyed.description");
	}
	console.log(state);
	return true;
}

export async function removeSystemTraumaButton(state) {
	if (!state.data.embedButtons)
		return true;
	if (!isValidTarget(state.actor))
		return true;
	state.data.embedButtons = state.data.embedButtons.filter(x => !x.includes(`data-flow-type="secondaryStructure"`));
	return true;
}

export async function insertHullCheckButton(state) {
	if (!isValidTarget(state.actor))
		return true;
	console.log(state.data);
	// where were going we won't need buttons to press
	state.data.embedButtons = [] || state.data.embedButtons.filter(x => !x.includes(`data-check-type="hull"`));
	if (state.data.result.roll.total > 1 && state.data.result.roll.total < 5) {
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
	}
	return true;
}

export async function npcZeroStructureCheck(state) {
	if (!state.data)
		throw new TypeError(`Structure roll flow data missing!`);

	let actor = state.actor;
	if (!actor.is_npc()) {
		ui.notifications.warn("Only npcs and mechs can roll structure.");
		return false;
	}

	if (state.data.remStruct > 0) {
		// The mech is intact, we don't need to do anything in this step.
		return true;
	}

	// You ded. Print the card and stop the flow.
	const printCard = game.lancer.flowSteps.get("printStructureCard");
	if (!printCard)
		throw new TypeError(`printStructureCard flow step missing!`);
	if (typeof printCard !== "function")
		throw new TypeError(`printStructureCard flow step is not a function.`);
	state.data.title = getTranslation("structure.target_destroyed.title");
	state.data.desc = getTranslation("structure.target_destroyed.description");
	state.data.result = undefined;

	printCard(state);
	// This flow is finished now, so we return false to stop the flow.
	return false;
}
