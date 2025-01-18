import './App.css';

import React, {useState, useEffect} from 'react';
const CharacterSheet = () => {
    const [name, setName] = useState('');
    const [backpack, setBackpack] = useState([]);
    // prettier-ignore
    const [specialItems, setSpecialItems] = useState({
        'Portalring': false,
        'Silberner Kompass': false,
        'Kristallfläschchen leer': false,
        'Kristallfläschchen gefüllt': false,
        'Ring der Eule': false,
        'Segen der Natur': false,
    });
    const [smallItems, setSmallItems] = useState([]);
    const [healingFood, setHealingFood] = useState([]);
    const [gold, setGold] = useState(20);
    const [humanity, setHumanity] = useState(0);
    const [agility, setAgility] = useState(15);
    const [healthMax, setHealthMax] = useState(60);
    const [healthCurrent, setHealthCurrent] = useState(60);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [activeEquipment, setActiveEquipment] = useState({
        items: {
            weapon: {title: 'Waffe', name: 'Hände', damage: 2, armor: 0},
            shield: {title: 'Schild', name: '', damage: 0, armor: 0},
            body: {title: 'Körper', name: '', damage: 0, armor: 0},
            head: {title: 'Kopf', name: '', damage: 0, armor: 0},
            hands: {title: 'Hände', name: '', damage: 0, armor: 0},
            ring1: {title: 'Ring 1', name: '', damage: 0, armor: 0},
            ring2: {title: 'Ring 2', name: '', damage: 0, armor: 0},
            amulet: {title: 'Amulet', name: '', damage: 0, armor: 0},
        },
        additionalSlots: Array(5).fill({name: '', damage: 0, armor: 0}),
        skillEffects: {damage: 0, armor: 0},
    });

    const [diceResult, setDiceResult] = useState([]); // Zustand für die Würfelergebnisse
    const [rolling, setRolling] = useState(false); // Zustand für die Würfelanimation

    const [battleLog, setBattleLog] = useState([]); // Zustand für die Kampfprotokolle
    const [enemyHealth, setEnemyHealth] = useState(0); // Aktuelle Lebensenergie des Gegners

    const [isBattleStarted, setIsBattleStarted] = useState(false); // Zustand, um zu überprüfen, ob der Kampf begonnen hat
    const [isLastRound, setLastRound] = useState(false);

    const [battleRounds, setBattleRounds] = useState(0);

    const reset = () => {
        let promt = window.confirm(
            'Willst du wirklich alle Daten verwerfen und das Spiel neu starten?',
        );
        if (!promt) {
            return;
        }
        localStorage.removeItem('characterData');
        window.location.reload();
    };

    const endBattle = () => {
        document.getElementById('enemyFightingPower').value = '';
        document.getElementById('enemyDamage').value = '';
        document.getElementById('enemyArmor').value = '';
        document.getElementById('enemyHealth').value = '';
        setBattleLog([]); // Setze das Kampfprotokoll zurück
        setEnemyHealth(0); // Setze die Lebensenergie des Gegners zurück

        setIsBattleStarted(false); // Setze den Kampfzustand zurück
        setLastRound(false);
        document.getElementById('startBattle').innerHTML = 'Kampf!';
        setBattleRounds(0);
    };

    const startBattle = () => {
        if (isLastRound) {
            endBattle();
            return;
        }
        const enemyFightingPower = Number(
            document.getElementById('enemyFightingPower').value,
        );
        const enemyDamage = Number(
            document.getElementById('enemyDamage').value,
        );
        const enemyArmor = Number(document.getElementById('enemyArmor').value);

        let initialEnemyHealth = Number(
            document.getElementById('enemyHealth').value,
        );

        if (
            initialEnemyHealth <= 0 ||
            isNaN(enemyFightingPower) ||
            isNaN(enemyDamage) ||
            isNaN(enemyArmor)
        ) {
            return;
        }

        setEnemyHealth(initialEnemyHealth); // Setze die aktuelle Lebensenergie des Gegners

        let playerHealth = healthCurrent; // Lebensenergie des Spielers
        let currentEnemyHealth = initialEnemyHealth; // Aktuelle Lebensenergie des Gegners
        if (isBattleStarted) {
            currentEnemyHealth = enemyHealth;
        }

        let playerTotalDamage = Object.values(activeEquipment.items).reduce(
            (sum, item) => sum + item.damage,
            0,
        );
        let playerTotalArmor = Object.values(activeEquipment.items).reduce(
            (sum, item) => sum + item.armor,
            0,
        );

        let logMessages = []; // Array für die Nachrichten der Runde
        setIsBattleStarted(true); // Setze den Zustand für den Kampfbeginn
        logMessages.push();

        logMessages.push(
            `Runde ${
                battleRounds + 1
            }: Der Gegner hat ${currentEnemyHealth} / ${initialEnemyHealth} LP!`,
        );

        const playerFightingPower =
            Math.floor(Math.random() * 12) + 1 + agility;
        logMessages.push(`Du würfelst eine ${playerFightingPower - agility}!`);
        logMessages.push(`Deine Kampfkraft ist ${playerFightingPower}!`);

        if (playerFightingPower > enemyFightingPower) {
            const damage = Math.max(playerTotalDamage - enemyArmor, 0);
            let newEnemyHealth = Math.max(currentEnemyHealth - damage, 0);
            setEnemyHealth(newEnemyHealth); // Aktualisiere die Lebensenergie des Gegners
            logMessages.push(`Du hast ${damage} Schaden verursacht!`);
        } else if (playerFightingPower < enemyFightingPower) {
            const damage = Math.max(enemyDamage - playerTotalArmor, 0);
            let newPlayerHealth = Math.max(playerHealth - damage, 0);
            setHealthCurrent(newPlayerHealth);
            logMessages.push(`Der Gegner hat dir ${damage} Schaden zugefügt!`);
        } else {
            const playerDamageDealt = Math.max(
                playerTotalDamage - enemyArmor,
                0,
            );
            const enemyDamageDealt = Math.max(
                enemyDamage - playerTotalArmor,
                0,
            );
            let newPlayerHealth = Math.max(playerHealth - enemyDamageDealt, 0);
            setHealthCurrent(newPlayerHealth);
            let newEnemyHealth = Math.max(
                currentEnemyHealth - playerDamageDealt,
                0,
            );
            setEnemyHealth(newEnemyHealth); // Aktualisiere die Lebensenergie des Gegners
            logMessages.push(
                `Ihr habt euch gegenseitig ${playerDamageDealt} und ${enemyDamageDealt} Schaden zugefügt!`,
            );
        }

        if (playerHealth <= 0) {
            logMessages.push('Du hast verloren!');
            document.getElementById('startBattle').innerHTML = 'Beenden!';
            setLastRound(true);
        } else if (currentEnemyHealth <= 0) {
            logMessages.push('Du hast gewonnen!');
            document.getElementById('startBattle').innerHTML = 'Beenden!';
            setLastRound(true);
        } else {
            document.getElementById('startBattle').innerHTML = 'Nächste Runde!';
            setBattleRounds(battleRounds + 1);
        }

        setBattleLog(() => [...logMessages]); // Protokolle aktualisieren
    };

    useEffect(() => {
        const savedData = localStorage.getItem('characterData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setName(parsedData.name || '');
            setBackpack(parsedData.backpack || []);
            setSpecialItems(
                parsedData.specialItems || {
                    Portalring: false,
                    'Silberner Kompass': false,
                    'Kristallfläschchen leer': false,
                    'Kristallfläschchen gefüllt': false,
                    'Ring der Eule': false,
                    'Segen der Natur': false,
                },
            );
            setSmallItems(parsedData.smallItems || []);
            setHealingFood(parsedData.healingFood || []);
            setGold(parsedData.gold || 20);
            setHumanity(parsedData.humanity || 0);
            setAgility(parsedData.agility || 15);
            setHealthMax(parsedData.healthMax || 60);
            setHealthCurrent(parsedData.healthCurrent || 60);
            setActiveEquipment(parsedData.activeEquipment || activeEquipment);
        }
        setIsDataLoaded(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const saveToLocalStorage = () => {
        const dataToSave = {
            name,
            backpack,
            specialItems,
            smallItems,
            healingFood,
            gold,
            humanity,
            agility,
            healthMax,
            healthCurrent,
            activeEquipment,
        };
        localStorage.setItem('characterData', JSON.stringify(dataToSave));
    };
    useEffect(() => {
        if (isDataLoaded) {
            saveToLocalStorage();
            if (healthCurrent <= 0) {
                alert('Du bist tot!');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        name,
        backpack,
        specialItems,
        smallItems,
        healingFood,
        gold,
        humanity,
        agility,
        healthMax,
        healthCurrent,
        activeEquipment,
        isDataLoaded,
    ]);
    const addItemToBackpack = (itemName, itemEffect) => {
        if (backpack.length < 6 && itemName) {
            const newItem = {name: itemName, effect: itemEffect};
            setBackpack((prevBackpack) => [...prevBackpack, newItem]);
        }
    };
    const removeItemFromBackpack = (item) => {
        setBackpack((prevBackpack) =>
            prevBackpack.filter((i) => i.name !== item.name),
        );
    };
    const addItemToSmallItems = (itemName, itemEffect) => {
        const newItem = {name: itemName, effect: itemEffect};
        setSmallItems((prevItems) => [...prevItems, newItem]);
    };
    const removeItemFromSmallItems = (item) => {
        setSmallItems((prevItems) =>
            prevItems.filter((i) => i.name !== item.name),
        );
    };
    const addItemToHealingFood = (itemName, itemEffect) => {
        const newItem = {name: itemName, effect: itemEffect};
        setHealingFood((prevItems) => [...prevItems, newItem]);
    };
    const removeItemFromHealingFood = (item) => {
        setHealingFood((prevItems) =>
            prevItems.filter((i) => i.name !== item.name),
        );
    };
    const handleEquipmentChange = (type, title, name, damage, armor) => {
        setActiveEquipment((prevEquipment) => ({
            ...prevEquipment,
            items: {
                ...prevEquipment.items,
                [type]: {title, name, damage, armor},
            },
        }));
    };
    const handleAdditionalSlotChange = (index, name, damage, armor) => {
        const newSlots = [...activeEquipment.additionalSlots];
        newSlots[index] = {name, damage, armor};
        setActiveEquipment((prevEquipment) => ({
            ...prevEquipment,
            additionalSlots: newSlots,
        }));
    };
    const handleSpecialItemChange = (name, value) => {
        setSpecialItems((prevItems) => ({
            ...prevItems,
            [name]: value,
        }));
    };
    const handleSkillEffectChange = (value) => {
        setActiveEquipment((prevEquipment) => ({
            ...prevEquipment,
            skillEffects: value,
        }));
    };
    const increaseHealth = (amount) => {
        setHealthCurrent((prev) => Math.min(prev + amount, healthMax));
    };
    const decreaseHealth = (amount) => {
        setHealthCurrent((prev) => Math.max(prev - amount, 0));
    };
    const rollDice = () => {
        setRolling(true); // Beginne die Animation
        let intervalId;
        let displayValue1 = 1;
        let displayValue2 = 1;

        // Schnelle Zufallswerte anzeigen
        intervalId = setInterval(() => {
            displayValue1 = Math.floor(Math.random() * 6) + 1; // Zufallswert für die erste Würfel
            displayValue2 = Math.floor(Math.random() * 6) + 1; // Zufallswert für die zweite Würfel
            setDiceResult([displayValue1, displayValue2]); // Setze die angezeigten Werte
        }, 100); // Schnelle Aktualisierung alle 100 ms

        // Langsame Werte setzen und dann die endgültigen Werte anzeigen
        setTimeout(() => {
            clearInterval(intervalId); // Stoppe die schnelle Anzeige
            let slowDownInterval = 0;

            // Langsame Werte setzen
            const slowIntervalId = setInterval(() => {
                if (slowDownInterval < 5) {
                    // Langsame Animation für 5 Schritte
                    displayValue1 = Math.floor(Math.random() * 6) + 1;
                    displayValue2 = Math.floor(Math.random() * 6) + 1;
                    setDiceResult([displayValue1, displayValue2]);
                    slowDownInterval++;
                } else {
                    clearInterval(slowIntervalId); // Stoppe die langsame Animation
                    const die1 = Math.floor(Math.random() * 6) + 1; // Würfle die erste 6-seitige Würfel
                    const die2 = Math.floor(Math.random() * 6) + 1; // Würfle die zweite 6-seitige Würfel
                    setDiceResult([die1, die2]); // Setze die endgültigen Ergebnisse
                    setRolling(false); // Beende die Animation
                }
            }, 500); // Langsame Aktualisierung alle 500 ms
        }, 2000); // Warte 2 Sekunden für die schnelle Animation
    };
    // Funktion zur Umwandlung der Zahl in die entsprechende HTML-Entity
    const getDiceEntity = (value) => {
        switch (value) {
            case 1:
                return '⚀'; // ⚀
            case 2:
                return '⚁'; // ⚁
            case 3:
                return '⚂'; // ⚂
            case 4:
                return '⚃'; // ⚃
            case 5:
                return '⚄'; // ⚄
            case 6:
                return '⚅'; // ⚅
            default:
                return ''; // Fallback
        }
    };
    let playerTotalDamage = Object.values(activeEquipment.items).reduce(
        (sum, item) => sum + item.damage,
        0,
    );
    let playerTotalArmor = Object.values(activeEquipment.items).reduce(
        (sum, item) => sum + item.armor,
        0,
    );
    return (
        <div id='CharacterSheet'>
            <h1>Charakterbogen</h1>
            <div>
                <h2>Name</h2>
                <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Charaktername'
                />
            </div>
            <div>
                <h2>Rucksack</h2>
                <table className='tbl baseline'>
                    <tbody>
                        {backpack.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    {item.name} ({item.effect}){' '}
                                </td>
                                <td style={{width: '40px'}}>
                                    <button
                                        className='square'
                                        onClick={() =>
                                            removeItemFromBackpack(item)
                                        }
                                    >
                                        ×
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <table className='tbl'>
                    <tbody>
                        <tr>
                            <td>
                                <input
                                    type='text'
                                    placeholder='Gegenstand hinzufügen'
                                    id='itemName'
                                />
                            </td>
                            <td>
                                <input
                                    type='text'
                                    placeholder='Effekt/Wert hinzufügen'
                                    id='itemEffect'
                                />
                            </td>
                            <td>
                                <button
                                    className='square'
                                    onClick={() => {
                                        const itemName =
                                            document.getElementById(
                                                'itemName',
                                            ).value;
                                        const itemEffect =
                                            document.getElementById(
                                                'itemEffect',
                                            ).value;
                                        addItemToBackpack(itemName, itemEffect);
                                        document.getElementById(
                                            'itemName',
                                        ).value = '';
                                        document.getElementById(
                                            'itemEffect',
                                        ).value = '';
                                    }}
                                >
                                    +
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <h3>Spezial Items</h3>
                <table className='tbl baseline'>
                    <tbody>
                        {Object.entries(specialItems).map(([name, active]) => (
                            <tr key={name}>
                                <td>{name}</td>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={active}
                                        onChange={(e) =>
                                            handleSpecialItemChange(
                                                name,
                                                e.target.checked,
                                            )
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h3>Kleingegenstände</h3>
                <table className='tbl baseline'>
                    <tbody>
                        {smallItems.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    {item.name} ({item.effect}){' '}
                                </td>
                                <td style={{width: '40px'}}>
                                    <button
                                        className='square'
                                        onClick={() =>
                                            removeItemFromSmallItems(item)
                                        }
                                    >
                                        ×
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <table className='tbl'>
                    <tbody>
                        <tr>
                            <td>
                                <input
                                    type='text'
                                    placeholder='Gegenstand hinzufügen'
                                    id='smallItemName'
                                />
                            </td>
                            <td>
                                <button
                                    className='square'
                                    onClick={() => {
                                        const smallItemName =
                                            document.getElementById(
                                                'smallItemName',
                                            ).value;

                                        addItemToSmallItems(smallItemName);
                                        document.getElementById(
                                            'smallItemName',
                                        ).value = '';
                                    }}
                                >
                                    +
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <h3>Heilgegenstände</h3>
                <table className='tbl baseline'>
                    <tbody>
                        {healingFood.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    {item.name} ({item.effect}){' '}
                                </td>
                                <td style={{width: '40px'}}>
                                    <button
                                        className='square'
                                        onClick={() =>
                                            removeItemFromHealingFood(item)
                                        }
                                    >
                                        ×
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <table className='tbl'>
                    <tbody>
                        <tr>
                            <td>
                                <input
                                    type='text'
                                    placeholder='Gegenstand hinzufügen'
                                    id='healtingFoodName'
                                />
                            </td>
                            <td>
                                <input
                                    type='text'
                                    placeholder='Effekt/Wert hinzufügen'
                                    id='healtingFoodEffect'
                                />
                            </td>
                            <td>
                                <button
                                    className='square'
                                    onClick={() => {
                                        const itemName =
                                            document.getElementById(
                                                'healtingFoodName',
                                            ).value;
                                        const itemEffect =
                                            document.getElementById(
                                                'healtingFoodEffect',
                                            ).value;
                                        addItemToHealingFood(
                                            itemName,
                                            itemEffect,
                                        );
                                        document.getElementById(
                                            'healtingFoodName',
                                        ).value = '';
                                        document.getElementById(
                                            'healtingFoodEffect',
                                        ).value = '';
                                    }}
                                >
                                    +
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div>
                <h2>Aktive Ausrüstung</h2>
                <table className='tbl'>
                    <thead>
                        <tr>
                            <th>Waffe</th>
                            <th>⚔</th>
                            <th>🛡</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(activeEquipment.items).map(
                            (slot, index) => (
                                <tr key={index}>
                                    <td>
                                        {index !== 0 && (
                                            <h3>
                                                {
                                                    activeEquipment.items[slot]
                                                        .title
                                                }
                                            </h3>
                                        )}
                                        <input
                                            type='text'
                                            placeholder='Gegenstand'
                                            value={
                                                activeEquipment.items[slot].name
                                            }
                                            onChange={(e) =>
                                                handleEquipmentChange(
                                                    slot,
                                                    activeEquipment.items[slot]
                                                        .title,
                                                    e.target.value,
                                                    activeEquipment.items[slot]
                                                        .damage,
                                                    activeEquipment.items[slot]
                                                        .armor,
                                                )
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className='square'
                                            type='number'
                                            placeholder='0'
                                            value={
                                                activeEquipment.items[slot]
                                                    .damage
                                            }
                                            onChange={(e) =>
                                                handleEquipmentChange(
                                                    slot,
                                                    activeEquipment.items[slot]
                                                        .title,
                                                    activeEquipment.items[slot]
                                                        .name,
                                                    Number(e.target.value),
                                                    activeEquipment.items[slot]
                                                        .armor,
                                                )
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className='square'
                                            type='number'
                                            placeholder='0'
                                            value={
                                                activeEquipment.items[slot]
                                                    .armor
                                            }
                                            onChange={(e) =>
                                                handleEquipmentChange(
                                                    slot,
                                                    activeEquipment.items[slot]
                                                        .title,
                                                    activeEquipment.items[slot]
                                                        .name,
                                                    activeEquipment.items[slot]
                                                        .damage,
                                                    Number(e.target.value),
                                                )
                                            }
                                        />
                                    </td>
                                </tr>
                            ),
                        )}
                    </tbody>
                </table>
                <h3>Zusätzliche Plätze</h3>
                <table className='tbl'>
                    <tbody>
                        {activeEquipment.additionalSlots.map((slot, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type='text'
                                        placeholder='Gegenstand'
                                        value={slot.name}
                                        onChange={(e) =>
                                            handleAdditionalSlotChange(
                                                index,
                                                e.target.value,
                                                slot.damage,
                                                slot.armor,
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        className='square'
                                        type='number'
                                        placeholder='0'
                                        value={slot.damage}
                                        onChange={(e) =>
                                            handleAdditionalSlotChange(
                                                index,
                                                slot.name,
                                                Number(e.target.value),
                                                slot.armor,
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        className='square'
                                        type='number'
                                        placeholder='0'
                                        value={slot.armor}
                                        onChange={(e) =>
                                            handleAdditionalSlotChange(
                                                index,
                                                slot.name,
                                                slot.damage,
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <table className='tbl baseline'>
                    <tbody>
                        <tr>
                            <td>
                                <h3>Effekte aus Fertigkeiten</h3>
                            </td>

                            {Object.keys(activeEquipment.skillEffects).map(
                                (key, index) => (
                                    <td key={index}>
                                        <input
                                            className='square'
                                            type='number'
                                            value={
                                                activeEquipment.skillEffects[
                                                    key
                                                ]
                                            }
                                            onChange={(e) =>
                                                handleSkillEffectChange({
                                                    ...activeEquipment.skillEffects,
                                                    [key]: Number(
                                                        e.target.value,
                                                    ),
                                                })
                                            }
                                            placeholder={key}
                                        />
                                    </td>
                                ),
                            )}
                        </tr>
                    </tbody>
                </table>

                <h3 className='outline'>
                    Gesamter Schaden: {playerTotalDamage}
                </h3>
                <h3 className='outline'>Gesamte Rüstung: {playerTotalArmor}</h3>
            </div>
            <div>
                <h2>Gold</h2>
                <table className='tbl'>
                    <tbody>
                        <tr>
                            <td>
                                <button
                                    className='square'
                                    onClick={() => setGold(gold - 1)}
                                >
                                    -
                                </button>
                            </td>
                            <td>
                                <input
                                    style={{textAlign: 'center'}}
                                    value={gold}
                                    type='number'
                                    onChange={(e) =>
                                        setGold(Number(e.target.value))
                                    }
                                />
                            </td>
                            <td>
                                <button
                                    className='square'
                                    onClick={() => setGold(gold + 1)}
                                >
                                    +
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className='tbl'>
                    <tbody>
                        <tr>
                            <td>
                                <button
                                    className='square'
                                    onClick={() => setGold(gold - 20)}
                                >
                                    -20
                                </button>
                            </td>
                            <td>
                                <button
                                    className='square'
                                    onClick={() => setGold(gold - 10)}
                                >
                                    -10
                                </button>
                            </td>
                            <td>
                                <button
                                    className='square'
                                    onClick={() => setGold(gold - 5)}
                                >
                                    -5
                                </button>
                            </td>
                            <td>
                                <button
                                    className='square'
                                    onClick={() => setGold(gold + 5)}
                                >
                                    +5
                                </button>
                            </td>
                            <td>
                                <button
                                    className='square'
                                    onClick={() => setGold(gold + 10)}
                                >
                                    +10
                                </button>
                            </td>
                            <td>
                                <button
                                    className='square'
                                    onClick={() => setGold(gold + 20)}
                                >
                                    +20
                                </button>
                            </td>
                            <td>
                                <button
                                    className='square'
                                    onClick={() => setGold(gold + 50)}
                                >
                                    +50
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h2>Gewandheit</h2>
                <table className='tbl'>
                    <tbody>
                        <tr>
                            <td>
                                <button
                                    className='square'
                                    onClick={() => setAgility(agility - 1)}
                                >
                                    -
                                </button>
                            </td>
                            <td>
                                <input
                                    style={{textAlign: 'center'}}
                                    value={agility}
                                    type='number'
                                    onChange={(e) =>
                                        setAgility(Number(e.target.value))
                                    }
                                />
                            </td>
                            <td>
                                <button
                                    className='square'
                                    onClick={() => setAgility(agility + 1)}
                                >
                                    +
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h2>Menschlichkeit</h2>
                <input
                    type='range'
                    min='-5'
                    max='5'
                    value={humanity}
                    onChange={(e) => setHumanity(Number(e.target.value))}
                />
                <span>{humanity}</span>
            </div>

            <div>
                <h2>Lebensenergie</h2>
                <table className='tbl baseline margin-bottom'>
                    <tbody>
                        <tr>
                            <td>LP MAX:</td>
                            <td>
                                <input
                                    type='number'
                                    style={{textAlign: 'center'}}
                                    value={healthMax}
                                    onChange={(e) =>
                                        setHealthMax(Number(e.target.value))
                                    }
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className='tbl'>
                    <tbody>
                        <tr>
                            <td>
                                <button
                                    className='square'
                                    onClick={() => decreaseHealth(10)}
                                >
                                    -10
                                </button>
                            </td>
                            <td>
                                <button
                                    className='square'
                                    onClick={() => decreaseHealth(5)}
                                >
                                    -5
                                </button>
                            </td>
                            <td>
                                <button
                                    className='square'
                                    onClick={() => decreaseHealth(1)}
                                >
                                    -1
                                </button>
                            </td>
                            <td>
                                <button
                                    className='square'
                                    onClick={() => increaseHealth(1)}
                                >
                                    +1
                                </button>
                            </td>
                            <td>
                                <button
                                    className='square'
                                    onClick={() => increaseHealth(5)}
                                >
                                    +5
                                </button>
                            </td>
                            <td>
                                <button
                                    className='square'
                                    onClick={() => increaseHealth(10)}
                                >
                                    +10
                                </button>
                            </td>
                            <td>
                                <button
                                    className='square'
                                    onClick={() => increaseHealth(10000)}
                                >
                                    voll
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className='health-bar-container'>
                    <div className='health-bar'>
                        <div
                            className='health-bar-fill'
                            style={{
                                width: `${(healthCurrent / healthMax) * 100}%`,
                            }}
                        ></div>
                    </div>
                    <center>
                        {healthCurrent} / {healthMax}{' '}
                    </center>
                </div>
            </div>
            <div>
                <h2>Kampf</h2>
                <div>
                    <h3>Gegner</h3>
                    <table className='tbl'>
                        <tbody>
                            <tr>
                                <td>
                                    <label>Kampfkraft:</label>
                                    <input
                                        type='number'
                                        id='enemyFightingPower'
                                        placeholder='Kampfkraft des Gegners'
                                    />
                                </td>
                                <td>
                                    <label>Schaden:</label>
                                    <input
                                        type='number'
                                        id='enemyDamage'
                                        placeholder='Schaden des Gegners'
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Rüstung:</label>
                                    <input
                                        type='number'
                                        id='enemyArmor'
                                        placeholder='Rüstung des Gegners'
                                    />
                                </td>
                                <td>
                                    <label>Lebensenergie:</label>
                                    <input
                                        type='number'
                                        id='enemyHealth'
                                        placeholder='Lebensenergie des Gegners'
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <button id='startBattle' onClick={() => startBattle()}>
                        Kampf!
                    </button>
                </div>
                <div>
                    <h3>Kampfprotokoll</h3>
                    <textarea
                        readOnly
                        value={battleLog.join('\n')}
                        rows={6}
                        cols={30}
                    />
                </div>
            </div>
            <div>
                <div>
                    <h2>Würfelwurf</h2>
                    <button
                        className='roll-button'
                        onClick={rollDice}
                        disabled={rolling}
                    >
                        {rolling ? 'rollen...' : 'Würfleln!'}
                    </button>
                    {diceResult.length > 0 && (
                        <div
                            className={`dice-container ${
                                rolling ? 'rolling' : ''
                            }`}
                        >
                            <div className='die'>
                                {getDiceEntity(diceResult[0])}
                            </div>
                            <div className='die'>
                                {getDiceEntity(diceResult[1])}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <footer style={{padding: '10px', textAlign: 'right'}}>
                <button onClick={() => reset()}>Reset</button>
            </footer>
        </div>
    );
};
export default CharacterSheet;
