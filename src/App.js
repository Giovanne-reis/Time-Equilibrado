import React, { useState, useMemo } from 'react';

// --- Constantes e Dados Iniciais ---

const POSICOES = {
  GOLEIRO: 'GOLEIRO',
  LATERAL: 'LATERAL',
  ZAGUEIRO: 'ZAGUEIRO',
  VOLANTE: 'VOLANTE',
  MEIA: 'MEIA',
  ATACANTE: 'ATACANTE',
};

const QTD_POR_POSICAO = {
  [POSICOES.GOLEIRO]: 1,
  [POSICOES.LATERAL]: 2,
  [POSICOES.ZAGUEIRO]: 2,
  [POSICOES.VOLANTE]: 2,
  [POSICOES.MEIA]: 2,
  [POSICOES.ATACANTE]: 1,
};

const ORDEM_POSICOES_EXIBICAO = [
  POSICOES.GOLEIRO, POSICOES.LATERAL, POSICOES.LATERAL,
  POSICOES.ZAGUEIRO, POSICOES.ZAGUEIRO, POSICOES.VOLANTE,
  POSICOES.VOLANTE, POSICOES.MEIA, POSICOES.MEIA, POSICOES.ATACANTE
];

// Coordenadas para posicionar os jogadores no campo (baseado na ordem acima)
const FORMATION_LAYOUT = [
  // Goleiro
  { top: '92%', left: '50%' },
  // Laterais (Esquerdo e Direito)
  { top: '75%', left: '15%' }, 
  { top: '75%', left: '85%' }, 
  // Zagueiros
  { top: '80%', left: '35%' }, 
  { top: '80%', left: '65%' }, 
  // Volantes
  { top: '60%', left: '30%' }, 
  { top: '60%', left: '70%' }, 
  // Meias
  { top: '40%', left: '20%' }, 
  { top: '40%', left: '80%' }, 
  // Atacante
  { top: '20%', left: '50%' }, 
];

