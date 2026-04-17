# LANCER: NPCs Rebaked Structure Rules

This is a module for [Lancer](https://massif-press.itch.io/corebook-pdf-free) on [FoundryVTT](https://foundryvtt.com/) that implements alternate structure/stress rules from Lancer: NPCs Rebaked by Kai Tave. These rules are currently in playtesting, and you can find the drafts on [this thread in Pilot NET](https://discord.com/channels/426286410496999425/1334655875679260692). 

Original structure rules are still in place for PCs, and for NPCs that have the Ultra template!

This module is licensed under the [GNU General Public License v3](http://www.gnu.org/licenses/agpl.html), which can be found in full in [LICENSE.md](LICENSE.md). The rules this module implements are not, though, and belong to the source work! They're implemented here with [explicit permission](https://discord.com/channels/426286410496999425/1334655875679260692/1375210458893652061).

![firefox_GpZE8RCMxa](https://github.com/user-attachments/assets/b373f353-4016-4d38-bedb-ad7a5681388b)

### Changelog

#### 17 April, 2026 (v0.1.2.2)
* Implements a workaround for the default LANCER system having a hardcoded functionality to destroy an NPC when there is a 1 on the structure check die and they would be left at 1 structure.
* Various debug messages now use an ellipsis character (…) instead of three dots (...), which should matter to basically nobody but me but does make me more pleased about how it reads.

#### 18 January, 2026 (v0.1.2.1)
* (Hopefully) fixes an issue where NPCs with the Legendary trait would erroneously report rolling multiple 1s if they rolled a 1 on both their first roll and its reroll. It should now correctly only look for multiple 1s within each specific roll.

#### 11 November, 2025 (v0.1.1)
* Adds an optional workaround, enabled by default, that fixes the Legendary trait not being automated by silently adding in the core book version in place of the rebaked one.

#### 24 May, 2025
* Initial release. Supports LANCER system version 2.8.1 on FoundryVTT version 12.
