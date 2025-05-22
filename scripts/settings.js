import { MODULE_ID } from "./consts.js";
import { debugError, debugLog } from "./module.js";

export const SETTING_ID_DEBUG_LOGGING = "debug_logging";
export const SETTING_ID_EMPHASIZE_MULTIPLE_ONES = "emphasize_multiple_ones";

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
			game.settings.register(MODULE_ID, SETTING_ID_EMPHASIZE_MULTIPLE_ONES, {
				name: `${MODULE_ID}.settings.emphasize_multiple_ones.name`,
				hint: `${MODULE_ID}.settings.emphasize_multiple_ones.hint`,
				scope: "world",
				config: true,
				type: Boolean,
				default: true
			});
			debugLog("Settings have been registered. We should be all set!", true);
		} catch (error) {
			debugError(error);
		}
	})
}
