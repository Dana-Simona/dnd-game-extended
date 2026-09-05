package game;

public interface MessageCallback {

    void send(String message);

    void sendEvent(GameEvent event);
}
