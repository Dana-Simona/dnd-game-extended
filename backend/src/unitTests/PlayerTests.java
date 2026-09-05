package unitTests;

import cli.CLI;
import game.*;
import game.cell.Floor;
import game.cell.Position;
import game.cell.Wall;
import game.occupant.unit.messageCallback;
import game.occupant.unit.enemy.monster.Monster;
import game.occupant.unit.player.*;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class PlayerTests {
    private static CLI cli;
    private static MessageCallback messageCallback;
    private static GameBoard board;
    private static BoardCallback boardCallback;

    @BeforeAll
    public static void setUp() {
        cli = new CLI();
        messageCallback = new MessageCallback() {
            @Override
            public void send(String message) {
                cli.display(message);
            }
        };
        int testWidth = 10;
        int testHeight = 10;
        board = new GameBoard(testWidth, testHeight);
        for (int x = 0; x < testWidth; x++) {
            for (int y = 0; y < testHeight; y++) {
                Position pos = new Position(x, y);
                Floor floor = new Floor();
                floor.setPosition(pos);
                board.setCell(pos, floor);
            }
        }
        for (int i = 0; i < testWidth; i++) {
            board.setCell(new Position(i, 0), new Wall());
            board.setCell(new Position(i, testHeight - 1), new Wall());
        }

        for (int j = 0; j < testHeight; j++) {
            board.setCell(new Position(0, j), new Wall());
            board.setCell(new Position(testWidth - 1, j), new Wall());
        }
        boardCallback = new BoardManager(board);
    }

    @Test
    public void testBoardAndCallbacksInitialization() {
        assertNotNull(board, "GameBoard should be initialized.");
        assertNotNull(boardCallback, "BoardCallback (BoardManager) should be initialized.");
        assertNotNull(messageCallback, "MessageCallback should be initialized.");
    }

    private void attachOccupantToBoard(messageCallback occupant) {
        occupant.setBoardCallback(boardCallback);
        MovementManager movementManager = new MovementManager(board, occupant);
        occupant.setMovementManager(movementManager);
    }

    private Monster createDummyEnemyAt(Position pos) {
        Floor floorCell = new Floor();
        floorCell.setPosition(pos);
        board.setCell(pos, floorCell);

        Monster enemy = new Monster('K', "Wright", 600, 30, 15, 3, 100, pos, messageCallback, boardCallback);
        board.setOccupant(pos, enemy);
        return enemy;
    }

    private void prepareTileForPlayer(Position pos, Player player) {
        Floor floorCell = new Floor();
        floorCell.setPosition(pos);
        board.setCell(pos, floorCell);
        board.setOccupant(pos, player);
    }

    /// test levelUps for the players
    @Test
    public void testWarriorLevelUpFrom1To2() {
        Position testPos = new Position(1, 1);
        Warrior warrior = new Warrior("Jon Snow", 300, 30, 4, 3, testPos, messageCallback, null);
        attachOccupantToBoard(warrior);

        warrior.levelUp();
        assertEquals(2, warrior.getLevel(), "Level should be 2");

        int expectedHpLvl2 = 300 + (10 * 2) + (5 * 2);
        int expectedAtkLvl2 = 30 + (4 * 2) + (2 * 2);
        int expectedDefLvl2 = 4 + (1 * 2) + (1 * 2);

        assertEquals(expectedHpLvl2, warrior.getHealthPool());
        assertEquals(expectedAtkLvl2, warrior.getAttackPoints());
        assertEquals(expectedDefLvl2, warrior.getDefensePoints());
        assertEquals(warrior.getCurrentHealth(), warrior.getHealthPool());

    }

    @Test
    public void testWarriorLevelUpFrom2To3() {
        Position testPos = new Position(1, 1);
        Warrior warrior = new Warrior("Jon Snow", 300, 30, 4, 3, testPos, messageCallback, null);
        attachOccupantToBoard(warrior);

        warrior.levelUp();
        warrior.levelUp();
        assertEquals(3, warrior.getLevel(), "Level should be 3");

        int expectedHpLvl2 = 330 + (10 * 3) + (5 * 3);
        int expectedAtkLvl2 = 42 + (4 * 3) + (2 * 3);
        int expectedDefLvl2 = 8 + (1 * 3) + (1 * 3);

        assertEquals(expectedHpLvl2, warrior.getHealthPool());
        assertEquals(expectedAtkLvl2, warrior.getAttackPoints());
        assertEquals(expectedDefLvl2, warrior.getDefensePoints());
        assertEquals(warrior.getCurrentHealth(), warrior.getHealthPool());

    }

    @Test
    public void testMageLevelUpFrom1To2() {
        Position testPos = new Position(1, 1);
        Mage mage = new Mage("Melisandre", 100, 5, 1, testPos, messageCallback, 300, 30, 15, 5, 6, null);
        attachOccupantToBoard(mage);

        mage.levelUp();
        assertEquals(2, mage.getLevel(), "Level should be 2");

        int expectedManaLvl2 = 300 + (25 * 2);
        int expectedSpellPowerLvl2 = 15 + (10 * 2);

        int expectedHpLvl2 = 100 + (10 * 2);
        int expectedAtkLvl2 = 5 + (4 * 2);
        int expectedDefLvl2 = 1 + (1 * 2);

        assertEquals(expectedHpLvl2, mage.getHealthPool());
        assertEquals(expectedAtkLvl2, mage.getAttackPoints());
        assertEquals(expectedDefLvl2, mage.getDefensePoints());

        assertEquals(expectedManaLvl2, mage.getManaPool());
        assertEquals(expectedSpellPowerLvl2, mage.getSpellPower());
        assertEquals(mage.getCurrentHealth(), mage.getHealthPool());

    }

    @Test
    public void testMageLevelUpFrom2To3() {
        Position testPos = new Position(1, 1);
        Mage mage = new Mage("Melisandre", 100, 5, 1, testPos, messageCallback, 300, 30, 15, 5, 6, null);
        attachOccupantToBoard(mage);

        mage.levelUp();
        mage.levelUp();

        assertEquals(3, mage.getLevel(), "Level should be 3");
        int expectedManaLvl2 = 350 + (25 * 3);
        int expectedSpellPowerLvl2 = 35 + (10 * 3);

        int expectedHpLvl2 = 120 + (10 * 3);
        int expectedAtkLvl2 = 13 + (4 * 3);
        int expectedDefLvl2 = 3 + (1 * 3);

        assertEquals(expectedHpLvl2, mage.getHealthPool());
        assertEquals(expectedAtkLvl2, mage.getAttackPoints());
        assertEquals(expectedDefLvl2, mage.getDefensePoints());

        assertEquals(expectedManaLvl2, mage.getManaPool());
        assertEquals(expectedSpellPowerLvl2, mage.getSpellPower());
        assertEquals(mage.getCurrentHealth(), mage.getHealthPool());
    }

    @Test
    public void testRogueLevelUpFrom1To2() {
        Position testPos = new Position(1, 1);
        Rogue rogue = new Rogue("Arya Stark", 150, 40, 2, testPos, 20, messageCallback, null);
        attachOccupantToBoard(rogue);

        rogue.levelUp();
        assertEquals(2, rogue.getLevel(), "Level should be 2");

        int expectedAtkLvl2 = 40 + (4 * 2) + (3 * 2);
        int expectedHpLvl2 = 150 + (10 * 2);
        int expectedDefLvl2 = 2 + (1 * 2);

        assertEquals(expectedHpLvl2, rogue.getHealthPool());
        assertEquals(expectedDefLvl2, rogue.getDefensePoints());
        assertEquals(expectedAtkLvl2, rogue.getAttackPoints());
        assertEquals(100, rogue.getCurrentEnergy());
        assertEquals(rogue.getCurrentHealth(), rogue.getHealthPool());

    }

    @Test
    public void testRogueLevelUpFrom2To3() {
        Position testPos = new Position(1, 1);
        Rogue rogue = new Rogue("Arya Stark", 150, 40, 2, testPos, 20, messageCallback, null);
        attachOccupantToBoard(rogue);

        rogue.levelUp();
        rogue.levelUp();

        assertEquals(3, rogue.getLevel(), "Level should be 3");
        int expectedAtkLvl2 = 54 + (4 * 3) + (3 * 3);
        int expectedHpLvl2 = 170 + (10 * 3);
        int expectedDefLvl2 = 4 + (1 * 3);

        assertEquals(expectedHpLvl2, rogue.getHealthPool());
        assertEquals(expectedDefLvl2, rogue.getDefensePoints());
        assertEquals(expectedAtkLvl2, rogue.getAttackPoints());
        assertEquals(100, rogue.getCurrentEnergy());
        assertEquals(rogue.getCurrentHealth(), rogue.getHealthPool());

    }

    @Test
    public void testHunterLevelUpFrom1To2() {
        Position testPos = new Position(1, 1);
        Hunter hunter = new Hunter("Ygritte", 220, 30, 2, testPos, 6, messageCallback, null);
        attachOccupantToBoard(hunter);

        hunter.levelUp();
        assertEquals(2, hunter.getLevel(), "Level should be 2");

        int expectedArrowsLvl2 = 10 + 10 * 2;
        int expectedAtkLvl2 = 30 + (4 * 2) + (2 * 2);
        int expectedHpLvl2 = 220 + (10 * 2);
        int expectedDefLvl2 = 2 + (1 * 2) + (1 * 2);

        assertEquals(expectedHpLvl2, hunter.getHealthPool());
        assertEquals(expectedDefLvl2, hunter.getDefensePoints());
        assertEquals(expectedAtkLvl2, hunter.getAttackPoints());
        assertEquals(expectedArrowsLvl2, hunter.getArrowCount());
        assertEquals(hunter.getCurrentHealth(), hunter.getHealthPool());

    }

    @Test
    public void testHunterLevelUpFrom2To3() {
        Position testPos = new Position(1, 1);
        Hunter hunter = new Hunter("Ygritte", 220, 30, 2, testPos, 6, messageCallback, null);
        attachOccupantToBoard(hunter);

        hunter.levelUp();
        hunter.levelUp();

        assertEquals(3, hunter.getLevel(), "Level should be 3");
        int expectedArrowsLvl2 = 30 + 10 * 3;
        int expectedAtkLvl2 = 42 + (4 * 3) + (2 * 3);
        int expectedHpLvl2 = 240 + (10 * 3);
        int expectedDefLvl2 = 6 + (1 * 3) + (1 * 3);

        assertEquals(expectedHpLvl2, hunter.getHealthPool());
        assertEquals(expectedDefLvl2, hunter.getDefensePoints());
        assertEquals(expectedAtkLvl2, hunter.getAttackPoints());
        assertEquals(expectedArrowsLvl2, hunter.getArrowCount());
        assertEquals(hunter.getCurrentHealth(), hunter.getHealthPool());

    }

    /// test the abilityCast of the players
    /// warrior
    @Test
    public void testWarriorAbilityHitsOneEnemyInRange() {
        Position playerPos = new Position(5, 5);

        Warrior warrior = new Warrior("The Hound", 400, 20, 6, 5, playerPos, messageCallback, null);
        attachOccupantToBoard(warrior);

        Monster enemy = new Monster('O', "Target Dummy", 100, 10, 0, 10, 15, new Position(5, 7), messageCallback, boardCallback);
        board.setOccupant(new Position(5, 7), enemy);
        int initialEnemyHp = enemy.getCurrentHealth();

        warrior.abilityCast();

        // Assert: The enemy health should drop from the ability damage (10% of health pool)
        assertTrue(enemy.getCurrentHealth() < initialEnemyHp, "The enemy in range should take damage.");
    }

    @Test
    public void testWarriorAbilityHitsMultipleEnemiesInRange() {
        Position playerPos = new Position(5, 5);
        Warrior warrior = new Warrior("The Hound", 400, 20, 6, 5, playerPos, messageCallback, null);
        attachOccupantToBoard(warrior);

        Monster enemy1 = createDummyEnemyAt(new Position(5, 6));
        Monster enemy2 = createDummyEnemyAt(new Position(7, 5));
        int hp1 = enemy1.getCurrentHealth();
        int hp2 = enemy2.getCurrentHealth();

        warrior.abilityCast();

        boolean enemy1Hit = enemy1.getCurrentHealth() < hp1;
        boolean enemy2Hit = enemy2.getCurrentHealth() < hp2;

        // XOR check: strictly one and only one target can return true
        assertTrue(enemy1Hit ^ enemy2Hit, "Exactly one target must take damage, never both or none.");
    }

    @Test
    public void testWarriorAbilityFailsWhenCooldownIsActive() {
        Position playerPos = new Position(5, 5);
        Warrior warrior = new Warrior("Jon Snow", 300, 30, 4, 3, playerPos, messageCallback, null);
        attachOccupantToBoard(warrior);

        warrior.abilityCast();
        int cooldownAfterFirstCast = warrior.getRemainingCooldown();

        warrior.abilityCast();

        // Assert: Cooldown shouldn't refresh or change negatively from an invalid call
        assertEquals(cooldownAfterFirstCast, warrior.getRemainingCooldown(), "Ability should fail to fire and preserve current cooldown.");
        assertTrue(warrior.getRemainingCooldown() > 0, "Cooldown status tracker should still be counting down.");
    }

    @Test
    public void testWarriorAbilityWorksWhenCooldownFinished() {
        Position playerPos = new Position(5, 5);
        Warrior warrior = new Warrior("Jon Snow", 300, 30, 4, 3, playerPos, messageCallback, null);
        attachOccupantToBoard(warrior);

        warrior.abilityCast();

        while (warrior.getRemainingCooldown() > 0) {
            warrior.onGameTick(); // Or board.tickAll() depending on how your ticks reduce player cooldowns
        }
        warrior.abilityCast();

        // Assert: Cooldown should be successfully triggered again, proving it worked
        assertTrue(warrior.getRemainingCooldown() > 0, "Ability should fire successfully after cooldown has finished.");
    }

    @Test
    public void testWarriorAbilityIgnoresEnemyOutsideRange() {
        Position playerPos = new Position(5, 5);
        Warrior warrior = new Warrior("Jon Snow", 300, 30, 4, 3, playerPos, messageCallback, null);
        attachOccupantToBoard(warrior);

        Monster farEnemy = createDummyEnemyAt(new Position(5, 9));
        int initialFarEnemyHp = farEnemy.getCurrentHealth();

        warrior.abilityCast();

        // Assert: Enemy is too far away, so health pool must remain unmodified
        assertEquals(initialFarEnemyHp, farEnemy.getCurrentHealth(), "Enemies outside range (e.g., distance 4 when range is 3) must not take damage.");
    }

    /// mage
    @Test
    public void testMageAbilityHitsOneEnemyInRangeAndDeductsMana() {
        Position playerPos = new Position(5, 5);
        // Mage stats: name, hp, atk, def, pos, callback, manaPool, currentMana, spellPower, manaCost, abilityRange...
        // Starting with 100 Mana, Cost is 30.
        Mage mage = new Mage("Melisandre", 100, 5, 1, playerPos, messageCallback, 300, 30, 15, 5, 6, boardCallback);
        attachOccupantToBoard(mage);
        prepareTileForPlayer(playerPos, mage);

        // Spawn one enemy well within range 3 (Distance = 2)
        Monster enemy = new Monster('0', "Target Dummy", 100, 10, 0, 10, 15, new Position(5, 7), messageCallback, boardCallback);
        board.setOccupant(new Position(5, 7), enemy);

        int initialEnemyHp = enemy.getCurrentHealth();

        mage.abilityCast();

        // Assert
        assertEquals(45, mage.getCurrentMana(), "Mana should be deducted by exactly the mana cost (100 - 30 = 70).");
        assertTrue(enemy.getCurrentHealth() < initialEnemyHp, "The single enemy in range should take damage from Blizzard.");
    }

    @Test
    public void testMageAbilityHitsAtLeastOneRandomEnemyWhenMultipleAreInRange() {
        Position playerPos = new Position(5, 5);
        Mage mage = new Mage("Melisandre", 100, 5, 1, playerPos, messageCallback, 300, 30, 15, 5, 6, boardCallback);
        attachOccupantToBoard(mage);
        prepareTileForPlayer(playerPos, mage);

        // Spawn two separate enemies in range
        Monster enemy1 = new Monster('1', "Dummy 1", 100, 10, 0, 10, 15, new Position(5, 6), messageCallback, boardCallback);
        Monster enemy2 = new Monster('2', "Dummy 2", 100, 10, 0, 10, 15, new Position(6, 5), messageCallback, boardCallback);
        board.setOccupant(new Position(5, 6), enemy1);
        board.setOccupant(new Position(6, 5), enemy2);

        int hp1Before = enemy1.getCurrentHealth();
        int hp2Before = enemy2.getCurrentHealth();

        // Act
        mage.abilityCast();

        boolean enemy1Hit = enemy1.getCurrentHealth() < hp1Before;
        boolean enemy2Hit = enemy2.getCurrentHealth() < hp2Before;

        // Assert: Because Blizzard targets randomly, at least one of them must be hit
        // (or both if your hitsCount loop selects different targets across iterations)
        assertTrue(enemy1Hit || enemy2Hit, "At least one of the two enemies in range must be targeted and hit.");
        assertEquals(45, mage.getCurrentMana(), "Mana should still be successfully deducted.");
    }

    @Test
    public void testMageAbilityFailsWhenManaIsLessThanCost() {
        Position playerPos = new Position(5, 5);
        // Mage has 20 current mana, but the spell costs 30 mana
        Mage mage = new Mage("Melisandre", 100, 5, 1, playerPos, messageCallback, 100, 30, 15, 5, 6, boardCallback);
        attachOccupantToBoard(mage);
        prepareTileForPlayer(playerPos, mage);

        Monster enemy = new Monster('1', "Dummy 1", 100, 10, 0, 10, 15, new Position(5, 6), messageCallback, boardCallback);
        board.setOccupant(new Position(5, 7), enemy);

        int initialEnemyHp = enemy.getCurrentHealth();

        mage.abilityCast();

        // Assert
        assertEquals(25, mage.getCurrentMana(), "Mana should NOT change if the player cannot afford the spell.");
        assertEquals(initialEnemyHp, enemy.getCurrentHealth(), "Enemy should take NO damage because the spell execution failed.");
    }

    @Test
    public void testMageAbilitySucceedsWithExactManaRequired() {
        Position playerPos = new Position(5, 5);
        // Mage has exactly 30 current mana, and the spell costs exactly 30 mana
        Mage mage = new Mage("Melisandre", 100, 5, 1, playerPos, messageCallback, 120, 30, 15, 5, 6, boardCallback);
        attachOccupantToBoard(mage);
        prepareTileForPlayer(playerPos, mage);

        Monster enemy = new Monster('1', "Dummy 1", 100, 10, 0, 10, 15, new Position(5, 6), messageCallback, boardCallback);
        board.setOccupant(new Position(5, 7), enemy);

        int initialEnemyHp = enemy.getCurrentHealth();

        // Act
        mage.abilityCast();

        // Assert
        assertEquals(0, mage.getCurrentMana(), "Mana should drop to exactly 0 when spending your remaining resource pool.");
        assertTrue(enemy.getCurrentHealth() < initialEnemyHp, "The ability should execute successfully when resource meets cost requirements perfectly.");
    }

    /// rogue
    @Test
    public void testRogueAbilityHitsOneEnemyInRangeAndDeductsEnergy() {
        Position playerPos = new Position(5, 5);
        // Rogue stats: name, hp, atk, def, pos, currentEnergy, callback, boardCallback
        // Let's assume the energyCost is 30. We start with 100 energy.
        Rogue rogue = new Rogue("Arya Stark", 150, 40, 2, playerPos, 20, messageCallback, boardCallback);
        attachOccupantToBoard(rogue);
        prepareTileForPlayer(playerPos, rogue);

        // Spawn one enemy well within Fan of Knives range (Range = 3, Distance = 1)
        Monster enemy = new Monster('1', "Dummy 1", 100, 10, 0, 10, 15, new Position(5, 6), messageCallback, boardCallback);
        board.setOccupant(new Position(5, 6), enemy);

        int initialEnemyHp = enemy.getCurrentHealth();

        // Act
        rogue.abilityCast();

        // Assert
        assertTrue(enemy.getCurrentHealth() < initialEnemyHp, "The single enemy in range must take damage.");
        assertEquals(80, rogue.getCurrentEnergy(), "Energy should be deducted by the cost (100 - 30 = 70).");
    }

    @Test
    public void testRogueAbilityHitsAllEnemiesInTheRange() {
        Position playerPos = new Position(5, 5);
        Rogue rogue = new Rogue("Arya Stark", 150, 40, 2, playerPos, 20, messageCallback, boardCallback);
        attachOccupantToBoard(rogue);
        prepareTileForPlayer(playerPos, rogue);

        // Spawn two separate enemies in range
        Monster enemy1 = new Monster('1', "Dummy 1", 100, 10, 0, 10, 15, new Position(5, 6), messageCallback, boardCallback);
        Monster enemy2 = new Monster('2', "Dummy 2", 100, 10, 0, 10, 15, new Position(6, 5), messageCallback, boardCallback);
        board.setOccupant(new Position(5, 6), enemy1);
        board.setOccupant(new Position(6, 5), enemy2);

        int hp1Before = enemy1.getCurrentHealth();
        int hp2Before = enemy2.getCurrentHealth();

        // Act
        rogue.abilityCast();

        // Assert: Unlike the Warrior or Mage who hit random targets, Fan of Knives hits EVERYONE in range
        assertTrue(enemy1.getCurrentHealth() < hp1Before, "Enemy 1 must be hit.");
        assertTrue(enemy2.getCurrentHealth() < hp2Before, "Enemy 2 must be hit.");
        assertEquals(80, rogue.getCurrentEnergy(), "Energy should be successfully deducted.");
    }

    @Test
    public void testRogueAbilityFailsWhenEnergyIsLessThanCost() {
        Position playerPos = new Position(5, 5);
        // Give the rogue only 20 energy (assuming the cost is 30)
        Rogue rogue = new Rogue("Arya Stark", 150, 40, 2, playerPos, 150, messageCallback, boardCallback);
        attachOccupantToBoard(rogue);
        prepareTileForPlayer(playerPos, rogue);

        Monster enemy = new Monster('1', "Dummy 1", 100, 10, 0, 10, 15, new Position(5, 6), messageCallback, boardCallback);
        board.setOccupant(new Position(5, 6), enemy);

        int initialEnemyHp = enemy.getCurrentHealth();

        // Act
        rogue.abilityCast();

        // Assert: Energy is too low, so nothing changes
        assertEquals(100, rogue.getCurrentEnergy(), "Energy should NOT change if the Rogue cannot afford the ability.");
        assertEquals(initialEnemyHp, enemy.getCurrentHealth(), "Enemy should take NO damage because the ability failed.");
    }

    @Test
    public void testRogueAbilitySucceedsWithExactEnergyRequired() {
        Position playerPos = new Position(5, 5);
        // Give the rogue exactly 30 energy (assuming the cost is 30)
        Rogue rogue = new Rogue("Arya Stark", 150, 40, 2, playerPos, 100, messageCallback, boardCallback);
        attachOccupantToBoard(rogue);
        prepareTileForPlayer(playerPos, rogue);

        Monster enemy = new Monster('1', "Dummy 1", 100, 10, 0, 10, 15, new Position(5, 6), messageCallback, boardCallback);
        board.setOccupant(new Position(5, 6), enemy);

        int initialEnemyHp = enemy.getCurrentHealth();

        // Act
        rogue.abilityCast();

        // Assert: The ability goes through completely and empties the energy pool
        assertEquals(0, rogue.getCurrentEnergy(), "Energy should drop to exactly 0.");
        assertTrue(enemy.getCurrentHealth() < initialEnemyHp, "The ability should execute successfully when resource meets cost requirements perfectly.");
    }

    /// hunter
    @Test
    public void testHunterAbilityHitsClosestEnemyAndDeductsArrow() {
        Position playerPos = new Position(5, 5);
        Hunter hunter = new Hunter("Ygritte", 220, 30, 2, playerPos, 6, messageCallback, boardCallback);
        attachOccupantToBoard(hunter);
        prepareTileForPlayer(playerPos, hunter);

        Monster closeEnemy = new Monster('1', "Close Dummy", 100, 10, 0, 10, 15, new Position(5, 7), messageCallback, boardCallback);
        Monster farEnemy = new Monster('2', "Far Dummy", 100, 10, 0, 10, 15, new Position(5, 9), messageCallback, boardCallback);
        board.setOccupant(new Position(5, 7), closeEnemy);
        board.setOccupant(new Position(5, 9), farEnemy);

        int initialArrows = hunter.getArrowCount();
        int closeEnemyHpBefore = closeEnemy.getCurrentHealth();
        int farEnemyHpBefore = farEnemy.getCurrentHealth();

        hunter.abilityCast();

        // Assert
        assertTrue(closeEnemy.getCurrentHealth() < closeEnemyHpBefore, "The closest enemy must take damage.");
        assertEquals(farEnemyHpBefore, farEnemy.getCurrentHealth(), "The further enemy must remain completely unharmed.");
        assertEquals(initialArrows - 1, hunter.getArrowCount(), "Exactly 1 arrow should be deducted from the quiver.");
    }

    @Test
    public void testHunterAbilityHitsOneEnemyWhenTwoAreAtSameClosestDistance() {
        Position playerPos = new Position(5, 5);
        Hunter hunter = new Hunter("Ygritte", 220, 30, 2, playerPos, 6, messageCallback, boardCallback);
        attachOccupantToBoard(hunter);
        prepareTileForPlayer(playerPos, hunter);

        Monster enemy1 = new Monster('1', "Dummy 1", 100, 10, 0, 10, 15, new Position(5, 6), messageCallback, boardCallback);
        Monster enemy2 = new Monster('2', "Dummy 2", 100, 10, 0, 10, 15, new Position(6, 5), messageCallback, boardCallback);
        board.setOccupant(new Position(5, 6), enemy1);
        board.setOccupant(new Position(6, 5), enemy2);

        int initialArrows = hunter.getArrowCount();
        int hp1Before = enemy1.getCurrentHealth();
        int hp2Before = enemy2.getCurrentHealth();

        hunter.abilityCast();

        boolean enemy1Hit = enemy1.getCurrentHealth() < hp1Before;
        boolean enemy2Hit = enemy2.getCurrentHealth() < hp2Before;

        // Assert: Strictly one of the two equidistant enemies must be hit (XOR check)
        assertTrue(enemy1Hit ^ enemy2Hit, "Exactly one of the tied closest enemies must be hit, never both.");
        assertEquals(initialArrows - 1, hunter.getArrowCount(), "An arrow is still properly consumed.");
    }

    @Test
    public void testHunterAbilityDoesNothingWhenNoEnemiesAreInRange() {
        Position playerPos = new Position(5, 5);
        Hunter hunter = new Hunter("Ygritte", 220, 9999, 2, playerPos, 2, messageCallback, boardCallback); // Range = 2
        attachOccupantToBoard(hunter);
        prepareTileForPlayer(playerPos, hunter);

        Monster farEnemy = new Monster('1', "Far Dummy", 100, 10, 0, 10, 15, new Position(5, 9), messageCallback, boardCallback);
        board.setOccupant(new Position(5, 9), farEnemy);

        int initialArrows = hunter.getArrowCount();
        int initialEnemyHp = farEnemy.getCurrentHealth();

        hunter.abilityCast();

        // Assert
        assertEquals(initialArrows, hunter.getArrowCount(), "No arrows should be spent if there are no targets in range.");
        assertEquals(initialEnemyHp, farEnemy.getCurrentHealth(), "The out-of-range enemy must take no damage.");
    }

    @Test
    public void testHunterAbilityFailsWhenOutofArrows() {
        Position playerPos = new Position(5, 5);
        Hunter hunter = new Hunter("Ygritte", 220, 30, 2, playerPos, 6, messageCallback, boardCallback);
        attachOccupantToBoard(hunter); // Use your helper method name
        prepareTileForPlayer(playerPos, hunter);

        Position tempTargetPos = new Position(5, 6);
        Monster tempDummy = new Monster('T', "Temp Target", 99999, 0, 0, 0, 0, tempTargetPos, messageCallback, boardCallback);
        board.setOccupant(tempTargetPos, tempDummy);

        while (hunter.getArrowCount() > 0) {
            hunter.abilityCast();
        }

        board.setOccupant(tempTargetPos, null);

        Monster actualEnemy = new Monster('1', "Dummy 1", 100, 10, 0, 10, 15, tempTargetPos, messageCallback, boardCallback);
        board.setOccupant(tempTargetPos, actualEnemy);
        int initialEnemyHp = actualEnemy.getCurrentHealth();

        hunter.abilityCast();

        // Assert
        assertEquals(0, hunter.getArrowCount(), "Arrow count must stay at 0.");
        assertEquals(initialEnemyHp, actualEnemy.getCurrentHealth(), "Enemy must take zero damage because the ability cannot fire without ammo.");
    }

    /// testing the move method
    @Test
    public void testPlayerMoveToEmptyFloor() {
        Position startPos = new Position(2, 2);
        Position targetPos = new Position(3, 2); // Step Right

        Warrior warrior = new Warrior("Jon Snow", 300, 30, 4, 3, startPos, messageCallback, null);
        attachOccupantToBoard(warrior);
        prepareTileForPlayer(startPos, warrior);

        Floor emptyFloor = new Floor();
        emptyFloor.setPosition(targetPos);
        board.setCell(targetPos, emptyFloor);

        warrior.requestMove(targetPos);

        // Assert: Verify position updates automatically
        assertEquals(targetPos.getX(), warrior.getPosition().getX(), "Player X should update to target cell.");
        assertEquals(targetPos.getY(), warrior.getPosition().getY(), "Player Y should update to target cell.");
        assertEquals(warrior, board.getOccupant(targetPos), "The target board position should now hold the player.");
        assertNull(board.getOccupant(startPos), "The previous tile should now be completely empty.");
    }

    @Test
    public void testPlayerMoveBlockedByWall() {
        Position startPos = new Position(2, 2);
        Position targetPos = new Position(2, 1); // Step Up

        Warrior warrior = new Warrior("Jon Snow", 300, 30, 4, 3, startPos, messageCallback, null);
        attachOccupantToBoard(warrior);
        prepareTileForPlayer(startPos, warrior);

        Wall wall = new Wall();
        wall.setPosition(targetPos);
        board.setCell(targetPos, wall);

        warrior.requestMove(targetPos);

        // Assert: Position should remain unchanged
        assertEquals(startPos.getX(), warrior.getPosition().getX(), "Player should remain static horizontally.");
        assertEquals(startPos.getY(), warrior.getPosition().getY(), "Player should remain static vertically.");
        assertEquals(warrior, board.getOccupant(startPos), "Player must remain on their original cell.");
    }

    @Test
    public void testPlayerMoveIntoEnemyTriggersCombat() {
        Position startPos = new Position(2, 2);
        Position targetPos = new Position(2, 3); // Step Down

        Warrior warrior = new Warrior("Jon Snow", 300, 9999, 4, 3, startPos, messageCallback, null);
        attachOccupantToBoard(warrior);
        prepareTileForPlayer(startPos, warrior);

        Monster enemy = createDummyEnemyAt(targetPos);

        int initialEnemyHp = enemy.getCurrentHealth();

        warrior.requestMove(targetPos);

        assertEquals(startPos.getX(), warrior.getPosition().getX(), "Player coordinates shouldn't shift when attacking.");
        assertEquals(startPos.getY(), warrior.getPosition().getY(), "Player coordinates shouldn't shift when attacking.");
        assertTrue(enemy.getCurrentHealth() < initialEnemyHp, "Deterministic stats guarantee the enemy health drops.");
    }


}
