import cli.CLI;
import game.Game;
import game.MessageCallback;

public class Main {
    public static void main(String[] args) {
        CLI cli = new CLI();
        MessageCallback callback = cli::display;
        new Game(callback);
    }
}
