package game.occupant.unit.enemy.monster;

import game.ActionType;
import game.BoardCallback;
import game.GameEvent;
import game.MessageCallback;
import game.StepCounter;
import game.cell.Position;
import game.occupant.unit.HeroicUnit;
import game.occupant.unit.player.Player;
import java.util.List;

public class Boss extends Monster implements HeroicUnit {

    private final Integer abilityFrequency;
    private Integer combatTicks;

    public Boss(char character, String name, Integer health, Integer attack, Integer defense,
            Integer visionRange, Integer experienceValue, Integer abilityFrequency, Position position,
            MessageCallback callback, BoardCallback boardCallback, StepCounter stepCounter) {
        super(character, name, health, attack, defense, visionRange, experienceValue, position, callback, boardCallback, stepCounter);

        if (abilityFrequency <= 0) {
            throw new IllegalArgumentException("ability frequency must be positive");
        }
        this.abilityFrequency = abilityFrequency;
        this.combatTicks = 0;
    }

    @Override
    public void abilityCast() {
        Player player = playerInRange();
        if (player != null) {
            shoeBodyBop(player);
        }
    }

    public void shoeBodyBop(Player player) {
        sendEvent(new GameEvent(stepCounter.nextStep(), ActionType.ABILITY_CAST, getId(), player.getId(), null));
        player.takeDamageFromAbility(getAttackPoints(), getName());
    }

    private Player playerInRange() {
        List<Player> playerList = getPlayersInRange(getPosition(), getVisionRange());
        if (!playerList.isEmpty()) {
            return playerList.getFirst();
        }
        return null;
    }

    @Override
    public void move() {
        Player player = playerInRange();
        if (player != null) {
            if (combatTicks.equals(abilityFrequency)) {
                combatTicks = 0;
                abilityCast();
            } else {
                super.chase(player);
                combatTicks++;
            }
        } else {
            super.roam();
            combatTicks = 0;
        }
    }

    public Integer getCombatTicks() {
        return combatTicks;
    }

    public Integer getAbilityFrequency() {
        return abilityFrequency;
    }

    @Override
    public void onGameTick() {
        super.onGameTick();
        this.move();
    }
}