// Mock de dados de jogadores
const TODOS_JOGADORES = [
    { id: 1, nome: "ALEMÃO", pos1: "GOLEIRO", nivel1: 4, pos2: "GOLEIRO", nivel2: 4 },
    { id: 2, nome: "ANDERSON(Neguinho)", pos1: "VOLANTE", nivel1: 4, pos2: "MEIA", nivel2: 4 },
    { id: 3, nome: "BAIANINHO", pos1: "LATERAL", nivel1: 2, pos2: "LATERAL", nivel2: 2 },
    { id: 4, nome: "BAIANO(Canoa)", pos1: "ZAGUEIRO", nivel1: 4, pos2: "VOLANTE", nivel2: 3 },
    { id: 5, nome: "BELEZÃO", pos1: "VOLANTE", nivel1: 4, pos2: "ZAGUEIRO", nivel2: 3 },
    { id: 6, nome: "BIGODE", pos1: "ATACANTE", nivel1: 3, pos2: "MEIA", nivel2: 3 },
    { id: 7, nome: "BOLOTA", pos1: "ZAGUEIRO", nivel1: 4, pos2: "ATACANTE", nivel2: 3 },
    { id: 8, nome: "BRUNO RICARDO", pos1: "VOLANTE", nivel1: 4, pos2: "LATERAL", nivel2: 4 },
    { id: 9, nome: "BRUNO(Convidado)", pos1: "ATACANTE", nivel1: 3, pos2: "MEIA", nivel2: 3 },
    { id: 10, nome: "DENES", pos1: "ATACANTE", nivel1: 3, pos2: "MEIA", nivel2: 3 },
    { id: 11, nome: "DHIEGO BALBINO", pos1: "ATACANTE", nivel1: 5, pos2: "MEIA", nivel2: 5 },
    { id: 12, nome: "DIEGO CRUZ", pos1: "ATACANTE", nivel1: 4, pos2: "MEIA", nivel2: 3 },
    { id: 13, nome: "DIELIS", pos1: "VOLANTE", nivel1: 4, pos2: "LATERAL", nivel2: 3 },
    { id: 14, nome: "DUDU", pos1: "LATERAL", nivel1: 3, pos2: "ATACANTE", nivel2: 3 },
    { id: 15, nome: "DURVAL", pos1: "ATACANTE", nivel1: 3, pos2: "ATACANTE", nivel2: 3 },
    { id: 16, nome: "EDINHO", pos1: "ZAGUEIRO", nivel1: 4, pos2: "VOLANTE", nivel2: 3 },
    { id: 17, nome: "EDNALDO", pos1: "MEIA", nivel1: 4, pos2: "ATACANTE", nivel2: 4 },
    { id: 18, nome: "EMERSON FRAGA", pos1: "MEIA", nivel1: 4, pos2: "ATACANTE", nivel2: 4 },
    { id: 19, nome: "FEIJÃO", pos1: "VOLANTE", nivel1: 4, pos2: "ZAGUEIRO", nivel2: 4 },
    { id: 20, nome: "FERNANDO", pos1: "MEIA", nivel1: 4, pos2: "LATERAL", nivel2: 3 },
    { id: 21, nome: "FILIPE", pos1: "LATERAL", nivel1: 3, pos2: "MEIA", nivel2: 3 },
    { id: 22, nome: "GABRIEL", pos1: "LATERAL", nivel1: 3, pos2: "MEIA", nivel2: 3 },
    { id: 23, nome: "GABRIEL(Convidado)", pos1: "MEIA", nivel1: 4, pos2: "ATACANTE", nivel2: 3 },
    { id: 24, nome: "GENEBRA", pos1: "ZAGUEIRO", nivel1: 2, pos2: "LATERAL", nivel2: 1 },
    { id: 25, nome: "GILBERTO", pos1: "LATERAL", nivel1: 1, pos2: "LATERAL", nivel2: 1 },
    { id: 26, nome: "GISLEI", pos1: "ATACANTE", nivel1: 4, pos2: "MEIA", nivel2: 3 },
    { id: 27, nome: "GLEIDSON", pos1: "GOLEIRO", nivel1: 4, pos2: "GOLEIRO", nivel2: 4 },
    { id: 28, nome: "HERICK", pos1: "ATACANTE", nivel1: 3, pos2: "MEIA", nivel2: 3 },
    { id: 29, nome: "JHONES", pos1: "GOLEIRO", nivel1: 3, pos2: "ATACANTE", nivel2: 2 },
    { id: 30, nome: "JONATAN", pos1: "MEIA", nivel1: 4, pos2: "ATACANTE", nivel2: 4 },
    { id: 31, nome: "JORGE", pos1: "LATERAL", nivel1: 3, pos2: "VOLANTE", nivel2: 3 },
    { id: 32, nome: "KAKA", pos1: "ATACANTE", nivel1: 4, pos2: "LATERAL", nivel2: 3 },
    { id: 33, nome: "LEO", pos1: "VOLANTE", nivel1: 5, pos2: "MEIA", nivel2: 4 },
    { id: 34, nome: "MARCEL", pos1: "MEIA", nivel1: 4, pos2: "VOLANTE", nivel2: 4 },
    { id: 35, nome: "MARCIO", pos1: "MEIA", nivel1: 5, pos2: "VOLANTE", nivel2: 5 },
    { id: 36, nome: "MATEUS", pos1: "ATACANTE", nivel1: 4, pos2: "MEIA", nivel2: 3 },
    { id: 37, nome: "MAURO", pos1: "LATERAL", nivel1: 5, pos2: "ZAGUEIRO", nivel2: 3 },
    { id: 38, nome: "MAYCON", pos1: "VOLANTE", nivel1: 3, pos2: "ZAGUEIRO", nivel2: 3 },
    { id: 39, nome: "MAYKON", pos1: "LATERAL", nivel1: 4, pos2: "MEIA", nivel2: 3 },
    { id: 40, nome: "MURILO", pos1: "VOLANTE", nivel1: 4, pos2: "MEIA", nivel2: 4 },
    { id: 41, nome: "RAFAEL", pos1: "MEIA", nivel1: 5, pos2: "ATACANTE", nivel2: 5 },
    { id: 42, nome: "RAMIRO(Luiz)", pos1: "MEIA", nivel1: 4, pos2: "ATACANTE", nivel2: 4 },
    { id: 43, nome: "REIS", pos1: "ZAGUEIRO", nivel1: 2, pos2: "LATERAL", nivel2: 1 },
    { id: 44, nome: "RENATO", pos1: "ZAGUEIRO", nivel1: 3, pos2: "VOLANTE", nivel2: 3 },
    { id: 45, nome: "THIAGO", pos1: "VOLANTE", nivel1: 4, pos2: "ZAGUEIRO", nivel2: 4 },
    { id: 46, nome: "ULISSES", pos1: "LATERAL", nivel1: 4, pos2: "ZAGUEIRO", nivel2: 3 },
    { id: 47, nome: "VANDINHO", pos1: "ZAGUEIRO", nivel1: 3, pos2: "LATERAL", nivel2: 1 }
];

