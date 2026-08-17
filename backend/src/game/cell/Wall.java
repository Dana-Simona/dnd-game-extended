package game.cell;

import game.occupant.Occupant;

public class Wall extends Cell {
    public Wall() {
        super('#');
    }

    @Override
    public Occupant getOccupant() {
        return null;
    }

    @Override
    public void setOccupant(Occupant occupant) {
        return;
    }

    public void accept(CellVisitor visitor) {
        visitor.visit(this);
    }
}