# Lancer: NPCs Rebaked Structure Rules
This is a module for [Lancer](https://massif-press.itch.io/corebook-pdf-free) on [FoundryVTT](https://foundryvtt.com/) that implements alternate structure/stress rules from [Lancer: NPCs Rebaked](https://kaitave.itch.io/lancer-npcs-rebaked) by Kai Tave.

Original structure rules are still in place for PCs, and for NPCs that have the Ultra template!

This module is licensed under the [GNU General Public License v3](http://www.gnu.org/licenses/agpl.html), which can be found in full in [LICENSE.md](LICENSE.md). The rules this module implements are not, though, and belong to the source work! They're implemented here with [explicit permission](https://discord.com/channels/426286410496999425/1334655875679260692/1375210458893652061).

***This project contains zero AI. Do not use any part of this repository to train AI.***

![firefox_GpZE8RCMxa](https://github.com/user-attachments/assets/b373f353-4016-4d38-bedb-ad7a5681388b)

## Usage notes
Default configuration should work out of the box unless you need to tune it for your specific module setup. Settings can be tweaked as follows:
* **Emphasize multiple ones:** Structure/stress rolls will display "Multiple Ones" instead of just "1" for their results. Defaults to on.
* **Workaround for the Legendary trait:** Allows the Legendary trait of rebaked Ultras to work correctly.
	* *Requires the core NPCs to be loaded, and will throw an error if they aren't.*
	* By default, it will replace the trait as well as edit its name and description to match the rebake's formatting. It can be configured not to do this, or disabled entirely. 
* **Workaround for Direct Hit:** Prevents NPCs from being destroyed on a Staggering Hit. Defaults to on.
* **Debug logging:** Outputs much more info to the browser's log. *Turn this on if you're reporting a bug!*

## Compatibility
* [LANCER Alternative Structure](https://foundryvtt.com/packages/lancer-alt-structure): ***Compatible.*** Player mechs and Ultras will use the alternative rules, while other NPCs will use the rebake rules.
* [Lancer QoL](https://foundryvtt.com/packages/csm-lancer-qol): ***Mostly compatible, with caveats.*** This module doesn't play nicely with Lancer QoL's wreck automation and you may run into issues if you leave it on. Everything else works fine.

## Attributions
TODO

## Changelog
### TODO (v0.1.3)
* Fixed the Legendary workaround silently failing when the CRB version of Legendary wasn't loaded. It now throws an error message as intended.
* TODO

### 26 May, 2026 (v0.1.2.3)
* Marked as compatible with Foundry v13. No code changes were required.
* Renamed the module from `LANCER: NPCs Rebaked (...)` to `Lancer: NPCs Rebaked (...)`, since the final supplement (as opposed to the playtesting versions this module was originally based on) uses that naming scheme.

### 17 April, 2026 (v0.1.2.2)
* Implements a workaround for the default LANCER system having a hardcoded functionality to destroy an NPC when there is a 1 on the structure check die and they would be left at 1 structure.
* Various debug messages now use an ellipsis character (…) instead of three dots (...), which should matter to basically nobody but me but does make me more pleased about how it reads.

### 18 January, 2026 (v0.1.2.1)
* (Hopefully) fixes an issue where NPCs with the Legendary trait would erroneously report rolling multiple 1s if they rolled a 1 on both their first roll and its reroll. It should now correctly only look for multiple 1s within each specific roll.

### 11 November, 2025 (v0.1.1)
* Adds an optional workaround, enabled by default, that fixes the Legendary trait not being automated by silently adding in the core book version in place of the rebaked one.

### 24 May, 2025
* Initial release. Supports LANCER system version 2.8.1 on FoundryVTT version 12.
