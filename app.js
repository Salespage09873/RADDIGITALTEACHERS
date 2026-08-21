// Configuração do Google Sheets - URL pública CSV
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQmSAl1ndXXSgDWbrjCiSDkmtECkP94Rr2nk-kIHV-zHd4NFSE9CzyQb6YP2Rt4lEQNYOpuvgjCYDal/pub?output=csv';

// Cores para cada professor (cores vibrantes e distintas)
const TEACHER_COLORS = {
    'MYCAEL': '#FF6B6B',
    'RAFAEL': '#4ECDC4',
    'HOPE': '#FFE66D',
    'TA': '#95E1D3',
    'PEDRO': '#F38181',
    'DIOGO': '#AA96DA',
    'LIVIA': '#FCBAD3',
    'TOSCA': '#A8D8EA',
    'CANCELLED': '#CCCCCC',
    '/': '#EEEEEE'
};

// Dias da semana em português
const DAYS_MAP = {
    'Mon 17TH': 'Segunda',
    'Tue 18TH': 'Terça',
    'Wed 19TH': 'Quarta',
    'Thu 20TH': 'Quinta',
    'Fri 21ST': 'Sexta'
};

let scheduleData = [];
let teachers = new Set();
let selectedTeacher = null;
let teachersArray = [];

// Elementos do DOM
const teacherSelectionView = document.getElementById('teacher-selection');
const scheduleView = document.getElementById('schedule-view');
const teacherGrid = document.getElementById('teacher-grid');
const teacherNameEl = document.getElementById('teacher-name');
const teacherColorIndicator = document.getElementById('teacher-color-indicator');
const scheduleBody = document.getElementById('schedule-body');
const currentWeekEl = document.getElementById('current-week');
const legendContent = document.getElementById('legend-content');
const backBtn = document.getElementById('back-btn');
const loadingEl = document.getElementById('loading');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadSchedule();
});

// Função para parsear CSV
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const result = [];
    
    if (lines.length === 0) return result;
    
    // Cabeçalho
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    for (let i = 1; i < lines.length; i++) {
        const values = [];
        let inQuotes = false;
        let currentValue = '';
        
        for (let char of lines[i]) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(currentValue.trim().replace(/^"|"$/g, ''));
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        values.push(currentValue.trim().replace(/^"|"$/g, ''));
        
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        result.push(row);
    }
    
    return result;
}

