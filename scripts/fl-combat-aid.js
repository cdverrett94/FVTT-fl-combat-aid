import { CombatAidApplication } from './combat-aid-application.js';

const resetActionsAndShow = async ({combat = null, combatant = null, newTurn = false, newRound = false, newCombat = false} = {}) => {
  const activePlayers = combatant.players.filter(player => player.active);
  const isActivePlayer = !!activePlayers.find((player) => player.id === game.userId);
  const isActivePlayerOrGM = isActivePlayer || (game.user.isGM && !activePlayers.length); 

  if(!isActivePlayerOrGM) return;
  if(newCombat || newRound) {
    await combatant.actor.setFlag(CombatAidApplication.MODULE_ID, 'fast-actions', CombatAidApplication.defaults.fastActions);
    await combatant.actor.setFlag(CombatAidApplication.MODULE_ID, 'slow-actions', CombatAidApplication.defaults.slowActions);
  }
  if(newCombat || newTurn) CombatAidApplication.showApplication(combatant.actor);
}

Hooks.on("updateCombat",  async (combat, changes) => {
  const combatants = combat.combatants.contents;
  const combatant = combat.combatant;
  const newCombat = changes.round === 1 && (combat.previous.round === 0 || combat.previous.round === null);
  const newRound = combat.current.round !== 0 && combat.current.round !== combat.previous.round && combat.current.round > combat.previous.round;
  const newTurn = combat.current.round !== 0 && combat.current.turn !== combat.previous.turn;
  
  if(newCombat || newRound) {
    for (const combatant of combatants) {
      resetActionsAndShow({combat, combatant, newRound, newCombat})
    }
  }

  if(newTurn) {
    resetActionsAndShow({combat, combatant, newTurn})
  }
});

Hooks.on('getActorSheetHeaderButtons', (sheet, buttons) => {
  // add combat aid button to character sheet header
  buttons.unshift({
    icon: 'fas fa-swords',
    class: 'open-combat-aid',
    label: 'Combat Aid',
    onclick: () => {
      CombatAidApplication.showApplication(sheet.actor);
    },
  });
});