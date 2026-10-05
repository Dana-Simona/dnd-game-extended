package game;

import game.cell.*;
import game.occupant.Corpse;
import game.occupant.Occupant;
import game.occupant.OccupantVisitor;
import game.occupant.unit.Unit;
import game.occupant.unit.enemy.Enemy;
import game.occupant.unit.player.Player;

public class MovementManager implements CellVisitor, OccupantVisitor {

    private final GameBoard board;
    private final Unit activeUnit;
    private final MessageCallback messageCallback;

    public MovementManager(GameBoard board, Unit activeUnit, MessageCallback messageCallback) {
        this.board = board;
        this.activeUnit = activeUnit;
        this.messageCallback = messageCallback;
    }

    /**
     * Unit visits wall. Does nothing.
     */
    @Override
    public void visit(Wall wall) {
    }

    /**
     * Unit visits floor. if floor is occupied - accept occupator. otherwise -
     * set unit's position to that floor.
     */
    @Override
    public void visit(Floor floor) {
        Occupant floorOccupant = floor.getOccupant();
        if (floorOccupant == null) {
            moveActiveUnitTo(floor.getPosition());
            if (activeUnit instanceof Player) {
                messageCallback.sendEvent(new GameEvent(0, ActionType.MOVE, activeUnit.getId(), null));
            } else {
                messageCallback.sendEvent(new GameEvent(1, ActionType.MOVE, activeUnit.getId(), null));
            }
        } else {
            floorOccupant.accept(this);
        }
    }

    @Override
    public void visit(Player player) {
        if (!player.isDead()) {
            activeUnit.interactWith(player);
        }
    }

    @Override
    public void visit(Enemy enemy) {
        activeUnit.interactWith(enemy);
    }

    @Override
    public void visit(Corpse corpse) {
    }

    /**
     * Unit visits staircase - set unit's position to the floor at the end of
     * the staircase. unit can't interact with staircase from the sides
     */
    @Override
    public void visit(StairCase stairCase) {
        Position unitPos = activeUnit.getPosition();
        Position stairPos = stairCase.getPosition();

        Cell currentCell = board.getCell(unitPos.getX(), unitPos.getY());
        if (currentCell instanceof StairCase) {
            return;
        }

        int deltaX = stairPos.getX() - unitPos.getX();
        int deltaY = stairPos.getY() - unitPos.getY();

        switch (stairCase.getDirection()) {
            case UP ->
                handleUpStaircase(unitPos, deltaY);
            case RIGHT ->
                handleRightStaircase(unitPos, deltaX);
            case LEFT ->
                handleLeftStaircase(unitPos, deltaX);
        }
    }

    private void handleUpStaircase(Position currentPos, int deltaY) {
        if (deltaY != 0) {
            int exitOffset = (deltaY > 0) ? (StairCase.stairLength + 1) : -(StairCase.stairLength + 1);
            Position targetPos = new Position(currentPos.getX(), currentPos.getY() + exitOffset);
            teleportToDestination(targetPos);
        }
    }

    private void handleRightStaircase(Position currentPos, int deltaX) {
        if (deltaX > 0) {
            Position targetPos = new Position(currentPos.getX() + StairCase.stairLength + 1, currentPos.getY() - 1);
            teleportToDestination(targetPos);
        } else if (deltaX < 0) {
            Position targetPos = new Position(currentPos.getX() - (StairCase.stairLength + 1), currentPos.getY() + 1);
            teleportToDestination(targetPos);
        }
    }

    private void handleLeftStaircase(Position currentPos, int deltaX) {
        if (deltaX < 0) {
            Position targetPos = new Position(currentPos.getX() - (StairCase.stairLength + 1), currentPos.getY() - 1);
            teleportToDestination(targetPos);
        } else if (deltaX > 0) {
            Position targetPos = new Position(currentPos.getX() + StairCase.stairLength + 1, currentPos.getY() + 1);
            teleportToDestination(targetPos);
        }
    }

    private void teleportToDestination(Position targetPos) {
        if (!isOutOfBounds(board, targetPos.getX(), targetPos.getY())) {
            Cell targetCell = board.getCell(targetPos.getX(), targetPos.getY());
            if (targetCell != null) {
                moveActiveUnitTo(targetPos);
            }
        }
    }

    private boolean isOutOfBounds(GameBoard board, int x, int y) {
        return x < 0 || x >= board.getWidth() || y < 0 || y >= board.getHeight();
    }

    private void moveActiveUnitTo(Position newPosition) {
        Position oldPosition = new Position(activeUnit.getPosition().getX(), activeUnit.getPosition().getY());
        activeUnit.setPosition(newPosition);
        board.setOccupant(oldPosition, null);
        board.setOccupant(newPosition, activeUnit);
    }
}
