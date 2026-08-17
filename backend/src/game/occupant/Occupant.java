package game.occupant;

import game.BoardCallback;
import game.MovementManager;
import game.cell.Cell;
import game.cell.Position;
import game.occupant.unit.OccupantFilterVisitor;

public abstract class Occupant {
    private char character;
    private Position position;
    private MovementManager movementManager;
    private BoardCallback boardCallback;
    private boolean hasTicked;

    public Occupant(char character, Position position, BoardCallback boardCallback) {
        this.character = character;
        this.position = position;
        this.hasTicked = false;
        this.boardCallback = boardCallback;
    }

    public boolean hasTicked() {
        return hasTicked;
    }

    public BoardCallback getBoardCallback() {
        return boardCallback;
    }

    public void setBoardCallback(BoardCallback boardCallback) {
        this.boardCallback = boardCallback;
    }

    public void setHasTicked(boolean hasTicked) {
        this.hasTicked = hasTicked;
    }

    public void setMovementManager(MovementManager movementManager) {
        this.movementManager = movementManager;
    }

    public MovementManager getMovementManager() {
        return movementManager;
    }

    public char getCharacter() {
        return this.character;
    }

    public void setCharacter(char newChar) {
        this.character = newChar;
    }

    public Position getPosition() {
        return this.position;
    }

    public void setPosition(int x, int y) {
        this.position.setX(x);
        this.position.setY(y);
    }

    public void requestMove(Position tagetPosition) {
        if (boardCallback == null) {
            throw new IllegalArgumentException("BoardCallback is Null!! " + this.getCharacter());
        }
        Cell tagetCell = boardCallback.getCell(tagetPosition);
        tagetCell.accept(getMovementManager());
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public abstract void accept(OccupantVisitor visitor);

    public abstract void accept(OccupantFilterVisitor visitor);

    /**
     * Applies tick effects.
     */
    public abstract void onGameTick();

    public String toString() {
        return character + "";
    }

}