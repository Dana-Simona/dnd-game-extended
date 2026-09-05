package game.occupant.unit.enemy.monster;

import game.BoardCallback;
import game.MessageCallback;
import game.StepCounter;
import game.cell.Position;
import game.occupant.unit.enemy.Enemy;
import game.occupant.unit.player.Player;
import java.util.List;
import java.util.Random;

public class Monster extends Enemy {

    private final Integer visionRange;
    private final Random rand = new Random();

    public Monster(char character, String name, Integer health, Integer attack, Integer defense,
            Integer visionRange, Integer experienceValue, Position position,
            MessageCallback callback, BoardCallback boardCallback, StepCounter stepCounter) {
        super(character, name, health, attack, defense, experienceValue, position, callback, boardCallback, stepCounter);
        this.visionRange = visionRange;
    }

    public Integer getVisionRange() {
        return visionRange;
    }

    public void move() {
        List<Player> playerList = getPlayersInRange(getPosition(), visionRange);

        if (playerList.isEmpty()) {
            roam();
        } else {
            Player player = playerList.getFirst();
            chase(player);
        }
    }

    protected void chase(Player player) {
        Integer monsterX = getPosition().getX();
        Integer monsterY = getPosition().getY();

        Integer dx = monsterX - player.getPosition().getX();
        Integer dy = monsterY - player.getPosition().getY();

        Position targetPosition;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
                targetPosition = new Position(monsterX - 1, monsterY);
            } else {
                targetPosition = new Position(monsterX + 1, monsterY);
            }
        } else {
            if (dy > 0) {
                targetPosition = new Position(monsterX, monsterY - 1);
            } else {
                targetPosition = new Position(monsterX, monsterY + 1);
            }
        }

        requestMove(targetPosition);
    }

    protected void roam() {
        Integer monsterX = getPosition().getX();
        Integer monsterY = getPosition().getY();

        Position targetPosition;

        int direction = rand.nextInt(4);
        switch (direction) {
            case 0 ->
                targetPosition = new Position(monsterX + 1, monsterY);
            case 1 ->
                targetPosition = new Position(monsterX - 1, monsterY);
            case 2 ->
                targetPosition = new Position(monsterX, monsterY + 1);
            default ->
                targetPosition = new Position(monsterX, monsterY - 1);
        }

        requestMove(targetPosition);
    }

    @Override
    public void onGameTick() {
        move();
    }

    @Override
    public String description() {
        return String.format("%-20s Health: %d/%d\t\tAttack: %d\t\tDefense: %d\t\tExperience Value: %d\t\tVision Range: %d",
                getName(),
                getCurrentHealth(),
                getHealthPool(),
                getAttackPoints(),
                getDefensePoints(),
                getExperienceValue(),
                getVisionRange()
        );
    }
}
