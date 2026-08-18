// Configuração do Google Sheets
// IMPORTANTE: Substitua estas configurações com as do seu Google Sheets
const SHEET_CONFIG = {
    // ID da sua planilha Google (encontrado na URL da planilha)
    spreadsheetId: 'SEU_SPREADSHEET_ID_AQUI',
    
    // Nome da aba onde está o cronograma
    sheetName: 'Cronograma',
    
    // API Key do Google (opcional, se a planilha for pública)
    apiKey: '' 
};

// Cores para cada professor (personalize conforme necessário)
const TEACHER_COLORS = {
    'Ana Silva': '#FF6B6B',
    'Carlos Santos': '#4ECDC4',
    'Maria Oliveira': '#45B7D1',
    'João Pereira': '#96CEB4',
    'Fernanda Costa': '#FFEAA7',
    'Pedro Almeida': '#DDA0DD',
    'Juliana Rodrigues': '#98D8C8',
    'Ricardo Ferreira': '#F7DC6F',
    'Camila Souza': '#BB8FCE',
    'André Martins': '#85C1E9'
};

// Dados de exemplo (serão substituídos pelos dados do Google Sheets)
let teachersData = [];
let scheduleData = [];

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
    loadData();
});

// Carregar dados do Google Sheets
async function loadData() {
    showLoading(true);
    
    try {
        // Tentar carregar do Google Sheets
        if (SHEET_CONFIG.spreadsheetId !== 'SEU_SPREADSHEET_ID_AQUI') {
            await loadFromGoogleSheets();
        } else {
            // Usar dados de exemplo se não estiver configurado
            loadExampleData();
        }
        
        renderTeacherSelection();
        showLoading(false);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar cronograma. Verifique as configurações do Google Sheets.');
        loadExampleData();
        renderTeacherSelection();
        showLoading(false);
    }
}

// Carregar dados do Google Sheets API
async function loadFromGoogleSheets() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_CONFIG.spreadsheetId}/values/${SHEET_CONFIG.sheetName}?key=${SHEET_CONFIG.apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Falha ao carregar dados do Google Sheets');
    }
    
    const data = await response.json();
    parseSheetData(data.values);
}

// Analisar dados da planilha
function parseSheetData(rows) {
    if (!rows || rows.length === 0) {
        loadExampleData();
        return;
    }
    
    // Estrutura esperada da planilha:
    // Coluna A: Horário
    // Coluna B: Segunda-feira
    // Coluna C: Terça-feira
    // Coluna D: Quarta-feira
    // Coluna E: Quinta-feira
    // Coluna F: Sexta-feira
    // Coluna G: Sábado
    
    const days = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    scheduleData = [];
    const teachersSet = new Set();
    
    // Pular cabeçalho (linha 0)
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row[0]) continue; // Pular linhas vazias
        
        const timeSlot = row[0];
        const rowSchedule = {};
        
        days.forEach((day, index) => {
            const cellData = row[index + 1] || '';
            if (cellData) {
                // Espera-se formato: "Matéria - Professor" ou apenas "Professor"
                const parts = cellData.split('-').map(s => s.trim());
                let subject, teacher;
                
                if (parts.length >= 2) {
                    subject = parts[0];
                    teacher = parts[1];
                } else {
                    subject = 'Aula';
                    teacher = parts[0];
                }
                
                rowSchedule[day] = { subject, teacher, time: timeSlot };
                teachersSet.add(teacher);
            }
        });
        
        scheduleData.push({
            time: timeSlot,
            schedule: rowSchedule
        });
    }
    
    // Criar lista de professores únicos
    teachersData = Array.from(teachersSet).map(name => ({
        name,
        color: TEACHER_COLORS[name] || getRandomColor()
    }));
    
    // Atualizar cores dos professores
    teachersData.forEach(teacher => {
        if (!TEACHER_COLORS[teacher.name]) {
            TEACHER_COLORS[teacher.name] = teacher.color;
        }
    });
}

