import combatActions from './combat-actions.js';

class CombatAidApplication extends Application {
  constructor(actor) {
    super({
      id: `${CombatAidApplication.MODULE_ID}-${actor.id}`,
      title: `${actor.name} Combat Aid`,
      actor,
    });
  }

  static MODULE_ID = 'fl-combat-aid';

  static actions = combatActions;

  static defaults = {
    fastActions: 2,
    slowActions: 1,
  };

  static showApplication(actor) {
    let app;
    for (const window in ui.windows) {
      if (ui.windows[window].constructor.name === "CombatAidApplication" && ui.windows[window].options.actor.id === actor.id) {
        app = ui.windows[window];
        break;
      }
    }
    if (app) {
      app.render(true, {focus:true})
    } else {
      app = new CombatAidApplication(actor);
      app.render(true)
    }
  }

  get actor() {
    return this.options.actor;
  }

  getActionCounts() {
    return {
      fast: Math.max(this.actor.getFlag(this.constructor.MODULE_ID, 'fast-actions') ?? this.constructor.defaults.fastActions, 0),
      slow: Math.max(this.actor.getFlag(this.constructor.MODULE_ID, 'slow-actions') ?? this.constructor.defaults.slowActions, 0),
    };
  }

  capitalize(word) {
    const firstLetter = word.charAt(0);
    const firstLetterCap = firstLetter.toUpperCase();
    const remainingLetters = word.slice(1);
    const capitalizedWord = firstLetterCap + remainingLetters;
    return capitalizedWord;
  }

  formatString(string) {
    const words = string.split('-');
    const formattedString = words.map(word => word.capitalize()).join(" "); 
    return formattedString;
  }

  async setActionCounts({ fast, slow } = {}) {
    if (fast !== undefined) {
      await this.actor.setFlag(this.constructor.MODULE_ID, 'fast-actions', Math.max(fast, 0));
      await game.combat?.getCombatantByActor(this.actor.id)?.setFlag('forbidden-lands', 'fast', fast === 0);
    }
    if (slow !== undefined) {
      await this.actor.setFlag(this.constructor.MODULE_ID, 'slow-actions', Math.max(slow, 0));
      await game.combat?.getCombatantByActor(this.actor.id)?.setFlag('forbidden-lands', 'slow', slow === 0);
    }
  }

  static get defaultOptions() {
    const defaults = super.defaultOptions;

    const overrides = {
      height: 'auto',
      width: 700,
      classes: [`${this.MODULE_ID}-application`],
      template: `modules/${this.MODULE_ID}/templates/combataid-application.hbs`,
    };

    return foundry.utils.mergeObject(defaults, overrides);
  }

  getData() {
    return {
      actions: this.constructor.actions,
      actor: {
        name: this.actor.name,
        id: this.actor.id,
        actions: {
          fast: this.getActionCounts().fast,
          slow: this.getActionCounts().slow,
        },
      },
    };
  }

  async rollAttack(attackInfo) {
    let weaponChoice;
    if (attackInfo.info.type === 'weapon') {
      const weapons = this.actor.items
        .filter((item) => {
          let categoryMatch = true;
          let featureMatch = true;

          const typeMatch = item.type === attackInfo.info.type;
          if (!typeMatch) return false;
          
          if (attackInfo.info.requirement?.category) categoryMatch = item.system.category === attackInfo.info.requirement.category;
          if (!categoryMatch) return false;

          if (attackInfo.info.requirement?.features) featureMatch = attackInfo.info.requirement.features.find((feature) => item.system.features[feature]);
          if(!featureMatch) return false;

          return true;
        })
        .map((weapon) => ({ name: weapon.name, id: weapon.id }));
      if (weapons.length) {
        weaponChoice = await this.itemSelection(weapons, "weapon");
        if(weaponChoice) {
          this.actor.sheet.rollGear(weaponChoice);
          return true;
        }
        return false;
      }
      ui.notifications.error(
        `You have no weapon that meets the requirements for the action. It must be a ${attackInfo.info.requirement.category} weapon${
          attackInfo.info.requirement?.features ? ` with one of the following properties: ${attackInfo.info.requirement.features.join(', ')}` : ''
        }.`
      );
      return false;
    }
  }

