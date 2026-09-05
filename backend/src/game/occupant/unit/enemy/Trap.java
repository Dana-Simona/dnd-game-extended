package game.occupant.unit.enemy;

import game.BoardCallback;
import game.MessageCallback;
import game.StepCounter;
import game.cell.Position;
import game.occupant.unit.player.Player;
import java.util.List;

public class Trap extends Enemy {

    private final Integer visibilityTime;
    private final Integer invisibilityTime;
    private Integer ticksCount;
    private Boolean isVisible;

    public Trap(char character, String name, Integer health, Integer attack, Integer defense,
            Integer experienceValue, Integer visibilityTime, Integer invisibilityTime,
            Position position, MessageCallback callback, BoardCallback boardCallBack, StepCounter stepCounter) {
        super(character, name, health, attack, defense, experienceValue, position, callback, boardCallBack, stepCounter);
        this.visibilityTime = visibilityTime;
        this.invisibilityTime = invisibilityTime;
        this.ticksCount = 0;
        this.isVisible = true;
    }

    public void update() {
        ticksCount++;
        if (ticksCount == (visibilityTime + invisibilityTime)) {
            ticksCount = 0;
        }
        this.isVisible = ticksCount < visibilityTime;
    }

    public Boolean isVisible() {
        return isVisible;
    }

    @Override
    public String toString() {
        if (isVisible) {
            return getCharacter() + "";
        } else {
            return ".";
        }
    }

    @Override
    public void onGameTick() {
        update();
        List<Player> playersInRange = getPlayersInRange(getPosition(), 2);
        for (Player player : playersInRange) {
            attack(player);
        }
    }

    @Override
    public String description() {
        return String.format("%-24sHealth: %d/%d\t\tAttack: %d\t\tDefense: %d\t\tExperience Value: %d",
                getName(),
                getCurrentHealth(),
                getHealthPool(),
                getAttackPoints(),
                getDefensePoints(),
                getExperienceValue()
        );
    }
}
