package game;

import game.cell.Cell;
import game.cell.StairCase;

public class StairCaseParser {

    public static void configureStaircases(GameBoard board) {
        boolean[][] visited = new boolean[board.getWidth()][board.getHeight()];
        for (int i = 0; i < board.getWidth(); i++) {
            for (int j = 0; j < board.getHeight(); j++) {
                if (!visited[i][j] && isStaircaseCell(board.getCell(i, j))) {
                    processStaircaseBlock(board, i, j, visited);
                }
            }
        }
    }

    private static void processStaircaseBlock(GameBoard board, int x, int y, boolean[][] visited) {
        boolean isVertical = isStaircaseAt(board, x, y + 2);
        int width = isVertical ? 2 : 3;
        int height = isVertical ? 3 : 2;
        markAndSetBlock(board, x, y, width, height, isVertical, visited);
    }

    private static void markAndSetBlock(GameBoard board, int x, int y, int w, int h, boolean isVert, boolean[][] vis) {
        for (int dx = 0; dx < w; dx++) {
            for (int dy = 0; dy < h; dy++) {
                configureSingleCell(board, x + dx, y + dy, isVert, vis);
            }
        }
    }

    private static void configureSingleCell(GameBoard board, int x, int y, boolean isVert, boolean[][] vis) {
        if (!isOutOfBounds(board, x, y)) {
            vis[x][y] = true;
            if (board.getCell(x, y) instanceof StairCase stair) {
                stair.setOrientation(isVert);
            }
        }
    }

    private static boolean isStaircaseAt(GameBoard board, int x, int y) {
        if (x < 0 || x >= board.getWidth() || y < 0 || y >= board.getHeight()) {
            return false;
        }
        return isStaircaseCell(board.getCell(x, y));
    }

    private static boolean isStaircaseCell(Cell cell) {
        return cell instanceof StairCase;
    }
    
    private static boolean isOutOfBounds(GameBoard board, int x, int y) {
        return x < 0 || x >= board.getWidth() || y < 0 || y >= board.getHeight();
    }
}