  async itemSelection(choices, type) {
    const promptOptions = choices.map((choice) => `<option value=${choice.id}>${choice.name}</option>`).join('');
    const promptChoice = await Dialog.prompt({
      title: `Choose Your ${this.formatString(type)}`,
      content: `
        <h1>Choose Your ${this.formatString(type)}</h1>
        <select class="${this.constructor.MODULE_ID}-choice-select" name="${type}">${promptOptions}</select>
        <span class="${this.constructor.MODULE_ID}-item-description">${choices[0].system?.description ?? ""}</span>
      `,
      label: `Roll ${this.formatString(type)}`,
      callback: (html) => html.find('select').val(),
      render: html => {
        html[0].querySelector(`.${this.constructor.MODULE_ID}-choice-select`).addEventListener('change', (event) =>{
          const itemDescription = choices.find(choice => choice.id === event.target.value)?.system.description;
          html[0].querySelector(`.${this.constructor.MODULE_ID}-item-description`).innerText = itemDescription ?? "";
          ui.windows[html[0].closest(".app.window-app.dialog").dataset.appid].setPosition({height: 'auto'});
        })
      },
      rejectClose: false,
    });

    return promptChoice;
  }

  rollSkill(skill) {
    this.actor.sheet.rollSkill(skill);
    return true;
  }

  async rollAction(action) {
    let weapons;
    let errorMessage;
    if(action === 'parry') {
      weapons = this.actor.items.filter((item) => item.type === 'weapon' || (item.type === 'armor' && item.system.part === 'shield'));
      weapons = weapons.map((weapon) => ({ id: weapon.id, name: weapon.name }));
      'You do not have a weapon or a shield'
    } else if(action === 'shove') {
      weapons = this.actor.items.filter((item) => (item.type === 'weapon' && item.system.features?.hook === true) || (item.type === 'armor' && item.system.part === 'shield'));
      weapons = weapons.map((weapon) => ({ id: weapon.id, name: weapon.name }));
      weapons.unshift({ id: 'unarmed', name: 'Unarmed' });
      errorMessage = 'You do not have an unarmed attack, a weapon with a hook, or a shield';
    } else if(action === 'disarm') {
      weapons = this.actor.items.filter((item) => item.type === 'weapon' && item.system.category === 'melee');
      weapons = weapons.map((weapon) => ({ id: weapon.id, name: weapon.name }));
      weapons.unshift({ id: 'unarmed', name: 'Unarmed' });
      errorMessage = 'You do not have an unarmed attack or melee weapon';
    }

    if (['parry', 'shove', 'disarm'].includes(action)) {
      if (weapons.length) {
        const weaponChoice = await this.itemSelection(weapons, "weapon");
        if(weaponChoice) {
          this.actor.sheet.rollAction(action, weaponChoice);
          return true;
        }
        return false;
      }
      ui.notifications.error(errorMessage);
      return false;
    } else {
      this.actor.sheet.rollAction(action);
      return true;
    }
  }

  rollTalent(talentName) {
    const talents = this.actor.items.filter((item) => item.type === 'talent');
    const specifiedTalent = talents.find((talent) => talent.name === talentName);
    if (specifiedTalent) {
      specifiedTalent.sendToChat();
      return true;
    }
    ui.notifications.error(`You do not have the ${talentName} talent required for this action.`);
    return false;
  }

  async rollSpell(spellType) {
    const filterValue = spellType === "spell"? "SPELL.SPELL" : "SPELL.POWER_WORD";
    const availableSpells = this.actor.items.filter(item => item.system.spellType === filterValue);

    if(availableSpells.length) {
      let rolledSpell = await this.itemSelection(availableSpells, spellType);
      if(rolledSpell) {
        this.actor.sheet.rollSpell(rolledSpell);
        return true;
      }
      return false;
    }
    ui.notifications.error(`You do not have any spells of type: ${spellType}`);
    return false;
  }