// Carregar dados de exemplo
function loadExampleData() {
    const exampleSchedule = [
        {
            time: '08:00 - 09:00',
            schedule: {
                segunda: { subject: 'Matemática', teacher: 'Ana Silva', time: '08:00 - 09:00' },
                terca: { subject: 'Português', teacher: 'Carlos Santos', time: '08:00 - 09:00' },
                quarta: { subject: 'História', teacher: 'Maria Oliveira', time: '08:00 - 09:00' },
                quinta: { subject: 'Geografia', teacher: 'João Pereira', time: '08:00 - 09:00' },
                sexta: { subject: 'Ciências', teacher: 'Fernanda Costa', time: '08:00 - 09:00' }
            }
        },
        {
            time: '09:00 - 10:00',
            schedule: {
                segunda: { subject: 'Português', teacher: 'Carlos Santos', time: '09:00 - 10:00' },
                terca: { subject: 'Matemática', teacher: 'Ana Silva', time: '09:00 - 10:00' },
                quarta: { subject: 'Inglês', teacher: 'Pedro Almeida', time: '09:00 - 10:00' },
                quinta: { subject: 'Matemática', teacher: 'Ana Silva', time: '09:00 - 10:00' },
                sexta: { subject: 'Arte', teacher: 'Juliana Rodrigues', time: '09:00 - 10:00' }
            }
        },
        {
            time: '10:00 - 11:00',
            schedule: {
                segunda: { subject: 'Ciências', teacher: 'Fernanda Costa', time: '10:00 - 11:00' },
                terca: { subject: 'História', teacher: 'Maria Oliveira', time: '10:00 - 11:00' },
                quarta: { subject: 'Matemática', teacher: 'Ana Silva', time: '10:00 - 11:00' },
                quinta: { subject: 'Português', teacher: 'Carlos Santos', time: '10:00 - 11:00' },
                sexta: { subject: 'Educação Física', teacher: 'Ricardo Ferreira', time: '10:00 - 11:00' }
            }
        },
        {
            time: '11:00 - 12:00',
            schedule: {
                segunda: { subject: 'Inglês', teacher: 'Pedro Almeida', time: '11:00 - 12:00' },
                terca: { subject: 'Geografia', teacher: 'João Pereira', time: '11:00 - 12:00' },
                quarta: { subject: 'Ciências', teacher: 'Fernanda Costa', time: '11:00 - 12:00' },
                quinta: { subject: 'História', teacher: 'Maria Oliveira', time: '11:00 - 12:00' },
                sexta: { subject: 'Matemática', teacher: 'Ana Silva', time: '11:00 - 12:00' }
            }
        },
        {
            time: '13:00 - 14:00',
            schedule: {
                segunda: { subject: 'Arte', teacher: 'Juliana Rodrigues', time: '13:00 - 14:00' },
                terca: { subject: 'Ciências', teacher: 'Fernanda Costa', time: '13:00 - 14:00' },
                quarta: { subject: 'Português', teacher: 'Carlos Santos', time: '13:00 - 14:00' },
                quinta: { subject: 'Inglês', teacher: 'Pedro Almeida', time: '13:00 - 14:00' },
                sexta: { subject: 'Geografia', teacher: 'João Pereira', time: '13:00 - 14:00' }
            }
        },
        {
            time: '14:00 - 15:00',
            schedule: {
                segunda: { subject: 'Educação Física', teacher: 'Ricardo Ferreira', time: '14:00 - 15:00' },
                terca: { subject: 'Arte', teacher: 'Juliana Rodrigues', time: '14:00 - 15:00' },
                quarta: { subject: 'Educação Física', teacher: 'Ricardo Ferreira', time: '14:00 - 15:00' },
                quinta: { subject: 'Ciências', teacher: 'Fernanda Costa', time: '14:00 - 15:00' },
                sexta: { subject: 'Português', teacher: 'Carlos Santos', time: '14:00 - 15:00' }
            }
        }
    ];
    
    scheduleData = exampleSchedule;
    
    // Extrair professores únicos
    const teachersSet = new Set();
    exampleSchedule.forEach(slot => {
        Object.values(slot.schedule).forEach(classInfo => {
            teachersSet.add(classInfo.teacher);
        });
    });
    
    teachersData = Array.from(teachersSet).map(name => ({
        name,
        color: TEACHER_COLORS[name] || getRandomColor()
    }));
}

// Gerar cor aleatória
function getRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
                    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Renderizar seleção de professores
function renderTeacherSelection() {
    teacherGrid.innerHTML = '';
    
    teachersData.forEach(teacher => {
        const card = document.createElement('div');
        card.className = 'teacher-card';
        card.style.backgroundColor = teacher.color;
        card.textContent = teacher.name;
        card.onclick = () => showTeacherSchedule(teacher.name);
        teacherGrid.appendChild(card);
    });
}

