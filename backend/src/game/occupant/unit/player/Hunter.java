package game.occupant.unit.player;

import game.BoardCallback;
import game.MessageCallback;
import game.cell.Position;
import game.occupant.unit.enemy.Enemy;

public class Hunter extends Player {
    private Integer arrowCount;
    private final Integer range;
    private Integer tickCount;

    public Hunter(String name, Integer health, Integer attack, Integer defense, Position position, Integer range,
                  MessageCallback callback, BoardCallback boardCallback) {
        super(name, health, attack, defense, position, callback, boardCallback);
        this.range = range;
        this.arrowCount = 10 * getLevel();
        this.tickCount = 0;
    }

    public void shoot() {
        Enemy closestEnemy = getBoardCallback().getClosestEnemy(getPosition(), this.range);
        if (closestEnemy != null && arrowCount != 0) {
            sendMessage(getName() + "fired an arrow at" + closestEnemy.getName());
            closestEnemy.takeDamageFromAbility(getAttackPoints(), this.getName());
            handleEnemyIfDead(closestEnemy);
            arrowCount--;
        }
    }

    public void levelUp() {
        super.levelUp();
        arrowCount += this.getLevel() * 10;
    }

    public void abilityCast() {
        shoot();
    }

    public Integer getArrowCount() {
        return arrowCount;
    }

    public Integer getRange() {
        return range;
    }

    @Override
    public String description() {
        return String.format("%-20s Health: %d/%d\t\tAttack: %d\t\tDefense: %d\t\tLevel: %d\t\tExperience: %d/%d\t\tArrows: %d\t\tRange: %d",
                getName(), getCurrentHealth(), getHealthPool(), getAttackPoints(), getDefensePoints(), getLevel(), getExperience(), 50 * getLevel(), getArrowCount(), getRange());
    }

    @Override
    public void onGameTick() {
        super.onGameTick();
        if (tickCount == 10) {
            arrowCount += getLevel();
            tickCount = 0;
        } else
            tickCount++;
    }

    @Override
    protected Integer getAddedHealth() {
        return 0;
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