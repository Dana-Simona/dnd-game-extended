package game.occupant.unit;

public class Health {
    protected Integer healthPool;
    protected Integer currentHealth;

    public Health(Integer pool) {
        healthPool = pool;
        currentHealth = pool;
    }

    protected void increaseMaxHealth(Integer increaseBy) {
        this.currentHealth += increaseBy;
        this.healthPool += increaseBy;
    }

    protected void heal(Integer healAmount) {
        if (healAmount + currentHealth >= healthPool)
            this.currentHealth = healthPool;
        else
            this.currentHealth += healAmount;
    }

    protected void takeDamage(Integer damageAmount) {
        if (currentHealth - damageAmount < 0)
            this.currentHealth = 0;
        else {
            this.currentHealth -= damageAmount;
        }
    }

    public Integer getHealthPool() {
        return this.healthPool;
    }

    public Integer getCurrentHealth() {
        return this.currentHealth;
    }

    public String toString() {
        return currentHealth.toString() + "/" + healthPool.toString();
    }
}
