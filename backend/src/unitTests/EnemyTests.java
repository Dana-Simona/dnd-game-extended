package unitTests;

import cli.CLI;
import game.*;
import game.cell.Floor;
import game.cell.Position;
import game.cell.Wall;
import game.occupant.unit.Unit;
import game.occupant.unit.enemy.monster.Boss;
import game.occupant.unit.enemy.monster.Monster;
import game.occupant.unit.enemy.Trap;
import game.occupant.unit.player.Player;
import game.occupant.unit.player.Warrior;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class EnemyTests {
    private CLI cli;
    private MessageCallback messageCallback;
    private GameBoard board;
    private BoardCallback boardCallback;

    @BeforeEach
    public void setUp() {
        cli = new CLI();
        messageCallback = new MessageCallback() {
            @Override
            public void send(String message) {
                cli.display(message);
            }
        };

        int testWidth = 15;
        int testHeight = 15;
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

    private void attachOccupantToBoard(Unit occupant) {
        occupant.setBoardCallback(boardCallback);
        MovementManager movementManager = new MovementManager(board, occupant);
        occupant.setMovementManager(movementManager);
    }

    private Player createDummyPlayerAt(Position pos) {
        Floor floorCell = new Floor();
        floorCell.setPosition(pos);
        board.setCell(pos, floorCell);

        // High health so it doesn't die immediately in most tests
        Warrior player = new Warrior("Jon Snow", 1000, 30, 4, 3, pos, messageCallback, boardCallback);
        attachOccupantToBoard(player);
        board.setOccupant(pos, player);
        return player;
    }

    private Player createDummyPlayerAt(Position pos, Integer playersDefencePoints) {
        Floor floorCell = new Floor();
        floorCell.setPosition(pos);
        board.setCell(pos, floorCell);

        // High health so it doesn't die immediately in most tests
        Warrior player = new Warrior("Jon Snow", 1000, 30, playersDefencePoints, 3, pos, messageCallback, boardCallback);
        attachOccupantToBoard(player);
        board.setOccupant(pos, player);
        return player;
    }

    private Monster createMonsterAt(Position pos, int hp, int attack, int defense, int visionRange, int exp) {
        Floor floorCell = new Floor();
        floorCell.setPosition(pos);
        board.setCell(pos, floorCell);

        Monster enemy = new Monster('K', "Wright", hp, attack, defense, visionRange, exp, pos, messageCallback, boardCallback);
        attachOccupantToBoard(enemy);
        board.setOccupant(pos, enemy);
        return enemy;
    }

    private Boss createBossAt(Position pos, int hp, int attack, int defense, int visionRange, int exp, int abilityFreq) {
        Floor floorCell = new Floor();
        floorCell.setPosition(pos);
        board.setCell(pos, floorCell);

        Boss boss = new Boss('M', "The Mountain", hp, attack, defense, visionRange, exp, abilityFreq, pos, messageCallback, boardCallback);
        attachOccupantToBoard(boss);
        board.setOccupant(pos, boss);
        return boss;
    }

    private Trap createTrapAt(Position pos, int visibilityTime, int invisibilityTime) {
        Floor floorCell = new Floor();
        floorCell.setPosition(pos);
        board.setCell(pos, floorCell);

        Trap trap = new Trap('B', "Bonus Trap", 1, 1, 1, 250, visibilityTime, invisibilityTime, pos, messageCallback, boardCallback);
        attachOccupantToBoard(trap);
        board.setOccupant(pos, trap);
        return trap;
    }

    // --- COMBAT & DAMAGE TESTS ---

    @Test
    public void testEnemyTakesLethalDamageAndDies() {
        Position pos = new Position(5, 5);
        Monster enemy = createMonsterAt(pos, 10, 5, 0, 3, 100);
        Player player = createDummyPlayerAt(new Position(5, 4));
        int initialExp = player.getExperience();

        // Simulate lethal attack from player
        Warrior superWarrior = new Warrior("Superman", 1000, 9999, 4, 3, new Position(5, 4), messageCallback, boardCallback);
        attachOccupantToBoard(superWarrior);
        board.setOccupant(new Position(5, 4), superWarrior);

        superWarrior.requestMove(pos); // Move into enemy triggers combat

        assertTrue(enemy.getCurrentHealth() <= 0, "Enemy should have <= 0 health after lethal damage.");
        assertNull(board.getOccupant(pos), "Dead enemy should be removed from the board (or replaced by player).");
        assertEquals(initialExp + 100, superWarrior.getExperience(), "Player should gain the enemy's experience (100).");
    }

    @Test
    public void testEnemyTakesNonLethalDamageAndDefends() {
        Position pos = new Position(5, 5);
        Monster enemy = createMonsterAt(pos, 100, 10, 9999, 3, 100);
        Warrior player = new Warrior("Weak Attacker", 100, 10, 0, 3, new Position(5, 4), messageCallback, boardCallback);
        attachOccupantToBoard(player);
        board.setOccupant(new Position(5, 4), player);

        int initialEnemyHp = enemy.getCurrentHealth();
        player.requestMove(pos);

        assertTrue(enemy.getCurrentHealth() > initialEnemyHp - 10, "Enemy defense roll should mitigate some or all incoming damage.");
        assertTrue(enemy.getCurrentHealth() > 0, "Enemy should still be alive.");
    }

    @Test
    public void testEnemyAttacksPlayer() {
        Position playerPos = new Position(5, 5);
        Position enemyPos = new Position(5, 6);
        Player player = createDummyPlayerAt(playerPos);
        Monster enemy = createMonsterAt(enemyPos, 100, 9999, 0, 3, 100);

        int initialPlayerHp = player.getCurrentHealth();
        enemy.requestMove(playerPos);

        assertTrue(player.getCurrentHealth() < initialPlayerHp, "Player should take damage when attacked by an enemy.");
    }

    // --- MOVEMENT & COLLISION TESTS ---

    @Test
    public void testEnemyStepOnEmptyFloor() {
        Position startPos = new Position(1, 1);
        Position targetPos = new Position(2, 1);
        Monster enemy = createMonsterAt(startPos, 100, 10, 10, 3, 100);
        System.out.println(board.toString());
        enemy.requestMove(targetPos);
        System.out.println(board.toString());

        assertTrue(targetPos.equals(enemy.getPosition()), "Enemy should successfully move to empty floor.");
        assertEquals(enemy, board.getOccupant(targetPos), "Target cell should now contain the enemy.");
        assertNull(board.getOccupant(startPos), "Start cell should be empty.");
    }

    @Test
    public void testEnemyStepOnWall() {
        Position startPos = new Position(1, 1);
        Position wallPos = new Position(1, 0);
        Monster enemy = createMonsterAt(startPos, 100, 10, 10, 3, 100);

        enemy.requestMove(wallPos);

        assertEquals(startPos, enemy.getPosition(), "Enemy should not be able to move into a wall.");
        assertEquals(enemy, board.getOccupant(startPos), "Enemy should remain on its original cell.");
    }

    @Test
    public void testEnemyStepOnPlayer() {
        Position enemyPos = new Position(2, 2);
        Position playerPos = new Position(2, 3);
        Monster enemy = createMonsterAt(enemyPos, 100, 10, 10, 3, 100);
        Player player = createDummyPlayerAt(playerPos);

        enemy.requestMove(playerPos);

        assertEquals(enemyPos, enemy.getPosition(), "Enemy position should not change when initiating combat.");
        assertEquals(playerPos, player.getPosition(), "Player position should not change.");
    }

    @Test
    public void testEnemyStepOnAnotherMonster() {
        Position m1Pos = new Position(2, 2);
        Position m2Pos = new Position(2, 3);
        Monster m1 = createMonsterAt(m1Pos, 100, 10, 10, 3, 100);
        Monster m2 = createMonsterAt(m2Pos, 100, 10, 10, 3, 100);

        m1.requestMove(m2Pos);

        assertEquals(m1Pos, m1.getPosition(), "Monster should not be able to step on another monster.");
        assertEquals(m2Pos, m2.getPosition(), "Target monster should not move.");
    }

    @Test
    public void testEnemyStepOnTrap() {
        Position m1Pos = new Position(2, 2);
        Position trapPos = new Position(2, 3);
        Monster m1 = createMonsterAt(m1Pos, 100, 10, 10, 3, 100);
        createTrapAt(trapPos, 3, 3);

        m1.requestMove(trapPos);

        assertEquals(m1Pos, m1.getPosition(), "Monster should not be able to step on a trap.");
    }

    @Test
    public void testEnemyStepOnInvisibleTrap() {
        Position m1Pos = new Position(2, 2);
        Position trapPos = new Position(2, 3);
        Monster m1 = createMonsterAt(m1Pos, 100, 10, 10, 3, 100);
        Trap trap = createTrapAt(trapPos, 1, 5);

        trap.onGameTick();

        m1.requestMove(trapPos);

        assertEquals(m1Pos, m1.getPosition(), "Monster should not be able to step on a trap, even if it is invisible to the player.");
    }

    // --- TRAP SPECIFIC TESTS ---

    @Test
    public void testTrapVisibilityTime() {
        Trap trap = createTrapAt(new Position(5, 5), 2, 3);

        assertTrue(trap.isVisible(), "Trap should be visible initially.");
        trap.onGameTick();
        assertTrue(trap.isVisible(), "Trap should still be visible after 1 tick.");
        trap.onGameTick();
        assertFalse(trap.isVisible(), "Trap should become invisible after 'visibilityTime' (2) ticks.");
    }

    @Test
    public void testTrapInvisibilityTime() {
        Trap trap = createTrapAt(new Position(5, 5), 1, 2);

        assertTrue(trap.isVisible(), "Trap should be visible initially.");

        trap.onGameTick();
        assertFalse(trap.isVisible(), "Trap should become invisible after 1 tick of visibility.");

        trap.onGameTick();
        assertFalse(trap.isVisible(), "Trap should remain invisible for the second tick.");

        trap.onGameTick();
        assertTrue(trap.isVisible(), "Trap should become visible again after 'invisibilityTime' (2) ticks.");
    }

    // --- BOSS & MONSTER BEHAVIOR TESTS ---

    @Test
    public void testMonsterRoamingWhenPlayerNotInRange() {
        Position start = new Position(5, 5);
        Monster monster = createMonsterAt(start, 100, 10, 10, 2, 100); // Vision = 2
        createDummyPlayerAt(new Position(5, 9)); // Distance = 4 (Out of vision range)

        // The deterministic chase pattern if it were tracking the player down would be:
        Position[] deterministicChasePath = {
                new Position(5, 6),
                new Position(5, 7),
                new Position(5, 8)
        };

        boolean followedChasePathStrictly = true;
        Position currentPos = start;

        for (int i = 0; i < 3; i++) {
            monster.onGameTick();
            Position nextPos = monster.getPosition();

            // 1. Verify it only makes valid adjacent moves (Left, Right, Up, Down, or Stay)
            boolean validStep = nextPos.equals(currentPos) ||
                    nextPos.equals(new Position(currentPos.getX() - 1, currentPos.getY())) ||
                    nextPos.equals(new Position(currentPos.getX() + 1, currentPos.getY())) ||
                    nextPos.equals(new Position(currentPos.getX(), currentPos.getY() - 1)) ||
                    nextPos.equals(new Position(currentPos.getX(), currentPos.getY() + 1));

            assertTrue(validStep, "Monster made an illegal move outside of adjacent/stay cells during roaming. was: "
                    + currentPos.getX() + "," + currentPos.getY() + " now: " + nextPos.getX() + "," + nextPos.getY());

            // 2. Track if it is strictly mimicking the chase sequence
            if (!nextPos.equals(deterministicChasePath[i])) {
                followedChasePathStrictly = false;
            }

            currentPos = nextPos;
        }

        // 3. Assert that it did NOT follow the exact chase path across these 3 ticks
        assertFalse(followedChasePathStrictly,
                "Monster should be roaming randomly, but it followed the deterministic chase path straight towards the player.");
    }

    @Test
    public void testMonsterChasingWhenPlayerInRange() {
        Position start = new Position(5, 5);
        Monster monster = createMonsterAt(start, 100, 10, 10, 6, 100);
        createDummyPlayerAt(new Position(5, 9));

        Position[] expectedChasePattern = {
                new Position(5, 6),
                new Position(5, 7),
                new Position(5, 8)
        };

        for (int i = 0; i < expectedChasePattern.length; i++) {
            monster.onGameTick();

            assertTrue(expectedChasePattern[i].equals(monster.getPosition()),
                    "Monster should strictly follow the expected chasing movement pattern. Failed at tick: " + i +
                            " | Expected: " + expectedChasePattern[i].getX() + "," + expectedChasePattern[i].getY() +
                            " but was: " + monster.getPosition().getX() + "," + monster.getPosition().getY());
        }
    }

    @Test
    public void testBossRoaming() {
        Position start = new Position(5, 5);
        Boss boss = createBossAt(start, 1000, 50, 50, 3, 500, 3);
        createDummyPlayerAt(new Position(10, 10)); // Far away

        boss.onGameTick();

        assertEquals(0, boss.getCombatTicks(), "Combat ticks should reset/remain 0 when player is out of vision.");

        Position newPos = boss.getPosition();
        boolean validMove = newPos.equals(start) ||
                newPos.equals(new Position(start.getX() - 1, start.getY())) ||
                newPos.equals(new Position(start.getX() + 1, start.getY())) ||
                newPos.equals(new Position(start.getX(), start.getY() - 1)) ||
                newPos.equals(new Position(start.getX(), start.getY() + 1));

        assertTrue(validMove, "Boss should move left, right, up, down, or stay at the same place.");
    }

    @Test
    public void testBossChasing() {
        // Vision range = 15, Ability frequency = 0, with a large gap to avoid melee combat
        Boss boss = createBossAt(new Position(1, 1), 1000, 50, 50, 15, 500, 10);
        createDummyPlayerAt(new Position(6, 1));

        // The deterministic chasing pattern moving Down towards the player at (5, 12)
        Position[] expectedChasePattern = {
                new Position(2, 1),
                new Position(3, 1),
                new Position(4, 1)
        };

        for (int i = 0; i < expectedChasePattern.length; i++) {
            boss.onGameTick();
            System.out.println(board.toString());
            // Verify it strictly follows the chase pattern step-by-step without engaging the player
            assertTrue(expectedChasePattern[i].equals(boss.getPosition()),
                    "Boss should strictly follow the expected chasing movement pattern. failed at round: " + i + "====" +
                            expectedChasePattern[i].getX() + "," + expectedChasePattern[i].getY() + " // " + boss.getPosition().getX() + "," + boss.getPosition().getY());
        }
    }

    @Test
    public void testBossAbilityCastingCycleDuration() {
        int abilityFreq = 3; // Total chase duration before casting
        Boss boss = createBossAt(new Position(5, 5), 1000, 50, 50, 12, 500, abilityFreq);
        Player player = createDummyPlayerAt(new Position(5, 14)); // Safely within vision but out of melee range

        int initialPlayerHp = player.getCurrentHealth();

        // 1. Run for exactly 'abilityFreq' ticks (the entire preparation/chase duration)
        for (int i = 1; i <= abilityFreq; i++) {
            boss.onGameTick();

            // Code should increment ticks and NOT damage the player yet
            assertEquals(i, boss.getCombatTicks(), "Combat ticks should steadily increment during the chase duration.");
            assertEquals(initialPlayerHp, player.getCurrentHealth(), "Player should not take ability damage before the casting tick.");
        }

        // 2. Run the (abilityFreq + 1)-th tick where the cast must execute and stop/reset
        boss.onGameTick();

        assertEquals(0, boss.getCombatTicks(), "Combat ticks should reset to 0 immediately after casting.");
        assertTrue(player.getCurrentHealth() < initialPlayerHp, "Player should take damage from Shoebodybop on the final casting tick.");
    }

    // --- ADDITIONAL RELEVANT TESTS ---

    @Test
    public void testMonsterDoesNotChaseWhenExactlyAtVisionRangeBoundary() {
        Position start = new Position(5, 5);
        Monster monster = createMonsterAt(start, 100, 10, 10, 3, 100);
        Player player = createDummyPlayerAt(new Position(8, 5));

        // The deterministic chasing pattern towards (8,5) would be moving Right 3 times
        Position[] expectedChasePattern = {
                new Position(6, 5),
                new Position(7, 5),
                new Position(8, 5)
        };

        boolean strictlyFollowedChasePattern = true;

        for (int i = 0; i < 3; i++) {
            monster.onGameTick();
            if (!monster.getPosition().equals(expectedChasePattern[i])) {
                strictlyFollowedChasePattern = false;
            }
        }

        assertFalse(strictlyFollowedChasePattern, "Monster should not chase, it should not repeat the specific chasing movement pattern.");
    }

    @Test
    public void testTrapAttacksPlayerWhenInRange() {
        Position trapPos = new Position(5, 5);
        Trap trap = createTrapAt(trapPos, 5, 5);
        Player player = createDummyPlayerAt(new Position(5, 6), 0);

        int initialPlayerHp = player.getCurrentHealth();
        trap.onGameTick();

        assertTrue(player.getCurrentHealth() < initialPlayerHp, "Trap should damage player if distance < 2 on its turn.");
    }
}