import { MODULE_ID } from "./consts.js";
import { debugError, debugLog } from "./module.js";

export const SETTING_ID_DEBUG_LOGGING = "debug_logging";

// Module config setup function.
export const bindSettings = () => {
	Hooks.on("init", () => {
		try {
			debugLog("Registering settings...", true);
			game.settings.register(MODULE_ID, SETTING_ID_DEBUG_LOGGING, {
				name: `${MODULE_ID}.settings.debug_logging.name`,
				hint: `${MODULE_ID}.settings.debug_logging.hint`,
				scope: "client",
				config: true,
				type: Boolean,
				default: false
			});
			debugLog("Settings have been registered. We should be all set!", true);
		} catch (error) {
			debugError(error);
		}
	})
}
