package game;

import java.util.List;

public class GameEvent {

    private final int step;
    private final ActionType type;
    private final String sourceId;
    private final List<String> targetIds;
    private final Integer amount;

    public GameEvent(int step, ActionType type, String sourceId, List<String> targetIds, Integer amount) {
        this.step = step;
        this.type = type;
        this.sourceId = sourceId;
        this.targetIds = targetIds;
        this.amount = amount;
    }

    public GameEvent(int step, ActionType type, String sourceId, String singleTargetId, Integer amount) {
        this(
                step,
                type,
                sourceId,
                singleTargetId != null ? List.of(singleTargetId) : null,
                amount
        );
    }

    public GameEvent(int step, ActionType type, String sourceId, Integer amount) {
        this(
                step,
                type,
                sourceId,
                (List<String>) null,
                amount
        );
    }

    public int getStep() {
        return step;
    }

    public ActionType getType() {
        return type;
    }

    public String getSourceId() {
        return sourceId;
    }

    public List<String> getTargetIds() {
        return targetIds;
    }

    public Integer getAmount() {
        return amount;
    }
}
