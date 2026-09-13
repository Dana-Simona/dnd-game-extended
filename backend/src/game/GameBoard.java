package game;

import game.cell.Cell;
import game.cell.Position;
import game.occupant.Occupant;
import game.occupant.unit.OccupantFilterVisitor;
import game.occupant.unit.enemy.Enemy;
import game.occupant.unit.player.Player;
import java.util.ArrayList;
import java.util.List;

public class GameBoard {

    private final Cell[][] board;
    private final List<Enemy> enemies;

    public GameBoard(int boardWidth, int boardHeight) {
        this.board = new Cell[boardWidth][boardHeight];
        this.enemies = new ArrayList<>();
    }

    public void setCell(Position position, Cell cell) {
        this.board[position.getX()][position.getY()] = cell;

        if (cell != null && cell.getOccupant() instanceof Enemy enemy) {
            if (!enemies.contains(enemy)) {
                enemies.add(enemy);
            }
        }
    }

    public Occupant getOccupant(Position position) {
        return getCell(position).getOccupant();
    }

    public Cell getCell(Position p) {
        return board[p.getX()][p.getY()];
    }

    public Cell getCell(int x, int y) {
        return board[x][y];
    }

    public void setOccupant(Position position, Occupant occupant) {
        if (occupant instanceof Enemy enemy && !enemies.contains(enemy)) {
            enemies.add(enemy);
        }

        if (occupant != null) {
            occupant.setPosition(position);
        }

        getCell(position).setOccupant(occupant);
    }

    public void removeEnemy(Enemy enemy) {
        enemies.remove(enemy);
        if (enemy.getPosition() != null) {
            getCell(enemy.getPosition()).setOccupant(null);
        }
    }

    public List<Enemy> getEnemies() {
        return enemies;
    }

    public OccupantFilterVisitor scanWithinRange(Position center, Integer maxRange) {
        OccupantFilterVisitor ofv = new OccupantFilterVisitor();

        for (int y = 0; y < getHeight(); y++) {
            for (int x = 0; x < getWidth(); x++) {
                Position current = new Position(x, y);
                if (current.range(center) < maxRange) {
                    Occupant occupant = getOccupant(current);
                    if (occupant != null && occupant != getOccupant(center)) {
                        occupant.accept(ofv);
                    }
                }
            }
        }
        return ofv;
    }

    public List<Player> getPlayersInRange(Position center, Integer maxRange) {
        OccupantFilterVisitor filter = scanWithinRange(center, maxRange);
        return filter.getPlayers();
    }

    public List<Enemy> getEnemiesInRange(Position center, Integer maxRange) {
        OccupantFilterVisitor filter = scanWithinRange(center, maxRange);
        return filter.getEnemies();
    }

    private void unflagAllTicks() {
        for (Cell[] row : board) {
            for (Cell cell : row) {
                Occupant occupant = cell.getOccupant();
                if (occupant != null) {
                    occupant.setHasTicked(false);
                }
            }
        }
    }

    public void tickAll() {
        unflagAllTicks();
        for (Cell[] row : board) {
            for (Cell cell : row) {
                Occupant occupant = cell.getOccupant();
                if (occupant != null && !occupant.hasTicked()) {
                    occupant.onGameTick();
                    occupant.setHasTicked(true);
                }
            }
        }
    }

    public boolean isLevelComplete() {
        return enemies.isEmpty();
    }

    @Override
    public String toString() {
        StringBuilder output = new StringBuilder();
        for (int y = 0; y < board[0].length; y++) {
            for (Cell[] cells : board) {
                output.append(cells[y].toString());
            }
            output.append("\n");
        }
        return output.toString();
    }

    public Integer getWidth() {
        return board.length;
    }

    public Integer getHeight() {
        return board[0].length;
    }
}
