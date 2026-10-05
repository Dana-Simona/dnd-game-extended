package game.cell;

import game.occupant.Occupant;

public class StairCase extends Cell {

    private StairDirection direction;
    public static int stairLength = 3;

    public StairCase(StairDirection direction) {
        super('^');
        this.direction = direction;
    }

    public void setDirection(StairDirection direction) {
        this.direction = direction;
    }

    public StairDirection getDirection() {
        return direction;
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
