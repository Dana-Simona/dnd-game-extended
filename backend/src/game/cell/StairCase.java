package game.cell;

import game.occupant.Occupant;

public class StairCase extends Cell {

    private boolean isVertical;
    public static  int stairLength = 3;

    public StairCase() {
        super('^');
        this.isVertical = true;
    }

    public void setOrientation(boolean isStraight) {
        this.isVertical = isStraight;
    }

    public boolean isVertical() {
        return isVertical;
    }

    @Override
    public Occupant getOccupant() {
        return null;
    }

    @Override
    public void setOccupant(Occupant occupant) {
    }

    @Override
    public void accept(CellVisitor visitor) {
        visitor.visit(this);
    }
}
