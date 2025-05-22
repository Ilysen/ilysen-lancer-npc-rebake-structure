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
