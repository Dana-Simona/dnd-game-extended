package game;

public enum ActionType {
    LEVEL_UP("LevelUp"),
    NEXT_LEVEL("NextLevel"),
    GAIN_XP("GainXP"),
    COMBAT("Combat"),
    ROLL_ATTACK("rollAttack"),
    ROLL_DEFENSE("rollDefense"),
    WIN("Win"),
    LOSE("Lose"),
    DIE("Die"),
    MOVE("Move"),
    MELEE("Melee"),
    HEAL("Heal"),
    ABILITY_CAST("AbilityCast"),
    TAKE_DAMAGE("TakeDamage"),
    TAKE_DAMAGE_FROM_ABILITY("TakeDamageFromAbility"),
    BOSS_LEVEL("BossLevel");

    private final String label;

    ActionType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
