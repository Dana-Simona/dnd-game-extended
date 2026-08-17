package game.cell;

public interface CellVisitor {
    void visit(Floor floor);

    void visit(Wall wall);
}