import { getTranslation, isValidTarget } from "./module.js";

export async function rewordStressCard(state) {
	if (!isValidTarget(state.actor))
		return true;
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
	console.log(state);
	return true;
}

export async function rewordStressMultipleOnes(state) {
	if (!isValidTarget(state.actor))
		return true;
	if (state.data.title === "Irreversible Meltdown") {
		state.data.title = getTranslation("stress.meltdown.title");
		state.data.desc = getTranslation("stress.meltdown.description");
	}
	console.log(state);
	return true;
}

export async function removeMeltdownButton(state) {
	if (!state.data.embedButtons)
		return true;
	if (!isValidTarget(state.actor))
		return true;
	state.data.embedButtons = [] || state.data.embedButtons.filter(x => !x.includes(`data-check-type="engineering"`));
}

export async function npcZeroStressCheck(state) {
	if (!state.data)
		throw new TypeError(`Structure roll flow data missing!`);

	let actor = state.actor;
	if (!actor.is_npc()) {
		ui.notifications.warn("Only npcs and mechs can roll structure.");
		return false;
	}

	if (state.data.remStress > 0) {
		// The mech is intact, we don't need to do anything in this step.
		return true;
	}

	// You ded. Print the card and stop the flow.
	const printCard = game.lancer.flowSteps.get("printOverheatCard");
	if (!printCard)
		throw new TypeError(`printStructureCard flow step missing!`);
	if (typeof printCard !== "function")
		throw new TypeError(`printStructureCard flow step is not a function.`);
	state.data.title = getTranslation("stress.meltdown.title");
	state.data.desc = getTranslation("stress.meltdown.description");
	state.data.result = undefined;

	printCard(state);
	// This flow is finished now, so we return false to stop the flow.
	return false;
}
