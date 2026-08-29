package game.cell;

import game.occupant.Occupant;

public class Floor extends Cell {

    private Occupant occupant;

    char emptyFloor = '.';

    public Floor() {
        super('.');
        this.occupant = null;
    }

    public Floor(Occupant occupant) {
        super(occupant.getCharacter());
        this.occupant = occupant;
    }

    @Override
    public void accept(CellVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public void setOccupant(Occupant occupant) {
        this.occupant = occupant;
        if (occupant == null) {
            setCharacter(emptyFloor);
        } else {
            setCharacter(occupant.getCharacter());
        }
    }

    @Override
    public Occupant getOccupant() {
        return occupant;
    }

    @Override
    public String toString() {
        if (occupant == null) {
            return super.toString();
        }
        return occupant.toString();
    }
}