// Mostrar cronograma do professor
function showTeacherSchedule(teacherName) {
    const teacher = teachersData.find(t => t.name === teacherName);
    if (!teacher) return;
    
    teacherNameEl.textContent = teacher.name;
    teacherNameEl.style.color = teacher.color;
    teacherColorIndicator.style.backgroundColor = teacher.color;
    
    // Atualizar informação da semana
    const weekInfo = getWeekInfo();
    currentWeekEl.textContent = `Semana de ${weekInfo.start} a ${weekInfo.end}`;
    
    // Renderizar tabela de horários
    renderSchedule(teacherName);
    
    // Renderizar legenda
    renderLegend();
    
    // Trocar visualização
    teacherSelectionView.classList.add('hidden');
    scheduleView.classList.remove('hidden');
}

// Renderizar tabela de horários
function renderSchedule(teacherName) {
    scheduleBody.innerHTML = '';
    
    scheduleData.forEach(slot => {
        const row = document.createElement('tr');
        
        // Coluna de horário
        const timeCell = document.createElement('td');
        timeCell.className = 'time-slot';
        timeCell.textContent = slot.time;
        row.appendChild(timeCell);
        
        // Dias da semana
        const days = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
        days.forEach(day => {
            const cell = document.createElement('td');
            const classInfo = slot.schedule[day];
            
            if (classInfo && classInfo.teacher === teacherName) {
                const teacher = teachersData.find(t => t.name === classInfo.teacher);
                cell.className = 'class-cell';
                cell.style.backgroundColor = teacher ? teacher.color : '#667eea';
                cell.innerHTML = `
                    <div class="subject">${classInfo.subject}</div>
                    <div class="time">${classInfo.time}</div>
                `;
            } else {
                cell.className = 'empty-cell';
                cell.textContent = '-';
            }
            
            row.appendChild(cell);
        });
        
        scheduleBody.appendChild(row);
    });
}

// Renderizar legenda
function renderLegend() {
    legendContent.innerHTML = '';
    
    teachersData.forEach(teacher => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `
            <div class="legend-color" style="background-color: ${teacher.color}"></div>
            <span class="legend-name">${teacher.name}</span>
        `;
        legendContent.appendChild(item);
    });
}

// Obter informações da semana atual
function getWeekInfo() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    
    const startOfWeek = new Date(now.setDate(diff));
    const endOfWeek = new Date(now.setDate(diff + 5)); // Até sábado
    
    const options = { day: '2-digit', month: '2-digit' };
    return {
        start: startOfWeek.toLocaleDateString('pt-BR', options),
        end: endOfWeek.toLocaleDateString('pt-BR', options)
    };
}

// Voltar para seleção
backBtn.addEventListener('click', () => {
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

// Instruções para configurar o Google Sheets
console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  CONFIGURAÇÃO DO GOOGLE SHEETS                                ║
╠═══════════════════════════════════════════════════════════════╣
║  Para conectar este site ao seu Google Sheets:                ║
║                                                               ║
║  1. Crie uma planilha no Google Sheets com a seguinte         ║
║     estrutura:                                                ║
║     - Coluna A: Horários (ex: 08:00 - 09:00)                  ║
║     - Coluna B: Segunda-feira                                 ║
║     - Coluna C: Terça-feira                                   ║
║     - Coluna D: Quarta-feira                                  ║
║     - Coluna E: Quinta-feira                                  ║
║     - Coluna F: Sexta-feira                                   ║
║     - Coluna G: Sábado                                        ║
║                                                               ║
║  2. Em cada célula, use o formato: "Matéria - Professor"      ║
║     Exemplo: "Matemática - Ana Silva"                         ║
║                                                               ║
║  3. Publique a planilha:                                      ║
║     - Arquivo > Compartilhar > Publicar na Web                ║
║     OU                                                         ║
║     - Configure a API do Google Sheets                        ║
║                                                               ║
║  4. Atualize as configurações no arquivo app.js:              ║
║     - spreadsheetId: ID da sua planilha                       ║
║     - sheetName: Nome da aba                                  ║
║     - apiKey: Sua chave de API (se necessário)                ║
║                                                               ║
║  5. Personalize as cores dos professores em TEACHER_COLORS    ║
╚═══════════════════════════════════════════════════════════════╝
`);