// --- Estilos ---
const styles = {
  safeArea: { backgroundColor: '#121212', fontFamily: 'sans-serif', color: 'white' },
  container: { display: 'flex', flexDirection: 'column', height: '100vh', padding: '10px', boxSizing: 'border-box' },
  header: { fontSize: '28px', fontWeight: 'bold', textAlign: 'center', margin: '15px 0' },
  subHeader: { fontSize: '18px', color: '#A0A0A0', textAlign: 'center', marginBottom: '10px' },
  playerList: { flex: 1, overflowY: 'auto', paddingRight: '10px' },
  playerItem: { backgroundColor: '#1E1E1E', borderRadius: '8px', padding: '15px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderWidth: '1px', borderStyle: 'solid', borderColor: '#333', cursor: 'pointer' },
  playerItemSelected: { backgroundColor: '#004D40', borderColor: '#4CAF50' },
  playerInfo: { flex: 1 },
  playerName: { fontSize: '18px', fontWeight: 'bold', margin: 0 },
  playerPosition: { fontSize: '14px', color: '#B0B0B0', marginTop: '4px', margin: 0 },
  checkbox: { width: '24px', height: '24px', borderRadius: '4px', borderWidth: '2px', borderStyle: 'solid', borderColor: '#757575', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  checkboxSelected: { backgroundColor: '#4CAF50', borderColor: '#FFFFFF' },
  checkboxMark: { color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' },
  buttonContainer: { display: 'flex', justifyContent: 'space-around', padding: '10px 0', borderTop: '1px solid #333', marginTop: '10px' },
  button: { padding: '12px 20px', borderRadius: '25px', border: 'none', minWidth: '150px', cursor: 'pointer', color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' },
  primaryButton: { backgroundColor: '#4CAF50' },
  secondaryButton: { backgroundColor: '#F44336' },
  teamsContainer: { display: 'flex', flexDirection: 'row', justifyContent: 'space-around', gap: '10px' },
  teamColumn: { flex: 1, margin: '0 5px' },
  teamHeaderA: { padding: '10px', backgroundColor: '#1E88E5', borderRadius: '8px', marginBottom: '10px', textAlign: 'center' },
  teamHeaderB: { padding: '10px', backgroundColor: '#E53935', borderRadius: '8px', marginBottom: '10px', textAlign: 'center' },
  teamTitle: { fontSize: '20px', fontWeight: 'bold', margin: 0 },
  teamLevel: { fontSize: '14px', marginTop: '4px', margin: 0 },
  teamPlayerItem: { backgroundColor: '#2C2C2C', borderRadius: '6px', padding: '10px', marginBottom: '8px' },
  teamPlayerName: { fontSize: '16px', fontWeight: 'bold', color: '#E0E0E0', margin: 0 },
  teamPlayerPosition: { fontSize: '13px', color: '#A0A0A0', margin: 0 },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  alertContainer: { width: '85%', maxWidth: '400px', backgroundColor: '#2C2C2C', borderRadius: '15px', padding: '20px', textAlign: 'center', border: '1px solid #444' },
  alertTitle: { fontSize: '22px', fontWeight: 'bold', margin: '0 0 15px 0' },
  alertMessage: { fontSize: '16px', color: '#E0E0E0', lineHeight: '1.4', margin: 0 },
  alertButton: { backgroundColor: '#4CAF50', borderRadius: '20px', padding: '10px 40px', border: 'none', cursor: 'pointer', marginTop: '20px' },
  alertButtonText: { color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold', margin: 0 },
  field: { backgroundColor: '#0A7A3B', borderWidth: '2px', borderStyle: 'solid', borderColor: 'white', position: 'relative', height: '400px', width: '100%', maxWidth: '300px', margin: '10px auto', borderRadius: '10px' },
  centerLine: { position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', backgroundColor: 'rgba(255, 255, 255, 0.5)' },
  centerCircle: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80px', height: '80px', borderRadius: '50%', border: '2px solid rgba(255, 255, 255, 0.5)' },
  goalBox: { position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: '50%', height: '80px', borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(255, 255, 255, 0.5)' },
  playerDot: { position: 'absolute', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderWidth: '2px', borderStyle: 'solid', borderColor: 'white', transform: 'translate(-50%, -50%)', textAlign: 'center', overflow: 'hidden' },
  playerNameOnField: { fontSize: '10px', fontWeight: 'bold', padding: '2px', whiteSpace: 'nowrap' },
};

// --- Componente de Alerta ---
const CustomAlert = ({ visible, title, message, onClose }) => {
  if (!visible) return null;
  const messageWithBreaks = message.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>);
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.alertContainer} onClick={e => e.stopPropagation()}>
        <p style={styles.alertTitle}>{title}</p>
        <p style={styles.alertMessage}>{messageWithBreaks}</p>
        <button style={{...styles.button, ...styles.alertButton}} onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

// --- Componente do Campo de Futebol ---
const FieldFormation = ({ team, teamColor }) => (
  <div style={styles.field}>
    <div style={styles.centerLine}></div>
    <div style={styles.centerCircle}></div>
    <div style={{...styles.goalBox, top: 0, borderTopWidth: 0}}></div>
    <div style={{...styles.goalBox, bottom: 0, borderBottomWidth: 0}}></div>
    {team.map((player, index) => {
      if (!player) return null;
      const positionStyle = FORMATION_LAYOUT[index] || { display: 'none' };
      return (
        <div key={index} style={{...styles.playerDot, ...positionStyle, backgroundColor: teamColor}} title={`${player.nome} - ${player.posicao}`}>
          <span style={styles.playerNameOnField}>{player.nome.split(' ')[0]}</span>
        </div>
      );
    })}
  </div>
);

// --- Componente Principal ---
export default function App() {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [levelA, setLevelA] = useState(0);
  const [levelB, setLevelB] = useState(0);
  const [currentScreen, setCurrentScreen] = useState('selection');
  const [alertInfo, setAlertInfo] = useState({ visible: false, title: '', message: '' });

  const showAlert = (title, message) => setAlertInfo({ visible: true, title, message });
  const selectedIds = useMemo(() => new Set(selectedPlayers.map(p => p.id)), [selectedPlayers]);

  const handleSelectPlayer = (player) => {
    if (selectedIds.has(player.id)) {
      setSelectedPlayers(prev => prev.filter(p => p.id !== player.id));
    } else {
      if (selectedPlayers.length >= 20) {
        showAlert('Limite Atingido', 'Você já selecionou 20 jogadores.');
        return;
      }
      setSelectedPlayers(prev => [...prev, player]);
    }
  };

  const clearSelection = () => {
    setSelectedPlayers([]);
    setTeamA([]);
    setTeamB([]);
    setLevelA(0);
    setLevelB(0);
    setCurrentScreen('selection');
  };

  const divideTeams = (playersToDivide = selectedPlayers) => {
    if (playersToDivide.length < 20) {
      showAlert('Jogadores Insuficientes', `Você precisa selecionar 20 jogadores! Atualmente há ${playersToDivide.length} selecionados.`);
      return;
    }

    let jogadores = JSON.parse(JSON.stringify(playersToDivide)).map(p => ({ ...p, alocado: false }));
    let timeA_temp = Array(10).fill(null);
    let timeB_temp = Array(10).fill(null);
    let nivelA_temp = 0;
    let nivelB_temp = 0;

    const alocarJogador = (jogador, time, nivel, posicao, tipoPosicao) => {
        const slotIndex = time.findIndex((slot, index) => ORDEM_POSICOES_EXIBICAO[index] === posicao && slot === null);
        if (slotIndex !== -1) {
            time[slotIndex] = { nome: jogador.nome, posicao: tipoPosicao === '2a' ? `${posicao} (2ª)` : tipoPosicao === 'coringa' ? `${posicao} (Coringa)` : posicao, nivel: nivel };
            jogador.alocado = true;
            return nivel;
        }
        return 0;
    };

    // Lógica de distribuição (simplificada para o exemplo)
    Object.values(POSICOES).forEach(pos => {
        let jogadoresDaPosicao = jogadores.filter(p => p.pos1 === pos && !p.alocado).sort((a, b) => b.nivel1 - a.nivel1);
        jogadoresDaPosicao.forEach(jogador => {
            const vagasA = timeA_temp.filter((s, i) => ORDEM_POSICOES_EXIBICAO[i] === pos && s === null).length;
            const vagasB = timeB_temp.filter((s, i) => ORDEM_POSICOES_EXIBICAO[i] === pos && s === null).length;
            if (vagasA === 0 && vagasB === 0) return;
            if ((nivelA_temp <= nivelB_temp && vagasA > 0) || vagasB === 0) {
                nivelA_temp += alocarJogador(jogador, timeA_temp, jogador.nivel1, pos, '1a');
            } else {
                nivelB_temp += alocarJogador(jogador, timeB_temp, jogador.nivel1, pos, '1a');
            }
        });
    });
    
    // Posição Secundária e Coringas...
    Object.values(POSICOES).forEach(pos => {
      let jogadoresDaPosicao = jogadores.filter(p => p.pos2 === pos && !p.alocado).sort((a, b) => b.nivel2 - a.nivel2);
      jogadoresDaPosicao.forEach(jogador => {
          const vagasA = timeA_temp.filter((s, i) => ORDEM_POSICOES_EXIBICAO[i] === pos && s === null).length;
          const vagasB = timeB_temp.filter((s, i) => ORDEM_POSICOES_EXIBICAO[i] === pos && s === null).length;
          if (vagasA === 0 && vagasB === 0) return;
          if ((nivelA_temp <= nivelB_temp && vagasA > 0) || vagasB === 0) {
              nivelA_temp += alocarJogador(jogador, timeA_temp, jogador.nivel2, pos, '2a');
          } else {
              nivelB_temp += alocarJogador(jogador, timeB_temp, jogador.nivel2, pos, '2a');
          }
      });
    });

    let jogadoresRestantes = jogadores.filter(p => !p.alocado).sort((a, b) => b.nivel1 - a.nivel1);
    timeA_temp.forEach((slot, index) => {
        if (slot === null && jogadoresRestantes.length > 0) {
            const jogador = jogadoresRestantes.shift();
            nivelA_temp += alocarJogador(jogador, timeA_temp, jogador.nivel1, ORDEM_POSICOES_EXIBICAO[index], 'coringa');
        }
    });
    timeB_temp.forEach((slot, index) => {
        if (slot === null && jogadoresRestantes.length > 0) {
            const jogador = jogadoresRestantes.shift();
            nivelB_temp += alocarJogador(jogador, timeB_temp, jogador.nivel1, ORDEM_POSICOES_EXIBICAO[index], 'coringa');
        }
    });


    setTeamA(timeA_temp);
    setTeamB(timeB_temp);
    setLevelA(nivelA_temp);
    setLevelB(nivelB_temp);
    setCurrentScreen('teams');
  };

  const redivideTeams = () => {
    if (selectedPlayers.length < 20) {
        showAlert('Jogadores Insuficientes', `Você precisa selecionar 20 jogadores para redividir.`);
        return;
    }
    const shuffledPlayers = [...selectedPlayers].sort(() => Math.random() - 0.5);
    divideTeams(shuffledPlayers);
    showAlert("Times Redivididos", "Os times foram embaralhados e divididos novamente!");
  };

  const renderSelectionScreen = () => (
    <div style={styles.container}>
      <p style={styles.header}>Selecione 20 Jogadores</p>
      <p style={styles.subHeader}>Selecionados: {selectedPlayers.length} / 20</p>
      <div style={styles.playerList}>
        {TODOS_JOGADORES.map(player => (
          <div key={player.id} style={{...styles.playerItem, ...(selectedIds.has(player.id) && styles.playerItemSelected)}} onClick={() => handleSelectPlayer(player)}>
            <div style={styles.playerInfo}>
              <p style={styles.playerName}>{player.nome}</p>
              <p style={styles.playerPosition}>{player.pos1} ({player.nivel1}) / {player.pos2} ({player.nivel2})</p>
            </div>
            <div style={{...styles.checkbox, ...(selectedIds.has(player.id) && styles.checkboxSelected)}}>
              {selectedIds.has(player.id) && <span style={styles.checkboxMark}>✓</span>}
            </div>
          </div>
        ))}
      </div>
      <div style={styles.buttonContainer}>
        <button style={{...styles.button, ...styles.primaryButton}} onClick={() => divideTeams()}>Dividir Times</button>
        <button style={{...styles.button, ...styles.secondaryButton}} onClick={clearSelection}>Limpar Seleção</button>
      </div>
    </div>
  );

  const renderTeamsScreen = () => (
    <div style={styles.container}>
        <p style={styles.header}>Times Divididos</p>
        <div style={{flex: 1, overflowY: 'auto', paddingRight: '10px'}}>
            <div style={styles.teamsContainer}>
                <div style={styles.teamColumn}><FieldFormation team={teamA} teamColor="#1E88E5" /></div>
                <div style={styles.teamColumn}><FieldFormation team={teamB} teamColor="#E53935" /></div>
            </div>
            <div style={{...styles.teamsContainer, marginTop: '20px'}}>
                <div style={styles.teamColumn}>
                    <div style={styles.teamHeaderA}>
                        <p style={styles.teamTitle}>Time A</p>
                        <p style={styles.teamLevel}>Nível Total: {levelA}</p>
                    </div>
                    {teamA.map((p, i) => p && <div key={`A-${i}`} style={styles.teamPlayerItem}><p style={styles.teamPlayerName}>{p.nome}</p><p style={styles.teamPlayerPosition}>{p.posicao} ({p.nivel})</p></div>)}
                </div>
                <div style={styles.teamColumn}>
                    <div style={styles.teamHeaderB}>
                        <p style={styles.teamTitle}>Time B</p>
                        <p style={styles.teamLevel}>Nível Total: {levelB}</p>
                    </div>
                    {teamB.map((p, i) => p && <div key={`B-${i}`} style={styles.teamPlayerItem}><p style={styles.teamPlayerName}>{p.nome}</p><p style={styles.teamPlayerPosition}>{p.posicao} ({p.nivel})</p></div>)}
                </div>
            </div>
        </div>
        <div style={styles.buttonContainer}>
            <button style={{...styles.button, ...styles.primaryButton}} onClick={redivideTeams}>Redividir Times</button>
            <button style={{...styles.button, ...styles.secondaryButton}} onClick={() => setCurrentScreen('selection')}>Voltar à Seleção</button>
        </div>
    </div>
  );

  return (
    <div style={styles.safeArea}>
      <CustomAlert visible={alertInfo.visible} title={alertInfo.title} message={alertInfo.message} onClose={() => setAlertInfo({ visible: false, title: '', message: '' })} />
      {currentScreen === 'selection' ? renderSelectionScreen() : renderTeamsScreen()}
    </div>
  );
}