package game.occupant.unit.player;

import game.BoardCallback;
import game.MessageCallback;
import game.cell.Position;
import game.occupant.unit.enemy.Enemy;

import java.util.List;

public class Warrior extends Player {
    private final Integer cooldown;
    private Integer remainingCooldown;

    public Warrior(String name, Integer health, Integer attack, Integer defense, Integer cooldown,
                   Position position, MessageCallback callback, BoardCallback boardCallback) {
        super(name, health, attack, defense, position, callback, boardCallback);
        this.cooldown = cooldown;
        this.remainingCooldown = 0;
    }

    /**
     * Casts warrior's special ability: Avenger's Shield.
     * <p>
     * The warrior damages a random enemy on the board within range, and heals itself.
     */
    private void avengersShield() {
        sendMessage(getName() + " used Avenger's Shield");
        avengersShieldAttack();
        avengersShieldHeal();
    }

    /**
     * Casts the offensive part of Avenger's Shield.
     * <p>
     * The warrior damages a random enemy on the board within range.
     */
    private void avengersShieldAttack() {
        Integer attackRange = 3;
        List<Enemy> enemiesWithinRange = getEnemiesInRange(this.getPosition(), attackRange);

        if (!enemiesWithinRange.isEmpty()) {
            int randomEnemyIndex = (int) (Math.random() * (enemiesWithinRange.size()));
            Enemy randomEnemy = enemiesWithinRange.get(randomEnemyIndex);

            int damage = (int) (getHealthPool() * 0.1);
            randomEnemy.takeDamageFromAbility(damage, this.getName());
            handleEnemyIfDead(randomEnemy);
        }
    }

    /**
     * Casts the utility part of Avenger's Shield.
     * <p>
     * Heals the warrior.
     */
    private void avengersShieldHeal() {
        int heal = this.getDefensePoints() * 10;
        this.heal(heal);
        sendMessage("Avenger's Shield healed " + getName() + " for " + heal + "hp.");
    }

    /**
     * On level-up, the warrior gains additional stats.
     * <p>
     * The warrior gains additional health, attack, and defense,
     * And the cooldown resets.
     */
    public void levelUp() {
        super.levelUp();
        this.remainingCooldown = 0;
    }

    /**
     * Casts warrior's special ability: Avenger's Shield.
     * <p>
     * The warrior only casts the ability if it's not on cooldown.
     *
     * @throws IllegalArgumentException If the game board is null or if it's the incorrect board.
     */
    public void abilityCast() {
        if (remainingCooldown == 0) {
            avengersShield();
            remainingCooldown = cooldown + 1;
        } else {
            sendMessage(getName() + " tried to cast Avenger's Shield, but there is a cooldown: " + remainingCooldown);
        }
    }

    @Override
    public String description() {
        return String.format("%-20s Health: %d/%d\t\tAttack: %d\t\tDefense: %d\t\tLevel: %d\t\tExperience: %d/%d\t\tCooldown: %d/%d",
                getName(), getCurrentHealth(), getHealthPool(), getAttackPoints(), getDefensePoints(), getLevel(), getExperience(), 50 * getLevel(), getRemainingCooldown(), getCooldown());
    }

    public Integer getCooldown() {
        return cooldown;
    }

    public Integer getRemainingCooldown() {
        return remainingCooldown;
    }

    /**
     * Handles events that happens each game tick.
     * <p>
     * The cooldown of the warrior's special ability decreases
     */
    @Override
    public void onGameTick() {
        super.onGameTick();
        reduceCooldown();
    }

    private void reduceCooldown() {
        if (remainingCooldown > 0)
            remainingCooldown--;
    }

    @Override
    protected Integer getAddedHealth() {
        return 5 * getLevel();
    }

    @Override
    protected Integer getAddedAttack() {
        return 2 * getLevel();
    }

    @Override
    protected Integer getAddedDefense() {
        return getLevel();
    }
}