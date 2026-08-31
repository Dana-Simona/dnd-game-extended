package game.cell;

import game.occupant.Occupant;

public class StairCase extends Cell {

    private boolean isVertical;
    public static int stairLength = 3;

    public StairCase(boolean isVertical) {
        super('^');
        this.isVertical = isVertical;
    }

    public void setIsVertical(boolean isVertical) {
        this.isVertical = isVertical;
    }

    public boolean getIsVertical() {
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
