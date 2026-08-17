package game;

import game.cell.Cell;
import game.cell.Position;
import game.occupant.unit.enemy.Enemy;
import game.occupant.unit.player.Player;

import java.util.List;

public class BoardManager implements BoardCallback {
    private GameBoard board;

    public BoardManager(GameBoard board) {
        this.board = board;
    }

    @Override
    public List<Player> getPlayersInRange(Position center, Integer range) {
        return board.getPlayersInRange(center, range);
    }

    @Override
    public List<Enemy> getEnemiesInRange(Position center, Integer range) {
        return board.getEnemiesInRange(center, range);
    }

    @Override
    public Enemy getClosestEnemy(Position position, Integer range) {
        Enemy closestEnemy = null;
        Integer closestRange = range;
        List<Enemy> enemiesInBoard = getEnemiesInRange(position, range);
        for (Enemy enemy : enemiesInBoard) {
            Integer currentRange = enemy.getPosition().range(position);
            if (currentRange < closestRange) {
                closestRange = currentRange;
                closestEnemy = enemy;
            }
        }
        return closestEnemy;
    }

    @Override
    public Cell getCell(Position position) {
        return board.getCell(position);
    }
}