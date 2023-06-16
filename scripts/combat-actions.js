export default {
  slow: [
    {
      labels: {
        name: 'Slash',
        prerequisite: 'Edged or Blunt Weapon',
        skill: 'Melee',
      },
      type: 'attack',
      info: {
        type: 'weapon',
        requirement: {
          category: 'melee',
          features: ['edged', 'blunt'],
        },
        description:
          'You swing your weapon at your opponent. Requires a weapon with the EDGED or BLUNT features. Roll MELEE plus the weapon’s Gear Bonus. Can be DODGED or PARRIED. If your target DODGES, he gets a +2 bonus. If you hit, your opponent takes Weapon Damage on his Strength. If you roll multiple <i class="fas fa-fist-raised"></i>, the damage increases by 1 for each additional <i class="fas fa-fist-raised"></i>. If the enemy takes a critical injury (see page 108), roll on the table for slash wounds (for EDGED weapons) or blunt trauma (for BLUNT weapons).',
      },
    },
    {
      labels: {
        name: 'Stab',
        prerequisite: 'Pointed weapon',
        skill: 'Melee',
      },
      type: 'attack',
      info: {
        type: 'weapon',
        requirement: {
          category: 'melee',
          features: ['pointed'],
        },
        description:
          'You attempt to impale your opponent. Requires a weapon with the POINTED feature. Roll MELEE plus the weapon’s Gear Bonus. Can be DODGED or PARRIED. A target who PARRIES with a weapon gets a –2 penalty, while parrying with a shield gives a +2 bonus. If you hit, your opponent takes Weapon Damage on his Strength. If you roll multiple <i class="fas fa-fist-raised"></i>, the damage increases by 1 for each additional <i class="fas fa-fist-raised"></i>. If the enemy suffers a critical injury, roll on the table for stab wounds.',
      },
    },
    {
      labels: {
        name: 'Punch/Kick/Bite',
        prerequisite: 'Unarmed',
        skill: 'Melee',
      },
      type: 'action',
      info: {
        type: 'unarmed',
        description:
          'Does not require a weapon. Roll for MELEE. Can be DODGED or PARRIED, and any attempt to PARRY gets a +2 bonus. If you hit, your opponent takes 1 point of damage to his Strength. If you roll multiple <i class="fas fa-fist-raised"></i>, the damage increases by 1 for each additional <i class="fas fa-fist-raised"></i>. If the enemy suffers a critical injury, roll on the table for blunt force wounds (unless you have fangs – in that case, use the table for slash wounds).',
      },
    },
    {
      labels: {
        name: 'Grapple',
        prerequisite: 'Unarmed',
        skill: 'Melee',
      },
      type: 'action',
      info: {
        type: 'grapple',
        description:
          'You grab hold of your opponent. Roll for MELEE, as no weapon can be used. Can be DODGED or PARRIED. If the attack succeeds, both you and your opponent fall to the ground. The opponent drops any weapon he was holding, and cannot move. The only action he can perform is BREAK FREE – which is a slow action and requires him winning an opposed MELEE against you. While you are grappling, the only action you can perform is a GRAPPLE ATTACK. It works like PUNCH/KICK/BITE, but is a fast action and cannot be DODGED or PARRIED.',
      },
    },
    {
      labels: {
        name: 'Break Free',
        prerequisite: 'You are Grappled',
        skill: 'Melee',
      },
      type: 'action',
      info: {
        type: 'break-free',
        description: 'When you are GRAPPLED, you must win an opposed MELEE against your grappler.',
      },
    },
    {
      labels: {
        name: 'Shoot',
        prerequisite: 'Ranged Weapon',
        skill: 'Markmanship',
      },
      type: 'attack',
      info: {
        type: 'weapon',
        requirement: {
          category: 'ranged',
        },
        description:
          'Roll for MARKSMANSHIP and the weapon’s Gear Bonus. Can be DODGED, but to PARRY a ranged attack the target must have a shield. If you hit, your target takes Weapon Damage on his Strength. For every additional <i class="fas fa-fist-raised"></i> rolled, the damage increases by 1. If the target suffers a critical injury, roll on the table for stab wounds if you used a bow or throwing knife and use the table for blunt force if you used a sling or a thrown rock.',
      },
    },
    {
      labels: {
        name: 'Persuade',
        prerequisite: 'The opponent can hear you',
        skill: 'Manipulation',
      },
      type: 'skill',
      info: {
        type: 'manipulation',
      },
    },
    {
      labels: {
        name: 'Taunt',
        prerequisite: 'The opponent can hear you',
        skill: 'Performance',
      },
      type: 'skill',
      info: {
        type: 'performance',
      },
    },
    {
      labels: {
        name: 'Cast Spell',
        prerequisite: 'You are a Druid or Sorcerer',
        skill: 'None, see Chapter 6',
      },
      type: 'spell',
      info: {
        type: 'spell'
      },
    },
    {
      labels: {
        name: 'Flee',
        prerequisite: "No enemy at Arm's Length",
        skill: 'Move',
      },
      type: 'skill',
      info: {
        type: 'move',
        description:
          'If you want to leave the conflict immediately, and you don’t have any enemies at ARM’S LENGTH, you can roll for MOVE – a successful roll means you man-age to get away somehow, and the conflict is over. You cannot FLEE in this way if you are trapped or surrounded. The GM has final say. You cannot use your roll to move past an opponent – you must FLEE in the same direction you came from. The GM can modify your roll depending on the terrain and the distance to the next opponent. If the roll fails, you remain in combat with your opponent and cannot get away – you remain at the same distance as you were before. The GM can also inflict some additional negative consequence for you (see page 43). You can attempt to FLEE again in the next round.',
      },
    },
    {
      labels: {
        name: 'Crawl',
        prerequisite: 'You are prone',
        skill: '—',
      },
      type: 'other',
    },
    {
      labels: {
        name: 'Charge',
        prerequisite: 'At Near range',
        skill: 'Melee Charge talent',
      },
      type: 'talent',
      info: {
        type: 'Melee Charge',
      },
    },
  ],
  fast: [
    {
      labels: {
        name: 'Dodge',
        prerequisite: '—',
        skill: 'Move',
      },
      type: 'action',
      info: {
        type: 'dodge',
        description:
          'You throw yourself out of the way of your opponent’s attack. Reactive action. Roll MOVE (not MELEE). You cannot use a weapon. If the attacker SLASHES, you get a +2 bonus. Every <i class="fas fa-fist-raised"></i> you roll eliminates a <i class="fas fa-fist-raised"></i> from the attacker’s roll. Any excess <i class="fas fa-fist-raised"></i> have no effect. When you DODGE, you fall prone. You can choose to remain standing, at the cost of a –2 penalty.',
      },
    },
    {
      labels: {
        name: 'Parry',
        prerequisite: 'Shield or Parrying Weapon',
        skill: 'Melee',
      },
      type: 'action',
      info: {
        type: 'parry',
        description:
          'You block your opponent’s attack. Reactive action. Requires a shield or a weapon. Roll MELEE and the Gear Bonus of the shield or weapon used. If you PARRY with a weapon that lacks the PARRYING feature, you get a –2 penalty. If the attacker STABS you, you get a +2 when you PARRY with a shield but a –2 penalty if you parry with a weapon. Every <i class="fas fa-fist-raised"></i> you roll eliminates a <i class="fas fa-fist-raised"></i> from the attacker’s roll. Any excess <i class="fas fa-fist-raised"></i> have no effect.',
      },
    },
    {
      labels: {
        name: 'Draw Weapon',
        prerequisite: '—',
        skill: '—',
      },
      type: 'other',
      info: {
        description:
          'You draw a weapon from your belt or scabbard. No roll is required. This fast action can also be used to pick up a weapon or other item from the ground (within ARM’S LENGTH). Also see the QUICK DRAW talent.',
      },
    },
    {
      labels: {
        name: 'Swing Weapon',
        prerequisite: 'Heavy weapon, must be performed right before a close combat attack',
        skill: '—',
      },
      type: 'other',
      info: {
        description:
          'You swing your melee weapon to make your upcoming strike more powerful. No roll is required, but this fast action requires a HEAVY weapon. Must be performed directly before a SLASH or STAB, in the same round. If the attack is successful, the damage done increases by +1.',
      },
    },
    {
      labels: {
        name: 'Get Up',
        prerequisite: 'You are prone',
        skill: '—',
      },
      type: 'other',
      info: {
        description:
          'Rise from a prone to a standing stance, or the other way around. Close combat attacks against opponents that are prone are modified by +2.',
      },
    },
    {
      labels: {
        name: 'Shove',
        prerequisite: '—',
        skill: 'Melee',
      },
      type: 'action',
      info: {
        type: 'shove',
        description:
          'You try to push your enemy to the ground. Roll MELEE. A weapon with the HOOK feature or a shield can be used. If your opponent has higher Strength than you, two <i class="fas fa-fist-raised"></i> are required to succeed, otherwise one is enough. If the attack is successful, your opponent falls to the ground and is prone (however, see the STEADY FEET talent). Any additional <i class="fas fa-fist-raised"></i> have no effect. Your opponent can DODGE to avoid your SHOVE. PARRYING a SHOVE requires a shield.',
      },
    },
    {
      labels: {
        name: 'Disarm',
        prerequisite: 'Your target holds a weapon',
        skill: 'Melee',
      },
      type: 'action',
      info: {
        type: 'disarm',
        requirement: {
          category: 'melee',
        },
        description:
          'You try to knock the weapon from your opponent’s hands. Roll MELEE and your weapon’s Gear Bonus. Disarming an opponent wielding a one-handed weapon requires one <i class="fas fa-fist-raised"></i>, a two-handed weapon requires two (however, see the FIRM GRIP talent). If you succeed, your opponent drops his weapon, which lands at ARM’S LENGTH. Any excess <i class="fas fa-fist-raised"></i> have no effect. You cannot DISARM a shield. Your enemy can PARRY or DODGE your DISARM.',
      },
    },
    {
      labels: {
        name: 'Feint',
        prerequisite: "Enemy at Arm's Length",
        skill: '—',
      },
      type: 'other',
      info: {
        description:
          'You trade initiative cards with an opponent at ARM’S LENGTH (or NEAR, if your close combat weapon can reach that far). The new initiative order takes effect the next round. No roll is required.',
      },
    },
    {
      labels: {
        name: 'Run',
        prerequisite: "No enemy at Arm's Length.",
        skill: 'Move (in Rough Zone)',
      },
      type: 'skill',
      info: {
        type: 'move',
        description:
          'This moves you from one zone to a neighboring zone, or between NEAR and ARM’S LENGTH distance from an enemy in the zone you are already in. No roll is required to RUN, unless you’re moving into a ROUGH zone, in which case you need to roll for MOVE',
      },
    },
    {
      labels: {
        name: 'Retreat',
        prerequisite: "Enemy at Arm's Length.",
        skill: 'Move',
      },
      type: 'skill',
      info: {
        type: 'move',
        description:
          'This action must be used instead of RUN if you have an active enemy at ARM’S LENGTH. Brings you to NEAR range. Roll for MOVE. If you fail, you move but your enemy gets a free attack against you – a SLASH, STAB or PUNCH that doesn’t count toward his actions in the round and which you can’t PARRY or DODGE.',
      },
    },
    {
      labels: {
        name: 'Grapple Attack',
        prerequisite: "You've Grapple an opponent",
        skill: 'Melee',
      },
      type: 'action',
      info: {
        type: 'melee',
        description: 'It works like PUNCH/KICK/BITE, but it cannot be DODGED or PARRIED.',
      },
    },
    {
      labels: {
        name: 'Ready Weapon',
        prerequisite: 'Ranged weapon',
        skill: '—',
      },
      type: 'other',
      info: {
        description:
          'Fast action. Before you can fire your bow or sling, you must READY it – prepare the weapon by nocking an arrow or placing a stone in your sling. Once you have READIED your weapon, you can’t take any slow action other than SHOOT and no fast action other than AIM (see below) – if you do anything else, you must READY the weapon again before you can SHOOT. Note that the FAST SHOOTER talent allows you to fire bows and slings with-out using an action to READY the weapon. Crossbows don’t need to be READIED. In-stead, you must LOAD a crossbow (slow action) before each shot. You can carry a LOADED cross-bow around as long as you like.',
      },
    },
    {
      labels: {
        name: 'Aim',
        prerequisite: 'Ranged, Short distance or more',
        skill: '—',
      },
      type: 'other',
      info: {
        description:
          'Fast action. Before you SHOOT, you can AIM. This gives you a +1 bonus to the attack. You must AIM and SHOOT in the same round – you cannot save the bonus for a later round. Please note that you cannot READY your weapon, AIM and SHOOT in the same round, as that is a total of three actions. It’s possible if you have the FAST SHOOTER talent, however. 11You can’t AIM at an aware opponent at ARM’S LENGTH – he is too close for you to be able to draw a bead on.',
      },
    },
    {
      labels: {
        name: 'Power Word',
        prerequisite: 'You are a Druid or Sorcerer',
        skill: 'None, see Chapter 6',
      },
      type: 'spell',
      info: {
        type: 'power-word'
      },
    },
    {
      labels: {
        name: 'Use Item',
        prerequisite: 'Varies',
        skill: 'Varies',
      },
      type: 'other',
    },
  ],
};
