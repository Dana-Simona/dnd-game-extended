package game.occupant;

import game.occupant.unit.enemy.Enemy;
import game.occupant.unit.player.Player;

public interface OccupantVisitor {
    void visit(Player player);

    void visit(Enemy enemy);
}