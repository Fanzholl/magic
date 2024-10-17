import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

function Stats() {
    const [stats, setStats] = useState(null);
    // const [elementHeight, setElementHeight] = useState(0);
    const [elementWidth, setElementWidth] = useState(0);
    const statsRef = useRef(null); // Создаём ref для элемента

    useEffect(() => {
        if (statsRef.current) {
            // setElementHeight(statsRef.current.clientHeight); // Получаем высоту элемента
            setElementWidth(statsRef.current.clientWidth); // Получаем высоту элемента
        }
    }, [stats]); // Обновляем высоту, когда меняются stats

    const fetchStats = useCallback(async () => {
        try {
            const response = await axios.get('https://games-test.datsteam.dev/stats/magcarp');
            const result = await response.data;

            const ourRealm = result.realms['test-endless-115'].players.filter((player) => player.player === 'Punctum')[0];
            // console.log(ourRealm);
            setStats(ourRealm);
        } catch (e) {
            console.log(e);
        }
    }, []); // No dependencies to avoid unnecessary re-renders

    useEffect(() => {
        fetchStats();

        const interval = setInterval(() => {
            fetchStats();
        }, 10000); // Fetch data every 10 seconds

        return () => clearInterval(interval); // Clear interval on component unmount
    }, [fetchStats]);

    return (
        <div className='Stats' ref={statsRef} style={{bottom: `0`, left: `calc(50% - ${elementWidth / 2}px)`}}>
            {/* calc(50% - ${elementHeight / 2}px) */}
            {stats ? (
                <>
                    <p>Команда: {stats?.player}</p>
                    <p>Монеты: {stats?.score}</p>
                    <p>Аварии: {stats.counters?.crashes}</p>
                    <p>Смерти: {stats.counters?.deaths}</p>
                    <p>Убил/Убит: {stats.counters?.kills}/{stats.counters?.killed}</p>
                    <p>Собранные монеты: {stats.counters?.collectedBounties}</p>
                    <p>Монеты за убийства: {stats.counters?.killBounties}</p>
                    <p>Потерянные монеты: {stats.counters?.lostBounties}</p>
                </>
            ) : null}
        </div>
    );
}

export default Stats;
