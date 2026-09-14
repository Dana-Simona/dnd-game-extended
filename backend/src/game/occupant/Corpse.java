package game.occupant;

import game.BoardCallback;
import game.cell.Position;
import game.occupant.unit.OccupantFilterVisitor;

public class Corpse extends Occupant {

    public Corpse(Position position, BoardCallback boardCallback) {
        super('x', position, boardCallback);
        setHasTicked(true);
    }

    @Override
    public void accept(OccupantVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public void accept(OccupantFilterVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public void onGameTick() {
    }
}
