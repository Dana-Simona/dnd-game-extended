
import game.cell.Position;
import game.occupant.unit.Unit;
import game.occupant.unit.enemy.Enemy;
import game.occupant.unit.enemy.Trap;
import game.occupant.unit.enemy.monster.Boss;
import game.occupant.unit.enemy.monster.Monster;
import game.occupant.unit.player.Hunter;
import game.occupant.unit.player.Mage;
import game.occupant.unit.player.Player;
import game.occupant.unit.player.Rogue;
import game.occupant.unit.player.Warrior;

public class UnitJsonBuilder {

    /**
     * Converts any Unit into its complete JSON string representation.
     */
    public static String toJson(Unit unit) {
        return buildUnitJson(new StringBuilder(), unit, null).toString();
    }

    /**
     * Converts any Unit into JSON, optionally attaching a player selection
     * index.
     */
    public static String toJson(Unit unit, Integer playerIndex) {
        return buildUnitJson(new StringBuilder(), unit, playerIndex).toString();
    }

    /**
     * Appends the JSON representation of a Unit directly to an existing
     * StringBuilder.
     */
    public static StringBuilder buildUnitJson(StringBuilder json, Unit unit, Integer playerIndex) {
        if (unit == null) {
            json.append("null");
            return json;
        }

        json.append("{");

        if (playerIndex != null) {
            json.append("\"index\":").append(playerIndex).append(",");
        }

        buildUnitBaseJson(json, unit);

        switch (unit) {
            case Mage mage ->
                buildMageJson(json, mage);
            case Rogue rogue ->
                buildRogueJson(json, rogue);
            case Warrior warrior ->
                buildWarriorJson(json, warrior);
            case Hunter hunter ->
                buildHunterJson(json, hunter);
            case Boss boss ->
                buildBossJson(json, boss);
            case Monster monster ->
                buildMonsterJson(json, monster);
            case Trap trap ->
                buildTrapJson(json, trap);
            default -> {
            }
        }

        json.append("}");
        return json;
    }

    private static void buildUnitBaseJson(StringBuilder json, Unit unit) {
        if (unit == null) {
            return;
        }

        String unitType = (unit instanceof Player) ? "Player" : unit.getClass().getSimpleName();

        int x = 0;
        int y = 0;
        Position pos = unit.getPosition();
        if (pos != null) {
            Integer px = pos.getX();
            Integer py = pos.getY();
            if (px != null) {
                x = px;
            }
            if (py != null) {
                y = py;
            }
        }

        json.append("\"unitType\":\"").append(escapeJson(unitType)).append("\",")
                .append("\"name\":\"").append(escapeJson(unit.getName())).append("\",")
                .append("\"id\":\"").append(escapeJson(unit.getId())).append("\",")
                .append("\"character\":\"").append(escapeJson(unit.getCharacter())).append("\",")
                .append("\"x\":").append(x).append(",")
                .append("\"y\":").append(y).append(",")
                .append("\"health\":").append(unit.getHealthPool()).append(",")
                .append("\"currentHealth\":").append(unit.getCurrentHealth()).append(",")
                .append("\"attack\":").append(unit.getAttackPoints()).append(",")
                .append("\"defense\":").append(unit.getDefensePoints());
    }

    private static void buildPlayerBaseJson(StringBuilder json, Player player) {
        json.append(",\"class\":\"").append(escapeJson(player.getClass().getSimpleName().toLowerCase())).append("\",")
                .append("\"currentExp\":").append(player.getExperience()).append(",")
                .append("\"expRequiredForNextLevel\":").append(player.experienceRequiredForNextLevel()).append(",")
                .append("\"level\":").append(player.getLevel());
    }

    private static void buildEnemyBaseJson(StringBuilder json, Enemy enemy) {
        json.append(",\"experienceValue\":").append(enemy.getExperienceValue());
    }

    private static void buildBossJson(StringBuilder json, Boss boss) {
        buildMonsterJson(json, boss);
        json.append(",\"abilityFrequency\":").append(boss.getAbilityFrequency());
    }

    private static void buildTrapJson(StringBuilder json, Trap trap) {
        buildEnemyBaseJson(json, trap);
        json.append(",\"isVisible\":").append(trap.isVisible());
    }

    private static void buildWarriorJson(StringBuilder json, Warrior warrior) {
        buildPlayerBaseJson(json, warrior);
        json.append(",\"cooldown\":").append(warrior.getCooldown())
                .append(",\"currentCooldown\":").append(warrior.getRemainingCooldown());
    }

    private static void buildMageJson(StringBuilder json, Mage mage) {
        buildPlayerBaseJson(json, mage);
        json.append(",\"manaPool\":").append(mage.getManaPool())
                .append(",\"currentMana\":").append(mage.getCurrentMana())
                .append(",\"manaCost\":").append(mage.getManaCost())
                .append(",\"spellPower\":").append(mage.getSpellPower())
                .append(",\"hitCount\":").append(mage.getHitCount())
                .append(",\"range\":").append(mage.getAbilityRange());
    }

    private static void buildRogueJson(StringBuilder json, Rogue rogue) {
        buildPlayerBaseJson(json, rogue);
        json.append(",\"energy\":").append(100)
                .append(",\"currentEnergy\":").append(rogue.getCurrentEnergy())
                .append(",\"energyCost\":").append(rogue.getEnergyCost());
    }

    private static void buildHunterJson(StringBuilder json, Hunter hunter) {
        buildPlayerBaseJson(json, hunter);
        json.append(",\"arrowCount\":").append(hunter.getArrowCount())
                .append(",\"range\":").append(hunter.getRange());
    }

    private static void buildMonsterJson(StringBuilder json, Monster monster) {
        buildEnemyBaseJson(json, monster);
        json.append(",\"visionRange\":").append(monster.getVisionRange());
    }

    private static String escapeJson(Object input) {
        if (input == null) {
            return "";
        }
        return input.toString()
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
