import combatActions from '../module/combat-actions';

class CombatAid {
  static MODULE_ID = 'fl-combat-aid';

  static actions = combatActions;

  static defaults = {
    fastActions: 2,
    slowActions: 1,
  };

  static templates = {
    main: `modules/${this.MODULE_ID}/templates/combataid-application.hbs`,
  };
}

class CombatAidApplication extends Application {
  constructor(actor) {
    super({
      id: `${CombatAid.MODULE_ID}-${actor.id}`,
      title: `${actor.name} Combat Aid`,
      actor,
    });
  }

  static showApplication(actor) {
    console.log(CombatAid.MODULE_ID);
    let app = ui.windows.find?.(
      (windowApp) => typeof windowApp === CombatAidApplication && windowApp.options.actorId === actor.id,
    );
    if (!app) app = new CombatAidApplication(actor);
    app.render(true, { focus: true, width: 700 });
  }

  get actor() {
    return this.options.actor;
  }

  getActionCounts() {
    return {
      fast: Math.max(this.actor.getFlag(CombatAid.MODULE_ID, 'fast-actions') ?? CombatAid.defaults.fastActions, 0),
      slow: Math.max(this.actor.getFlag(CombatAid.MODULE_ID, 'slow-actions') ?? CombatAid.defaults.slowActions, 0),
    };
  }

  async setActionCounts({ fast, slow } = {}) {
    if (fast !== undefined) {
      await this.actor.setFlag(CombatAid.MODULE_ID, 'fast-actions', Math.max(fast, 0));
      await game.combat?.getCombatantByActor(this.actor.id).setFlag('forbidden-lands', 'fast', fast === 0);
    }
    if (slow !== undefined) {
      await this.actor.setFlag(CombatAid.MODULE_ID, 'slow-actions', Math.max(slow, 0));
      await game.combat?.getCombatantByActor(this.actor.id).setFlag('forbidden-lands', 'slow', slow === 0);
    }
  }

  static get defaultOptions() {
    const defaults = super.defaultOptions;

    const overrides = {
      height: 'auto',
      classes: [`${CombatAid.MODULE_ID}-application`],
      template: CombatAid.templates.main,
    };

    return foundry.utils.mergeObject(defaults, overrides);
  }

