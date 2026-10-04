const WORKOUT_PROGRAM = {
    1: [
        { id: 'd1_1', name: 'Приседания со штангой на спине', target: 'Квадрицепсы', rest: '2–3 мин', setsCount: 4 },
        { id: 'd1_2', name: 'Жим штанги лежа на горизонт. скамье', target: 'Грудь', rest: '2–3 мин', setsCount: 4 },
        { id: 'd1_3', name: 'Подтягивания широким хватом (или тяга блока)', target: 'Спина', rest: '2–3 мин', setsCount: 4 },
        { id: 'd1_4', name: 'Румынская тяга со штангой / гантелями', target: 'Бицепс бедра', rest: '2–3 мин', setsCount: 3 },
        { id: 'd1_5', name: 'Жим гантелей сидя (или армейский жим)', target: 'Плечи', rest: '2 мин', setsCount: 3 },
        { id: 'd1_6', name: 'Махи гантелями через стороны стоя', target: 'Средняя дельта', rest: '60–90 сек', setsCount: 3 },
        { id: 'd1_7', name: 'Сгибания рук со штангой / гантелями', target: 'Бицепс', rest: '60–90 сек', setsCount: 3 },
        { id: 'd1_8', name: 'Разгибания рук на верхнем блоке', target: 'Трицепс', rest: '60–90 сек', setsCount: 3 },
        { id: 'd1_9', name: 'Подъем ног в висе (или скручивания)', target: 'Пресс', rest: '60 сек', setsCount: 3 }
    ],
    2: [
        { id: 'd2_1', name: 'Жим ногами / Болгарские приседания', target: 'Квадрицепсы', rest: '2–3 мин', setsCount: 4 },
        { id: 'd2_2', name: 'Тяга штанги в наклоне (или тяга блока)', target: 'Спина', rest: '2–3 мин', setsCount: 4 },
        { id: 'd2_3', name: 'Жим гантелей на скамье под углом 30°', target: 'Верх груди', rest: '2 мин', setsCount: 4 },
        { id: 'd2_4', name: 'Сгибания ног в тренажере', target: 'Бицепс бедра', rest: '60–90 сек', setsCount: 3 },
        { id: 'd2_5', name: 'Махи гантелями в наклоне (Задняя дельта)', target: 'Задняя дельта', rest: '60–90 сек', setsCount: 3 },
        { id: 'd2_6', name: 'Подъемы на носки стоя в тренажере', target: 'Икры', rest: '60 сек', setsCount: 4 },
        { id: 'd2_7', name: 'Отжимания на брусьях / Французский жим', target: 'Трицепс', rest: '60–90 сек', setsCount: 3 },
        { id: 'd2_8', name: 'Сгибания рук «Молот» с гантелями', target: 'Бицепс', rest: '60–90 сек', setsCount: 3 },
        { id: 'd2_9', name: 'Скручивания на блоке («Молитва») / Планка', target: 'Пресс / Кора', rest: '60 сек', setsCount: 3 }
    ]
};

let currentDay = 1;
let activeSets = JSON.parse(localStorage.getItem('fullbody_active_sets_v2')) || {};
let historyData = JSON.parse(localStorage.getItem('fullbody_history_v2')) || [];

function saveState() {
    localStorage.setItem('fullbody_active_sets_v2', JSON.stringify(activeSets));
    localStorage.setItem('fullbody_history_v2', JSON.stringify(historyData));
}

function switchTab(tab) {
    document.getElementById('tab-workout').classList.toggle('active', tab === 'workout');
    document.getElementById('tab-history').classList.toggle('active', tab === 'history');
    document.getElementById('view-workout').classList.toggle('active', tab === 'workout');
    document.getElementById('view-history').classList.toggle('active', tab === 'history');
    if (tab === 'history') renderHistory();
}

function switchDay(day) {
    currentDay = day;
    document.getElementById('btn-day1').classList.toggle('active', day === 1);
    document.getElementById('btn-day2').classList.toggle('active', day === 2);
    renderWorkout();
}

function handleInput(exId, setIdx, field, value) {
    const key = `${exId}_s${setIdx}`;
    if (!activeSets[key]) activeSets[key] = { weight: '', reps: '', done: false };
    activeSets[key][field] = value;
    saveState();
}

function toggleSetDone(exId, setIdx) {
    const key = `${exId}_s${setIdx}`;
    if (!activeSets[key]) activeSets[key] = { weight: '', reps: '', done: false };
    activeSets[key].done = !activeSets[key].done;
    saveState();
    renderWorkout();
}

function resetCurrentDay() {
    const exercises = WORKOUT_PROGRAM[currentDay];
    exercises.forEach(ex => {
        for (let s = 1; s <= ex.setsCount; s++) {
            delete activeSets[`${ex.id}_s${s}`];
        }
    });
    saveState();
    renderWorkout();
}

