package game;

import game.cell.Cell;
import game.cell.Position;
import game.occupant.unit.enemy.Enemy;
import game.occupant.unit.player.Player;
import java.util.List;

public interface BoardCallback {

    List<Player> getPlayersInRange(Position center, Integer range);

    List<Enemy> getEnemiesInRange(Position center, Integer range);

    Enemy getClosestEnemy(Position position, Integer range);

    Cell getCell(Position position);

    void onEnemyDeath(Enemy enemy);
}
