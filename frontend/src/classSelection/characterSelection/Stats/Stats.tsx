import React from 'react';
import {
    BarBackground,
    BarFill,
    Container,
    StatLabel,
    StatRow,
    StringValue,
} from './StatsStyles';

const STAT_MAX_VALUES: Record<string, number> = {
    health: 450,
    defense: 10,
    attack: 50,
    cooldown: 10,
    manaPool: 400,
    manacost: 50,
    spellpower: 20,
    hitcount: 5,
    range: 7,
    cost: 50,
};

const DEFAULT_MAX_STAT = 100;

interface Props {
    data: Record<string, string | number>;
}

const Stats: React.FC<Props> = ({ data }) => {
    return (
        <Container>
            {Object.entries(data).map(([key, value]) => {
                if (typeof value === 'undefined') return null;

                const statKey = key.toLowerCase();
                const maxVal = STAT_MAX_VALUES[statKey] ?? DEFAULT_MAX_STAT;

                return (
                    <StatRow key={key}>
                        <StatLabel>{key}</StatLabel>

                        {typeof value === 'string' && (
                            <StringValue>{value}</StringValue>
                        )}

                        {typeof value === 'number' && (
                            <BarBackground>
                                <BarFill
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${(Math.min(Math.max(value, 0), maxVal) / maxVal) * 100}%`,
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        ease: 'easeOut',
                                        delay: 0.2,
                                    }}
                                />
                            </BarBackground>
                        )}
                    </StatRow>
                );
            })}
        </Container>
    );
};

export default Stats;