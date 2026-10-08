package game.occupant.unit.player;

import game.ActionType;
import game.BoardCallback;
import game.GameEvent;
import game.MessageCallback;
import game.StepCounter;
import game.cell.Position;
import game.occupant.unit.enemy.Enemy;
import java.util.List;

public class Rogue extends Player {

    private Integer currentEnergy;
    private final Integer cost;
    private final Integer maxEnergy = 100;
    Integer attackRange = 2;

    public Rogue(String name, Integer health, Integer attack, Integer defense, Position position,
            Integer energyCost, MessageCallback callback, BoardCallback boardCallback, StepCounter stepCounter) {
        super(name, health, attack, defense, position, callback, boardCallback, stepCounter);
        currentEnergy = maxEnergy;
        cost = energyCost;
    }

    /**
     * Casts Rogue's special ability: Fan of Knives.
     * <p>
     * The rogue damages all the enemies on the board within range.
     */
    public void fanOfKnives() {
        sendMessage(getName() + " cast Fan of Knives.");

        List<Enemy> enemiesWithinRange = getEnemiesInRange(this.getPosition(), attackRange);
        List<String> targetIds = enemiesWithinRange.stream().map(Enemy::getId).toList();

        if (enemiesWithinRange.isEmpty()) {
            return;
        }

        sendEvent(new GameEvent(stepCounter.nextStep(), ActionType.ABILITY_CAST, getId(), targetIds, null));

        int damageAmount = getAttackPoints();
        for (Enemy enemy : enemiesWithinRange) {
            enemy.takeDamageFromAbility(damageAmount, this.getName(), this.getId());
        }

        for (Enemy enemy : enemiesWithinRange) {
            handleEnemyIfDead(enemy);
        }
    }

    /**
     * On level-up, the rogue gains additional stats.
     * <p>
     * The rogue gains additional attack.
     */
    @Override
    public void levelUp() {
        super.levelUp();
        this.currentEnergy = maxEnergy;
    }

    /**
     * Casts rogue's special ability: Fan of Knives.
     * <p>
     * The rogue only casts the ability if they have enough energy.
     *
     * @throws IllegalArgumentException If the game board is null or if it's the
     * incorrect board.
     */
    @Override
    public void abilityCast() {
        if (currentEnergy < cost) {
            sendMessage(getName() + " tried to cast Fan of Knives, but there was not enough energy: "
                    + currentEnergy + "/" + cost + ".");
        } else {
            fanOfKnives();
            currentEnergy -= cost;
        }
    }

    public Integer getCurrentEnergy() {
        return currentEnergy;
    }

    public Integer getMaxEnergy() {
        return maxEnergy;
    }

    public Integer getEnergyCost() {
        return cost;
    }

    @Override
    public String description() {
        return String.format("%-20s Health: %d/%d\t\tAttack: %d\t\tDefense: %d\t\tLevel: %d\t\tExperience: %d/%d\t\tEnergy: %d/%d",
                getName(), getCurrentHealth(), getHealthPool(), getAttackPoints(), getDefensePoints(), getLevel(), getExperience(), 50 * getLevel(), getCurrentEnergy(), getMaxEnergy());
    }

    /**
     * Handles events that happens each game tick.
     * <p>
     * The rogue's energy regenerates.
     */
    @Override
    public void onGameTick() {
        super.onGameTick();
        int regenerateEnergy = currentEnergy + 10;
        this.currentEnergy = Math.min(regenerateEnergy, 100);
    }

    @Override
    protected Integer getAddedHealth() {
        return 0;
    }

    @Override
    protected Integer getAddedAttack() {
        return 3 * getLevel();
    }

    @Override
    protected Integer getAddedDefense() {
        return 0;
    }

    @Override
    public Integer getRange() {
        return attackRange;
    }
}
