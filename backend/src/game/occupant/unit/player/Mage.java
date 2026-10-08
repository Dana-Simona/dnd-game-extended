package game.occupant.unit.player;

import game.ActionType;
import game.BoardCallback;
import game.GameEvent;
import game.MessageCallback;
import game.StepCounter;
import game.cell.Position;
import game.occupant.unit.enemy.Enemy;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;

public class Mage extends Player {

    private Integer spellPower;
    private Integer manaPool;
    private Integer currentMana;
    private final Integer manaCost;
    private final Integer hitsCount;
    private final Integer abilityRange;

    public Mage(String name, Integer health, Integer attack, Integer defense, Position position, MessageCallback callback,
            Integer manaPool, Integer manaCost, Integer spellPower, Integer hitsCount, Integer abilityRange, BoardCallback boardCallback, StepCounter stepCounter) {
        super(name, health, attack, defense, position, callback, boardCallback, stepCounter);
        this.manaPool = manaPool;
        this.currentMana = this.manaPool / 4;
        this.manaCost = manaCost;
        this.spellPower = spellPower;
        this.hitsCount = hitsCount;
        this.abilityRange = abilityRange;
    }

    public void blizzard() {
        sendMessage(getName() + " cast Blizzard");

        List<Enemy> availableEnemies = getEnemiesInRange(getPosition(), abilityRange);
        List<Enemy> targetsToHit = new ArrayList<>();

        while (targetsToHit.size() < this.hitsCount && !availableEnemies.isEmpty()) {
            int randomIndex = ThreadLocalRandom.current().nextInt(availableEnemies.size());
            targetsToHit.add(availableEnemies.get(randomIndex));
        }
        if (targetsToHit.isEmpty()) {
            return;
        }

        List<String> enemyIds = targetsToHit.stream()
                .map(Enemy::getId)
                .toList();

        sendEvent(new GameEvent(stepCounter.nextStep(), ActionType.ABILITY_CAST, getId(), enemyIds, null));

        Map<Enemy, Integer> preRolledDefenses = new HashMap<>();
        for (Enemy enemy : targetsToHit) {
            if (!enemy.isDead()) {
                int defenseRoll = (int) (Math.random() * (enemy.getDefensePoints() + 1));
                sendMessage(enemy.getName() + " rolled " + defenseRoll + " defense points.");
                sendEvent(new GameEvent(stepCounter.getCurrentStep(), ActionType.ROLL_DEFENSE, enemy.getId(), defenseRoll));

                preRolledDefenses.put(enemy, defenseRoll);
            }
        }

        Set<Enemy> hitEnemies = new LinkedHashSet<>();
        for (Enemy enemy : targetsToHit) {
            if (!enemy.isDead() && preRolledDefenses.containsKey(enemy)) {
                int defenseRoll = preRolledDefenses.get(enemy);

                this.takeDamageFromAbility(enemy, this.spellPower, defenseRoll);
                hitEnemies.add(enemy);
            }
        }

        for (Enemy enemy : hitEnemies) {
            handleEnemyIfDead(enemy);
        }
    }

    public void takeDamageFromAbility(Enemy target, int damageAmount, int defenseRoll) {
        if (damageAmount < 0) {
            throw new IllegalArgumentException("damage dealt can't be negative");
        }
        if (target == null) {
            throw new IllegalArgumentException("unit can't be null");
        }

        int actualDamage = damageAmount - defenseRoll;

        if (actualDamage > 0) {
            target.takeDamage(actualDamage);
            sendMessage(this.getName() + " hit " + target.getName() + " for " + actualDamage + " ability damage");
            sendEvent(new GameEvent(stepCounter.nextStep(), ActionType.TAKE_DAMAGE_FROM_ABILITY, target.getId(), this.getId(), actualDamage));
        }
    }

    @Override
    public void levelUp() {
        super.levelUp();
        this.manaPool += 25 * getLevel();
        this.currentMana = Math.min(this.currentMana + this.manaPool / 4, this.manaPool);
        this.spellPower += 10 * getLevel();
    }

    @Override
    public void abilityCast() {
        if (this.currentMana < this.manaCost) {
            sendMessage(getName() + "tried to cast Blizzard, but there was not enough mana: " + currentMana + "/" + manaPool);
        } else {
            this.currentMana -= this.manaCost;
            blizzard();
        }
    }

    public Integer getSpellPower() {
        return spellPower;
    }

    public Integer getManaPool() {
        return manaPool;
    }

    public Integer getCurrentMana() {
        return currentMana;
    }

    public Integer getManaCost() {
        return manaCost;
    }

    public Integer getHitCount() {
        return hitsCount;
    }

    public Integer getAbilityRange() {
        return abilityRange;
    }

    @Override
    public String description() {
        return String.format("%-20s Health: %d/%d\t\tAttack: %d\t\tDefense: %d\t\tLevel: %d\t\tExperience: %d/%d\t\tMana: %d/%d\t\tSpell Power: %d",
                getName(), getCurrentHealth(), getHealthPool(), getAttackPoints(), getDefensePoints(), getLevel(), getExperience(), 50 * getLevel(), getCurrentMana(), getManaPool(), getSpellPower());
    }

    @Override
    public void onGameTick() {
        super.onGameTick();
        this.currentMana = Math.min(manaPool, this.currentMana + getLevel());
    }

    @Override
    protected Integer getAddedHealth() {
        return 0;
    }

    @Override
    protected Integer getAddedAttack() {
        return 0;
    }

    @Override
    protected Integer getAddedDefense() {
        return 0;
    }

    @Override
    public Integer getRange() {
        return this.abilityRange;
    }
}
