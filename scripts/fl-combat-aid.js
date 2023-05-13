import { CombatAidApplication } from './combat-aid-application.js';

Hooks.on('updateCombat', async (combat, changes) => {
  // if its the beginning of combat show everyone their own combat aid application
  if (changes.round === 1 && (combat.previous.round === 0 || combat.previous.round === null)) {
    const ownedCombatants = combat.combatants.filter((combatant) => {
      if (game.user.isGM) return combatant.isOwner && !combatant.hasPlayerOwner;
      return combatant.isOwner;
    });

    ownedCombatants.forEach(async (combatant) => {
      const { actor } = combatant;
      await combatant.actor.setFlag(CombatAidApplication.MODULE_ID, 'fast-actions', CombatAidApplication.defaults.fastActions);
      await combatant.actor.setFlag(CombatAidApplication.MODULE_ID, 'slow-actions', CombatAidApplication.defaults.slowActions);
      CombatAidApplication.showApplication(actor);
    });
  }

  // if its a new combat turn and combat wasn't ended by going to turn zero
  if (combat.current.round !== 0) {
    // reset action counts at start of new round and show sheet
    if (combat.current.round !== combat.previous.round && combat.current.round > combat.previous.round) {
      combat.combatants.forEach(async (combatant) => {
        if (combatant.players.find((player) => player.id === game.userId) !== undefined || (game.user.isGM && combatant.isOwner && !combatant.hasPlayerOwner)) {
          await combatant.actor.setFlag(CombatAidApplication.MODULE_ID, 'fast-actions', CombatAidApplication.defaults.fastActions);
          await combatant.actor.setFlag(CombatAidApplication.MODULE_ID, 'slow-actions', CombatAidApplication.defaults.slowActions);
          CombatAidApplication.showApplication(combatant.actor);
        }
      });
    }

    // show sheet if it is your actors turn
    if (combat.combatant.players.find((player) => player.id === game.userId) !== undefined || (combat.combatant.players.length === 0 && game.user.isGM)) {
      CombatAidApplication.showApplication(combat.combatant.actor);
    }
  }
});

Hooks.on('getActorSheetHeaderButtons', (sheet, buttons) => {
  console.log('get header buttons');
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
