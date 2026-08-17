package game.occupant.unit.player;

import game.BoardCallback;
import game.MessageCallback;
import game.cell.Position;
import game.occupant.unit.enemy.Enemy;

import java.util.List;

public class Mage extends Player {
    private Integer spellPower;
    private Integer manaPool;
    private Integer currentMana;
    private final Integer manaCost;
    private final Integer hitsCount;
    private final Integer abilityRange;

    public Mage(String name, Integer health, Integer attack, Integer defense, Position position, MessageCallback callback
            , Integer manaPool, Integer manaCost, Integer spellPower, Integer hitsCount, Integer abilityRange, BoardCallback boardCallback) {
        super(name, health, attack, defense, position, callback, boardCallback);
        this.manaPool = manaPool;
        this.currentMana = this.manaPool / 4;
        this.manaCost = manaCost;
        this.spellPower = spellPower;
        this.hitsCount = hitsCount;
        this.abilityRange = abilityRange;
    }

    public void blizzard() {
        sendMessage(getName() + " cast Blizzard");
        int hits = 0;
        List<Enemy> enemies = getEnemiesInRange(getPosition(), abilityRange);

        while (hits < this.hitsCount && !enemies.isEmpty()) {
            int randomEnemyPlace = (int) (Math.random() * enemies.size());
            Enemy randomEnemy = enemies.get(randomEnemyPlace);
            randomEnemy.takeDamageFromAbility(this.spellPower, this.getName());
            handleEnemyIfDead(randomEnemy);
            enemies.removeIf(Enemy::isDead);
            hits++;
        }
    }

    public void levelUp() {
        super.levelUp();
        this.manaPool += 25 * getLevel();
        this.currentMana = Math.min(this.currentMana + this.manaPool / 4, this.manaPool);
        this.spellPower += 10 * getLevel();
    }

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
}
