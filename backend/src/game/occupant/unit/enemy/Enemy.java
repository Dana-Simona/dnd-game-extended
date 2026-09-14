package game.occupant.unit.enemy;

import game.BoardCallback;
import game.MessageCallback;
import game.StepCounter;
import game.cell.Position;
import game.occupant.Corpse;
import game.occupant.OccupantVisitor;
import game.occupant.unit.OccupantFilterVisitor;
import game.occupant.unit.Unit;
import game.occupant.unit.player.Player;
import java.util.List;

public abstract class Enemy extends Unit {

    private final Integer experienceValue;

    public Enemy(char character, String name, Integer health, Integer attack, Integer defense,
            Integer experienceValue, Position position, MessageCallback callback, BoardCallback boardCallback, StepCounter stepCounter) {
        super(character, name, health, attack, defense, position, callback, boardCallback, stepCounter);
        this.experienceValue = experienceValue;
    }

    public Integer getExperienceValue() {
        return experienceValue;
    }

    @Override
    public void accept(OccupantVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public void onDeath() {
        getBoardCallback().getCell(getPosition()).setOccupant(new Corpse(getPosition(), getBoardCallback()));
        getBoardCallback().onEnemyDeath(this);
    }

    @Override
    public void accept(OccupantFilterVisitor visitor) {
        visitor.visit(this);
    }

    //when an enemy interacts with the player
    //enemy should attack the player
    @Override
    public void interactWith(Player player) {
        this.attack(player);
        if (player.isDead()) {
            player.onDeath();
            sendMessage(player.getName() + " was killed by " + getName() + ".");
            sendMessage("you lost.");
        }
    }

    //when an enemy interacts with another enemy
    //they shouldn't do anything
    @Override
    public void interactWith(Enemy enemy) {
    }

    public List<Player> getPlayersInRange(Position center, Integer range) {
        return getBoardCallback().getPlayersInRange(center, range);
    }

}
