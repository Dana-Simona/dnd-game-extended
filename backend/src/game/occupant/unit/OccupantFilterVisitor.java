package game.occupant.unit;

import game.occupant.Corpse;
import game.occupant.OccupantVisitor;
import game.occupant.unit.enemy.Enemy;
import game.occupant.unit.player.Player;
import java.util.ArrayList;
import java.util.List;

public class OccupantFilterVisitor implements OccupantVisitor {

    private final List<Player> players;
    private final List<Enemy> enemies;

    public OccupantFilterVisitor() {
        players = new ArrayList<>();
        enemies = new ArrayList<>();
    }

    public List<Enemy> getEnemies() {
        return enemies;
    }

    public List<Player> getPlayers() {
        return players;
    }

    @Override
    public void visit(Player player) {
        players.add(player);
    }

    @Override
    public void visit(Enemy enemy) {
        enemies.add(enemy);
    }

    @Override
    public void visit(Corpse corpse) {
    }
}
