package game.occupant.unit;

import game.GameBoard;
import game.BoardCallback;
import game.MessageCallback;
import game.cell.Position;
import game.occupant.Occupant;
import game.occupant.unit.enemy.Enemy;
import game.occupant.unit.player.Player;

public abstract class Unit extends Occupant {
    private final String name;
    private final Health health;
    private Integer attackPoints;
    private Integer defensePoints;
    private final MessageCallback callback;

    public Unit(char character, String name, Integer health, Integer attack, Integer defense,
                Position position, MessageCallback callback, BoardCallback boardCallback) {
        super(character, position, boardCallback);
        this.name = name;
        this.health = new Health(health);
        this.attackPoints = attack;
        this.defensePoints = defense;
        this.callback = callback;
    }

    /**
     * Get the name of the unit.
     *
     * @return String of the unit's name
     */
    public String getName() {
        return this.name;
    }

    /**
     * Get the current health of the unit.
     *
     * @return the unit's current health
     */
    public Integer getCurrentHealth() {
        return this.health.getCurrentHealth();
    }

    /**
     * Get the health pool of the unit.
     *
     * @return the unit's health pool
     */
    public Integer getHealthPool() {
        return this.health.getHealthPool();
    }

    /**
     * Add max health to the unit's health pool
     *
     * @throws IllegalArgumentException If increaseBy is null or negative.
     */
    public void addMaxHealth(Integer increaseBy) {
        if (increaseBy == null)
            throw new IllegalArgumentException("increase by can't be null");
        if (increaseBy < 0)
            throw new IllegalArgumentException("can't increase health pool by a negative amount");
        this.health.increaseMaxHealth(increaseBy);
    }

    /**
     * The unit is being healed by a certain amount.
     *
     * @param healAmount the amount of health the unit regenerated.
     * @throws IllegalArgumentException If heal amount is negative.
     */
    public void heal(int healAmount) {
        if (healAmount < 0)
            throw new IllegalArgumentException("you can't heal negative health");
        health.heal(healAmount);
    }

    /**
     * Get the amount of the unit's attack points.
     *
     * @return Integer of the unit's attack points
     */
    public Integer getAttackPoints() {
        return attackPoints;
    }

    /**
     * Get the amount of the unit's defense points.
     *
     * @return Integer of the unit's defense points
     */
    public Integer getDefensePoints() {
        return defensePoints;
    }

    /**
     * Adds attack points to the unit's existing attack.
     *
     * @param increaseBy The amount of points to add to attackPoints.
     * @throws IllegalArgumentException If increaseBy is null or negative.
     */
    public void addAttackPoints(Integer increaseBy) {
        if (increaseBy == null)
            throw new IllegalArgumentException("attack points can't be null");
        if (increaseBy < 0)
            throw new IllegalArgumentException("can't add negative points to attack");

        this.attackPoints += increaseBy;
    }

    /**
     * adds defense points to the unit's existing defense.
     *
     * @param increaseBy The amount of points to add to attackPoints.
     * @throws IllegalArgumentException If increaseBy is null or negative.
     */
    public void addDefensePoints(Integer increaseBy) {
        if (increaseBy == null)
            throw new IllegalArgumentException("defense points can't be null");
        if (increaseBy < 0)
            throw new IllegalArgumentException("can't add negative points to defense");

        this.defensePoints += increaseBy;
    }

    /**
     * Sends a display message to the CLI.
     *
     * @param message the message to be shown in the console.
     * @throws IllegalArgumentException If message is null.
     */
    protected void sendMessage(String message) {
        if (message == null)
            throw new IllegalArgumentException("message can't be null");
        callback.send(message);
    }

    /**
     * The unit initiates attack on another unit.
     *
     * @param defender the unit that is being attacked.
     * @throws IllegalArgumentException If defender is null.
     */
    public void attack(Unit defender) {
        if (defender == null)
            throw new IllegalArgumentException("defender can't be null");

        sendMessage(this.name + " engaged in combat with " + defender.getName() + ".");
        sendMessage(this.description());
        sendMessage(defender.description());

        int attackRoll = (int) (Math.random() * (attackPoints + 1));
        sendMessage(this.name + " rolled " + attackRoll + " attack points.");

        int damageTaken = defender.defend(attackRoll);
        sendMessage(this.name + " dealt " + damageTaken + " damage to " + defender.getName() + ".");
    }

    /**
     * The unit is being attacked.
     * <p>
     * The unit may either defend the attack or take damage based on luck.
     *
     * @param incomingDamage the amount of damage that is being dealt to this unit.
     * @return the amount of damage that actually hit the defender.
     */
    public int defend(int incomingDamage) {
        int defenseRoll = (int) (Math.random() * (defensePoints + 1));
        sendMessage(this.name + " rolled " + defenseRoll + " defense points.");
        int finalDamage = incomingDamage - defenseRoll;
        if (finalDamage > 0) {
            takeDamage(finalDamage);
        } else {
            finalDamage = 0;
        }
        return finalDamage;
    }

    /**
     * The unit takes damage.
     * <p>
     * The unit rolls for defense to mitigate damage
     *
     * @param damageAmount the amount of damage the unit took.
     * @throws IllegalArgumentException If damage amount is negative.
     */
    public void takeDamage(int damageAmount) {
        if (damageAmount < 0)
            throw new IllegalArgumentException("damage dealt can't be negative");
        health.takeDamage(damageAmount);
    }

    /**
     * The unit takes damage from a special ability cast.
     * <p>
     * The unit rolls for defense to mitigate damage
     *
     * @param damageAmount the amount of damage the unit took.
     * @param attackerName the unit who is attacking the current unit.
     * @throws IllegalArgumentException If damage amount is negative.
     * @throws IllegalArgumentException If the attacker is null.
     */
    public void takeDamageFromAbility(int damageAmount, String attackerName) {
        if (damageAmount < 0)
            throw new IllegalArgumentException("damage dealt can't be negative");
        if (attackerName == null)
            throw new IllegalArgumentException("unit can't be null");
        int actualDamage = this.defend(damageAmount);
        this.takeDamage(actualDamage);

        sendMessage(attackerName + " hit " + this.getName() + " for " + actualDamage + " ability damage");
    }

    /**
     * The full formatted description of the unit's stats.
     *
     * @return A String of the full formatted description
     */
    public abstract String description();

    /**
     * Checks if the unit is dead.
     *
     * @return boolean - true if the unit is dead, false otherwise.
     */
    public boolean isDead() {
        return health.currentHealth <= 0;
    }

    /**
     * Applies death effects.
     */
    public abstract void onDeath();

    public abstract void interactWith(Player player);

    public abstract void interactWith(Enemy enemy);
}