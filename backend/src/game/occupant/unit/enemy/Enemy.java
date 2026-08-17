package game.occupant.unit.enemy;

import game.BoardCallback;
import game.MessageCallback;
import game.cell.Position;
import game.occupant.OccupantVisitor;
import game.occupant.unit.OccupantFilterVisitor;
import game.occupant.unit.Unit;
import game.occupant.unit.player.Player;

import java.util.List;

public abstract class Enemy extends Unit {
    private final Integer experienceValue;

    public Enemy(char character, String name, Integer health, Integer attack, Integer defense,
                 Integer experienceValue, Position position, MessageCallback callback, BoardCallback boardCallback) {
        super(character, name, health, attack, defense, position, callback, boardCallback);
        this.experienceValue = experienceValue;
    }

    public Integer getExperienceValue() {
        return experienceValue;
    }

    public void accept(OccupantVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public void onDeath() {
        getBoardCallback().getCell(getPosition()).setOccupant(null);
    }

    public void accept(OccupantFilterVisitor visitor) {
        visitor.visit(this);
    }

    //when an enemy interacts with the player
    //enemy should attack the player
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
    public void interactWith(Enemy enemy) {
        return;
    }

    public List<Player> getPlayersInRange(Position center, Integer range) {
        return getBoardCallback().getPlayersInRange(center, range);
    }

}