  getData() {
    return {
      actions: CombatAid.actions,
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
    let rollItem;
    if (attackInfo.info.type === 'weapon') {
      const items = this.actor.items
        .filter((item) => {
          const typeMatch = item.data.type === attackInfo.info.type;
          let categoryMatch = true;
          let featureMatch = true;
          if (attackInfo.info.requirement?.category)
            categoryMatch = item.data.data.category === attackInfo.info.requirement.category;
          if (attackInfo.info.requirement?.features)
            featureMatch = attackInfo.info.requirement.features.find((feature) => item.data.data.features[feature]);
          return typeMatch && categoryMatch && featureMatch;
        })
        .map((item) => ({ name: item.name, id: item.id }));
      if (items.length) {
        if (items.length === 1) {
          rollItem = items[0].id;
        } else {
          rollItem = await this.itemSelection(items);
        }

        if (rollItem === false || rollItem === null) return false;
        this.actor.sheet.rollGear(rollItem);
        return true;
      }
      ui.notifications.error(
        `You have no weapon that meets the requirements for the action. It must be a ${
          attackInfo.info.requirement.category
        } weapon${
          attackInfo.info.requirement?.features
            ? ` with one of the following properties: ${attackInfo.info.requirement.features.join(',')}`
            : ''
        }.`,
      );
      return false;
    }
  }

  async itemSelection(choices) {
    const promptOptions = choices.map((choice) => `<option value=${choice.id}>${choice.name}</option>`).join('');
    const promptChoice = await Dialog.prompt({
      title: 'Choose Your Weapon',
      content: `
                        <h1>Weapon Select</h1>
                        <select class="${CombatAid.MODULE_ID}-weapon-select" name="weapon">${promptOptions}</select>`,
      label: 'Roll Attack',
      callback: (html) => html.find('select').val(),
      rejectClose: false,
    });

    return promptChoice;
  }

  rollSkill(skill) {
    this.actor.sheet.rollSkill(skill);
    return true;
  }

  async rollAction(action) {
    if (action === 'parry') {
      let weapons = this.actor.items.filter(
        (item) => item.type === 'weapon' || (item.type === 'armor' && item.data.data.part === 'shield'),
      );
      weapons = weapons.map((weapon) => ({ id: weapon.id, name: weapon.name }));

      if (weapons.length) {
        const weaponChoice = await this.itemSelection(weapons);
        this.actor.sheet.rollAction(action, weaponChoice);
        return true;
      }
      ui.notifications.error('You do not have a weapon with the hook property or a shield');
      return false;
    }
    if (action === 'shove') {
      let weapons = this.actor.items.filter(
        (item) =>
          (item.type === 'weapon' && item.data.data.features?.hook === true) ||
          (item.type === 'armor' && item.data.data.part === 'shield'),
      );
      weapons = weapons.map((weapon) => ({ id: weapon.id, name: weapon.name }));
      weapons.unshift({ id: 'unarmed', name: 'Unarmed' });

      if (weapons.length > 1) {
        const weaponChoice = await this.itemSelection(weapons);
        if (weaponChoice) {
          this.actor.sheet.rollAction(action, weaponChoice);
          return true;
        }
        return false;
      }
      this.actor.sheet.rollAction(action);
    } else if (action === 'disarm') {
      let weapons = this.actor.items.filter((item) => item.type === 'weapon' && item.data.data.category === 'melee');
      weapons = weapons.map((weapon) => ({ id: weapon.id, name: weapon.name }));
      weapons.unshift({ id: 'unarmed', name: 'Unarmed' });

      if (weapons.length > 1) {
        const weaponChoice = await this.itemSelection(weapons);
        if (weaponChoice) {
          this.actor.sheet.rollAction(action, weaponChoice);
          return true;
        }
        return false;
      }
      this.actor.sheet.rollAction(action);
    } else {
      this.actor.sheet.rollAction(action);
      return true;
    }
  }

  rollTalent(talentName) {
    const talents = this.actor.items.filter((item) => item.type === 'talent');
    const specifiedTalent = talents.find((talent) => talent.name === talentName.info.type);
    if (specifiedTalent) {
      specifiedTalent.sendToChat();
      return true;
    }
    ui.notifications.error(`You do not have the ${talentName} talent required for this action.`);
    return false;
  }

  activateListeners(html) {
    const { actor } = this;

    html[0].querySelectorAll('.actions-table:not(.action-disabled) .action span').forEach(async (element) => {
      element.addEventListener('click', async (event) => {
        const target = event.target;
        const actionName = target.dataset.actionName;
        const actionSpeed = target.dataset.actionSpeed;
        const actionType = target.dataset.actionType;
        const actionRoll = target.dataset.actionRoll;
        const actionInfo = CombatAid.actions[actionSpeed].find((action) => action.labels.name === actionName);

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
            rolled = this.rollTalent(actionInfo.info.type);
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
            speaker: ChatMessage.getSpeaker({ actor: actor.id }),
            content: `${actor.name} takes the ${actionName} action for their ${actionSpeed} action.
                    <br><br>
                    Actions Remaining: <br>
                    Fast: ${this.getActionCounts().fast}<br>
                    Slow: ${this.getActionCounts().slow}`,
          });
        }
      });
    });

    html[0].querySelectorAll('.modify-actions').forEach(async (element) => {
      element.addEventListener('click', async (event) => {
        const target = event.target.parentElement;
        const actions = this.getActionCounts();
        console.log(target.classList);
        const type = target.classList.contains('modify-slow-actions') ? 'slow' : 'fast';
        const modification = target.classList.contains('decrease-actions') ? 'decrease' : 'increase';
        if (modification === 'increase') actions[type] = Math.max(actions[type] + 1, 0);
        else actions[type] = Math.max(actions[type] - 1, 0);

        await this.updateData(actions);
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: actor.id }),
          content: `${actor.name} ${modification}d their ${type} action count.
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

        target.querySelectorAll('.action.action-description-expanded').forEach((element) => {
          element.classList.remove('action-description-expanded');
          element.querySelector('.action-description').style.display = 'none';
          element.querySelector('.action-expand i').classList.remove('fa-angle-up');
          element.querySelector('.action-expand i').classList.add('fa-angle-down');
        });
      });
    });

    html[0].querySelectorAll('.action .action-expand').forEach((element) => {
      element.addEventListener('click', (event) => {
        let target = event.target.parentElement;
        if (event.target.nodeName === 'I') target = target.parentElement; // go from i > div.action-expand > div.action

        let descriptionContainer = target.querySelector('.action-description');
        let classList = element.querySelector('.action-expand i').classList;
        if (descriptionContainer.style.display === 'none') {
          descriptionContainer.style.display = 'block';
          classList.remove('fa-angle-down');
          classList.add('fa-angle-up');
        } else {
          descriptionContainer.style.display = 'none';
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

export { CombatAidApplication, CombatAid };
