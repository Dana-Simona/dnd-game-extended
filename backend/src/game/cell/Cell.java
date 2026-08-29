package game.cell;

import game.occupant.Occupant;

public abstract class Cell {

    private char character;
    private Position position;

    public Cell(char character) {
        this.character = character;
    }

    @Override
    public String toString() {
        return character + "";
    }

    protected void setCharacter(char character) {
        this.character = character;
    }

    public Position getPosition() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public abstract Occupant getOccupant();

    public abstract void setOccupant(Occupant occupant);

    public abstract void accept(CellVisitor visitor);
}