// Carregar dados do Google Sheets
async function loadSchedule() {
    try {
        const response = await fetch(SHEET_CSV_URL);
        const csvText = await response.text();
        scheduleData = parseCSV(csvText);
        
        // Extrair todos os professores únicos
        scheduleData.forEach(row => {
            Object.keys(DAYS_MAP).forEach(dayKey => {
                const teacher = row[dayKey]?.trim() || '';
                if (teacher && teacher !== 'CANCELLED' && teacher !== '/' && teacher !== '') {
                    teachers.add(teacher);
                }
            });
        });
        
        renderTeacherCards();
        updateSchedule();
    } catch (error) {
        console.error('Erro ao carregar cronograma:', error);
        document.getElementById('schedule-body').innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    Erro ao carregar dados. Verifique sua conexão com a internet.
                </td>
            </tr>
        `;
    }
}

// Renderizar cards dos professores
function renderTeacherCards() {
    teacherGrid.innerHTML = '';
    teachersArray = Array.from(teachers);
    
    if (teachersArray.length === 0) {
        teacherGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #667eea;">Nenhum professor encontrado no cronograma.</p>';
        return;
    }
    
    teachersArray.forEach(teacher => {
        const card = document.createElement('div');
        card.className = 'teacher-card';
        const color = TEACHER_COLORS[teacher] || getRandomColor();
        card.style.backgroundColor = color;
        card.textContent = teacher;
        card.onclick = () => showTeacherSchedule(teacher);
        teacherGrid.appendChild(card);
    });
}

// Atualizar tabela de horários
function updateSchedule() {
    if (!selectedTeacher) {
        renderFullSchedule();
    } else {
        renderTeacherSchedule(selectedTeacher);
    }
}

// Renderizar cronograma completo
function renderFullSchedule() {
    scheduleBody.innerHTML = '';
    
    scheduleData.forEach(row => {
        const timeSlot = row['⌚'] || row['Horario'] || '';
        if (!timeSlot) return;
        
        const tr = document.createElement('tr');
        
        // Horário
        const timeCell = document.createElement('td');
        timeCell.className = 'time-slot';
        timeCell.textContent = timeSlot;
        tr.appendChild(timeCell);
        
        // Dias da semana
        Object.keys(DAYS_MAP).forEach(dayKey => {
            const cell = document.createElement('td');
            const teacher = row[dayKey]?.trim() || '';
            
            if (teacher && teacher !== 'CANCELLED' && teacher !== '/') {
                const group = row['Group'] || '';
                const room = row['Room'] || '';
                
                cell.className = 'class-cell';
                const color = TEACHER_COLORS[teacher] || '#667eea';
                cell.style.backgroundColor = color;
                cell.innerHTML = `
                    <div class="subject">${group}</div>
                    <div class="teacher">${teacher}</div>
                    <div class="room">${room}</div>
                `;
            } else if (teacher === 'CANCELLED') {
                cell.className = 'empty-cell';
                cell.textContent = 'CANCELLED';
                cell.style.backgroundColor = '#CCCCCC';
            } else {
                cell.className = 'empty-cell';
                cell.textContent = '-';
            }
            
            tr.appendChild(cell);
        });
        
        scheduleBody.appendChild(tr);
    });
}

// Renderizar cronograma de um professor específico
function renderTeacherSchedule(teacherName) {
    scheduleBody.innerHTML = '';
    
    scheduleData.forEach(row => {
        const timeSlot = row['⌚'] || row['Horario'] || '';
        if (!timeSlot) return;
        
        const tr = document.createElement('tr');
        
        // Horário
        const timeCell = document.createElement('td');
        timeCell.className = 'time-slot';
        timeCell.textContent = timeSlot;
        tr.appendChild(timeCell);
        
        // Dias da semana
        Object.keys(DAYS_MAP).forEach(dayKey => {
            const cell = document.createElement('td');
            const teacher = row[dayKey]?.trim() || '';
            
            if (teacher === teacherName) {
                const group = row['Group'] || '';
                const room = row['Room'] || '';
                
                cell.className = 'class-cell';
                const color = TEACHER_COLORS[teacherName] || '#667eea';
                cell.style.backgroundColor = color;
                cell.innerHTML = `
                    <div class="subject">${group}</div>
                    <div class="teacher">${teacherName}</div>
                    <div class="room">${room}</div>
                `;
            } else {
                cell.className = 'empty-cell';
                cell.textContent = '-';
            }
            
            tr.appendChild(cell);
        });
        
        scheduleBody.appendChild(tr);
    });
}

// Mostrar cronograma do professor
function showTeacherSchedule(teacherName) {
    selectedTeacher = teacherName;
    const color = TEACHER_COLORS[teacherName] || '#667eea';
    
    teacherNameEl.textContent = teacherName;
    teacherNameEl.style.color = color;
    teacherColorIndicator.style.backgroundColor = color;
    
    // Atualizar informação da semana
    const weekInfo = getWeekInfo();
    currentWeekEl.textContent = `Semana de ${weekInfo.start} a ${weekInfo.end}`;
    
    // Renderizar tabela de horários
    renderTeacherSchedule(teacherName);
    
    // Renderizar legenda
    renderLegend();
    
    // Trocar visualização
    teacherSelectionView.classList.add('hidden');
    scheduleView.classList.remove('hidden');
}

// Renderizar legenda
function renderLegend() {
    legendContent.innerHTML = '';
    
    teachersArray.forEach(teacher => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        const color = TEACHER_COLORS[teacher] || '#667eea';
        item.innerHTML = `
            <div class="legend-color" style="background-color: ${color}"></div>
            <span class="legend-name">${teacher}</span>
        `;
        legendContent.appendChild(item);
    });
}

// Gerar cor aleatória
function getRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
                    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Obter informações da semana atual
function getWeekInfo() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    
    const startOfWeek = new Date(now.setDate(diff));
    const endOfWeek = new Date(now.setDate(diff + 5));
    
    const options = { day: '2-digit', month: '2-digit' };
    return {
        start: startOfWeek.toLocaleDateString('pt-BR', options),
        end: endOfWeek.toLocaleDateString('pt-BR', options)
    };
}

// Voltar para seleção
backBtn.addEventListener('click', () => {
    selectedTeacher = null;
    scheduleView.classList.add('hidden');
    teacherSelectionView.classList.remove('hidden');
});

// Mostrar/ocultar loading
function showLoading(show) {
    if (show) {
        loadingEl.classList.remove('hidden');
        teacherSelectionView.classList.add('hidden');
        scheduleView.classList.add('hidden');
    } else {
        loadingEl.classList.add('hidden');
    }
}
