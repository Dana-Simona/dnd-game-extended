package game;

import game.cell.*;
import game.occupant.Occupant;
import game.occupant.OccupantVisitor;
import game.occupant.unit.Unit;
import game.occupant.unit.enemy.Enemy;
import game.occupant.unit.player.Player;

public class MovementManager implements CellVisitor, OccupantVisitor {
    private final GameBoard board;
    private final Unit activeUnit;

    public MovementManager(GameBoard board, Unit activeUnit) {
        this.board = board;
        this.activeUnit = activeUnit;
    }

    /**
     * Unit visits wall.
     * Does nothing.
     */
    public void visit(Wall wall) {
        return;
    }

    /**
     * Unit visits floor.
     * if floor is occupied - accept occupator.
     * otherwise - set unit's position to that floor.
     */
    public void visit(Floor floor) {
        Occupant floorOccupant = floor.getOccupant();
        if (floorOccupant == null) {
            Position oldPosition = new Position(activeUnit.getPosition().getX(), activeUnit.getPosition().getY());
            activeUnit.setPosition(floor.getPosition());
            board.setOccupant(oldPosition, null);
            board.setOccupant(floor.getPosition(), activeUnit);
        } else {
            floorOccupant.accept(this);
        }
    }

    public void visit(Player player) {
        if (!player.isDead()) {
            activeUnit.interactWith(player);
        }
    }

    public void visit(Enemy enemy) {
        activeUnit.interactWith(enemy);
    }
}