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

/*async function performHullCheck(state) { // here be dragons
	// todo: fix for PCs :awaaaaalol:
	if (!state.actor.is_npc()) {
		console.log("Actor is not NPC, returning");
		return true;
	}
	console.log(state.actor);
	const autoFail = state.actor.parent.hasStatusEffect("impaired");
	let success = false;
	let rollFlow;
	const statFlow = game.lancer.flows.get("StatRollFlow");
	rollFlow = new statFlow(state.actor, { title: "STRUCTURE :: HULL ", path: "system.hull" });
	success = await rollFlow.begin();
	if (autoFail) {
		rollFlow.result = 0;
		success = false;
	}
	if (success) {
		state.data.title = game.i18n.localize("Ilysen.Lancer-Rebake-Structure.HullCheckTitles.success");
		state.data.desc = game.i18n.localize("Ilysen.Lancer-Rebake-Structure.HullCheckDescriptions.success");
	} else {
		state.data.title = game.i18n.localize(`Ilysen.Lancer-Rebake-Structure.HullCheckTitles.${autoFail ? "auto_" : ""}fail`);
		state.data.desc = game.i18n.localize("Ilysen.Lancer-Rebake-Structure.HullCheckDescriptions.fail");
	}
	console.log(rollFlow.state);
	return true;
}*/
