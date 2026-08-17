package game.cell;

public class Position {
    private Integer x, y;

    public Position(Integer x, Integer y) {
        this.x = x;
        this.y = y;
    }

    public Integer getX() {
        return this.x;
    }

    public Integer getY() {
        return this.y;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public Integer range(Position other) {
        int disX = this.x - other.getX();
        int disY = this.y - other.getY();
        return (int) (Math.sqrt((Math.pow(disX, 2)) + (Math.pow(disY, 2))));
    }

    public boolean equals(Position position) {
        return position.getX().equals(getX()) && position.getY().equals(getY());
    }
}