function renderWorkout() {
    const container = document.getElementById('exercise-list');
    const exercises = WORKOUT_PROGRAM[currentDay];
    container.innerHTML = '';

    let totalSets = 0;
    let completedSets = 0;

    exercises.forEach((ex, exIndex) => {
        totalSets += ex.setsCount;
        let exCompletedCount = 0;

        const setRowsHTML = [];
        for (let s = 1; s <= ex.setsCount; s++) {
            const setKey = `${ex.id}_s${s}`;
            const setData = activeSets[setKey] || { weight: '', reps: '', done: false };
            if (setData.done) {
                completedSets++;
                exCompletedCount++;
            }

            setRowsHTML.push(`
                <div class="set-row">
                    <span class="set-num">Сет ${s}</span>
                    <div class="input-group">
                        <input type="number" placeholder="кг" value="${setData.weight}" onchange="handleInput('${ex.id}', ${s}, 'weight', this.value)">
                    </div>
                    <div class="input-group">
                        <input type="number" placeholder="повторы" value="${setData.reps}" onchange="handleInput('${ex.id}', ${s}, 'reps', this.value)">
                    </div>
                    <div class="set-checkbox ${setData.done ? 'checked' : ''}" onclick="toggleSetDone('${ex.id}', ${s})"></div>
                </div>
            `);
        }

        const isExFullyDone = exCompletedCount === ex.setsCount;

        const card = document.createElement('div');
        card.className = `exercise-card ${isExFullyDone ? 'completed' : ''}`;
        card.innerHTML = `
            <div class="exercise-header">
                <div>
                    <div class="exercise-title">${exIndex + 1}. ${ex.name}</div>
                    <div class="exercise-tags">
                        <span class="tag">${ex.target}</span>
                        <span class="tag tag-rest">Отдых: ${ex.rest}</span>
                    </div>
                </div>
            </div>
            <div class="sets-table">
                ${setRowsHTML.join('')}
            </div>
        `;
        container.appendChild(card);
    });

    const percent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
    document.getElementById('progress-text').innerText = `Прогресс: ${percent}% (${completedSets}/${totalSets} подх.)`;
    document.getElementById('progress-bar').style.width = `${percent}%`;
}

function finishWorkout() {
    const exercises = WORKOUT_PROGRAM[currentDay];
    const sessionEntries = [];

    exercises.forEach(ex => {
        for (let s = 1; s <= ex.setsCount; s++) {
            const setKey = `${ex.id}_s${s}`;
            const setData = activeSets[setKey];
            if (setData && (setData.done || setData.weight || setData.reps)) {
                sessionEntries.push({
                    exercise: ex.name,
                    set: s,
                    weight: setData.weight || 0,
                    reps: setData.reps || 0,
                    done: setData.done
                });
            }
        }
    });

    if (sessionEntries.length === 0) {
        alert('Заполните хотя бы один подход перед завершением!');
        return;
    }

    const session = {
        id: Date.now(),
        date: new Date().toLocaleString('ru-RU'),
        dayName: `День ${currentDay}`,
        entries: sessionEntries
    };

    historyData.unshift(session);
    resetCurrentDay();
    saveState();
    switchTab('history');
}

function renderHistory() {
    const container = document.getElementById('history-list');
    container.innerHTML = '';

    if (historyData.length === 0) {
        container.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding:20px;">История тренировок пуста</div>';
        return;
    }

    historyData.forEach(session => {
        const card = document.createElement('div');
        card.className = 'history-card';

        const entriesHTML = session.entries.map(e => `
            <div class="history-exercise">
                • ${e.exercise} [Сет ${e.set}]: ${e.weight} кг × ${e.reps} повторов ${e.done ? '✓' : ''}
            </div>
        `).join('');

        card.innerHTML = `
            <div class="history-date">${session.date} — ${session.dayName}</div>
            ${entriesHTML}
        `;
        container.appendChild(card);
    });
}

function clearAllHistory() {
    if (confirm('Очистить всю историю прошлых тренировок?')) {
        historyData = [];
        saveState();
        renderHistory();
    }
}

function exportCSV() {
    if (historyData.length === 0) return alert('История пуста!');
    let csv = 'Дата;День;Упражнение;Подход;Вес (кг);Повторы\n';
    historyData.forEach(s => {
        s.entries.forEach(e => {
            csv += `"${s.date}";"${s.dayName}";"${e.exercise}";${e.set};${e.weight};${e.reps}\n`;
        });
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `workout_history_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
}

function exportJSON() {
    if (historyData.length === 0) return alert('История пуста!');
    const blob = new Blob([JSON.stringify(historyData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `workout_history_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
}

renderWorkout();
