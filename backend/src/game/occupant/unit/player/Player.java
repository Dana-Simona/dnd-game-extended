package game.occupant.unit.player;

import game.ActionType;
import game.BoardCallback;
import game.GameEvent;
import game.MessageCallback;
import game.StepCounter;
import game.cell.Position;
import game.occupant.OccupantVisitor;
import game.occupant.unit.OccupantFilterVisitor;
import game.occupant.unit.Unit;
import game.occupant.unit.enemy.Enemy;
import java.util.List;

public abstract class Player extends Unit {

    private Integer level;
    private Integer experience;

    public Player(String name, Integer health, Integer attack, Integer defense, Position position,
            MessageCallback callback, BoardCallback boardCallback, StepCounter stepCounter) {
        super('@', name, health, attack, defense, position, callback, boardCallback, stepCounter);
        this.experience = 0;
        this.level = 1;
    }

    public void levelUp() {
        this.experience -= 50 * level;
        this.level++;

        int overallAddedHealth = calculateSumToAdd(getAddedHealth(), 5 * level);

        int overallAddedAttack = calculateSumToAdd(getAddedAttack(), 2 * level);

        int overallAddedDefense = calculateSumToAdd(getAddedDefense(), level);

        addMaxHealth(overallAddedHealth);
        heal(getHealthPool());
        addAttackPoints(overallAddedAttack);
        addDefensePoints(overallAddedDefense);
        this.sendMessage(this.getName() + " reached level " + level + ": +" + overallAddedHealth + " Health, +" + overallAddedAttack + " Attack, +" + overallAddedDefense + " Defense");
        this.sendEvent(new GameEvent(stepCounter.nextStep(), ActionType.LEVEL_UP, this.getId(), this.level));
    }

    private Integer calculateSumToAdd(Integer addedIndividually, Integer addedDefaultly) {
        return addedIndividually + addedDefaultly;
    }

    public abstract void abilityCast();

    public void gainExperience(Integer experience) {
        this.experience += experience;
    }

    @Override
    public void accept(OccupantVisitor visitor) {
        visitor.visit(this);
    }

    //when a player interacts with another player
    //(shouldn't happen)
    @Override
    public void interactWith(Player player) {
    }

    //when a player interacts with an enemy
    //player should attack the enemy
    @Override
    public void interactWith(Enemy enemy) {
        this.attack(enemy);
        handleEnemyIfDead(enemy);
    }

    protected void handleEnemyIfDead(Enemy enemy) {
        if (enemy.isDead()) {
            enemy.onDeath();
            gainExperience(enemy.getExperienceValue());
            sendMessage(enemy.getName() + " died. " + this.getName() + " gained " + enemy.getExperienceValue() + " experience");
            sendEvent(new GameEvent(stepCounter.nextStep(), ActionType.DIE, enemy.getId(), null));
            sendEvent(new GameEvent(stepCounter.nextStep(), ActionType.GAIN_XP, this.getId(), enemy.getId(), enemy.getExperienceValue()));
        }
    }

    @Override
    public void onDeath() {
        this.setCharacter('X');
        sendEvent(new GameEvent(stepCounter.nextStep(), ActionType.DIE, this.getId(), null));
    }

    public Integer getLevel() {
        return level;
    }

    public Integer getExperience() {
        return experience;
    }

    public Integer experienceRequiredForNextLevel() {
        return 50 * level;
    }

    @Override
    public void onGameTick() {
        while (getExperience() >= experienceRequiredForNextLevel()) {
            levelUp();
        }
    }

    public List<Enemy> getEnemiesInRange(Position center, Integer range) {
        return getBoardCallback().getEnemiesInRange(center, range);
    }

    protected abstract Integer getAddedHealth();

    protected abstract Integer getAddedAttack();

    protected abstract Integer getAddedDefense();

    @Override
    public void accept(OccupantFilterVisitor visitor) {
        visitor.visit(this);
    }

    abstract public Integer getRange();
}