  activateListeners(html) {
    html[0].querySelectorAll('.actions-table:not(.action-disabled) .action span').forEach(async (element) => {
      element.addEventListener('click', async (event) => {
        const target = event.target;
        const actionName = target.dataset.actionName;
        const actionSpeed = target.dataset.actionSpeed;
        const actionType = target.dataset.actionType;
        const actionRoll = target.dataset.actionRoll;
        const actionInfo = this.constructor.actions[actionSpeed].find((action) => action.labels.name === actionName);

        let rolled;
        switch (actionType) {
          case 'attack':
            rolled = await this.rollAttack(actionInfo);
            break;
          case 'action':
            rolled = await this.rollAction(actionRoll);
            break;
          case 'skill':
            rolled = this.rollSkill(actionRoll);
            break;
          case 'talent':
            rolled = this.rollTalent(actionRoll);
            break;
          case 'spell':
            rolled = await this.rollSpell(actionRoll);
            break;
          default:
            rolled = true;
            break;
        }

        if (rolled) {
          const actions = this.getActionCounts();
          const updateData = {};
          updateData.fast = Math.max(actions.fast - 1, 0);
          if (actionSpeed === 'slow') updateData.slow = Math.max(actions.slow - 1, 0);
          if (updateData.fast === 0) updateData.slow = 0;

          await this.updateData(updateData);
          ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: this.actor.id }),
            content: `${this.actor.name} takes the ${actionName} action for their ${actionSpeed} action.
                    <br><br>
                    Actions Remaining: <br>
                    Fast: ${this.getActionCounts().fast}<br>
                    Slow: ${this.getActionCounts().slow}`,
          });
        }
      });
    });


    // manually increase or decrease action counts
    html[0].querySelectorAll('.modify-actions').forEach(async (element) => {
      element.addEventListener('click', async (event) => {
        const target = event.target.parentElement;
        const actions = this.getActionCounts();
        const type = target.classList.contains('modify-slow-actions') ? 'slow' : 'fast';
        const modification = target.classList.contains('decrease-actions') ? 'decrease' : 'increase';
        if (modification === 'increase') actions[type] = Math.max(actions[type] + 1, 0);
        else actions[type] = Math.max(actions[type] - 1, 0);

        await this.updateData(actions);
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this.actor.id }),
          content: `${this.actor.name} ${modification}d their ${type} action count.
                <br><br>
                Updated Action Count: <br>
                Fast: ${this.getActionCounts().fast}<br>
                Slow: ${this.getActionCounts().slow}`,
        });
      });
    });



    html[0].querySelectorAll('.header.action-expand').forEach((element) => {
      element.addEventListener('click', (event) => {
        let target = event.target.parentElement.parentElement;
        if (event.target.nodeName === 'I') target = target.parentElement; // go from i > div.action-expand > .headers-container > div.outer-actions-container

        target.querySelectorAll('.action-description:not(.action-hidden)').forEach((element) => {
          element.classList.add('action-hidden');
          element.previousSibling.previousSibling.querySelector('i').classList.remove('fa-angle-up');
          element.previousSibling.previousSibling.querySelector('i').classList.add('fa-angle-down');
        });
      });
    });

    html[0].querySelectorAll('.action .action-expand').forEach((element) => {
      element.addEventListener('click', (event) => {
        let target = event.target.parentElement;
        if (event.target.nodeName === 'I') target = target.parentElement; // go from i > div.action-expand > div.action

        let descriptionContainer = target.querySelector('.action-description');
        let classList = element.querySelector('.action-expand i').classList;
        if (descriptionContainer.classList.contains('action-hidden')) {
          descriptionContainer.classList.remove('action-hidden');
          classList.remove('fa-angle-down');
          classList.add('fa-angle-up');
        } else {
          descriptionContainer.classList.add('action-hidden');
          classList.remove('fa-angle-up');
          classList.add('fa-angle-down');
        }
      });
    });
  }

  async updateData(data) {
    await this.setActionCounts(data);

    this.render(true);
  }
}

export { CombatAidApplication };
