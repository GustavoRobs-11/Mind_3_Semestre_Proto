/**
 * scripts/simular-agendamento.js
 * Simula o processo completo de um paciente realizando um agendamento.
 * Isso dispara notificações e atualiza o histórico como se fosse um usuário real.
 * 
 * Uso: npm run simular:agendamento
 */

const API_BASE_URL = "http://localhost:8080";

async function simular() {
    console.log("🚀 Iniciando simulação de agendamento...");

    // 1. Dados de teste e Configuração
    const loginPaciente = "snoopy";
    const senhaPaciente = "1950";
    const loginPsicologo = "ana";

    // Setar null para usar o primeiro disponível / data aleatória
    const DATA_MANUAL = "2026-05-11"; // Ex: "2026-05-15" ou null
    const HORA_MANUAL = "21:30";      // Ex: "08:00" ou null

    try {
        // 2. Login do Paciente
        console.log(`\n🔑 Fazendo login como paciente: ${loginPaciente}...`);
        const loginRes = await fetch(`${API_BASE_URL}/pacientes/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login: loginPaciente, senha: senhaPaciente })
        });

        if (!loginRes.ok) throw new Error("Falha no login do paciente.");
        const authData = await loginRes.json();
        const token = authData.token;
        console.log("✅ Login realizado com sucesso!");
        console.log(`🔑 TOKEN: ${token}`);

        // 3. Buscar ID do Paciente (necessário porque o login não retorna o ID)
        console.log(`\n🔍 Buscando ID do paciente: ${loginPaciente}...`);
        const pacRes = await fetch(`${API_BASE_URL}/pacientes/login/${loginPaciente}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!pacRes.ok) throw new Error("ID do paciente não encontrado.");
        const pacienteData = await pacRes.json();
        const pacienteId = pacienteData.id;
        console.log(`✅ ID do Paciente encontrado: ${pacienteId}`);

        // 4. Buscar ID da Psicóloga
        console.log(`\n🔍 Buscando dados da psicóloga: ${loginPsicologo}...`);
        const psiRes = await fetch(`${API_BASE_URL}/psicologos/login/${loginPsicologo}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!psiRes.ok) throw new Error("Psicóloga não encontrada.");
        const psicologoData = await psiRes.json();
        const psicologoId = psicologoData.id;
        console.log(`✅ Psicóloga encontrada: ${psicologoData.nome} (ID: ${psicologoId})`);

        // 4. Buscar horários disponíveis
        console.log("\n📅 Buscando horários disponíveis...");
        const horRes = await fetch(`${API_BASE_URL}/horarios/psicologo/${psicologoId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!horRes.ok) throw new Error("Erro ao buscar horários.");
        const horarios = await horRes.json();
        
        let slotDisponivel;
        if (HORA_MANUAL) {
            slotDisponivel = horarios.find(h => h.disponivel && h.horaInicio === HORA_MANUAL);
        } else {
            slotDisponivel = horarios.find(h => h.disponivel);
        }

        if (!slotDisponivel) {
            console.log(`❌ Nenhum horário disponível encontrado${HORA_MANUAL ? ' para a hora ' + HORA_MANUAL : ' para esta psicóloga'}.`);
            return;
        }
        console.log(`✅ Horário encontrado: ${slotDisponivel.diaDaSemana} às ${slotDisponivel.horaInicio}`);

        // 5. Realizar o agendamento
        let dataAgendamento;
        if (DATA_MANUAL) {
            dataAgendamento = DATA_MANUAL;
        } else {
            // Se null, gera data futura aleatória (entre 7 e 30 dias) para evitar conflito
            const hoje = new Date();
            const diasFuturos = Math.floor(Math.random() * 24) + 7;
            hoje.setDate(hoje.getDate() + diasFuturos);
            dataAgendamento = hoje.toISOString().split('T')[0];
        }

        console.log(`\n📝 Realizando agendamento para o dia ${dataAgendamento}...`);
        const body = {
            psicologoId: psicologoId,
            pacienteId: pacienteId,
            horarioId: slotDisponivel.id,
            data: dataAgendamento,
            diaDaSemana: slotDisponivel.diaDaSemana,
            horaInicio: slotDisponivel.horaInicio
        };

        console.log(`\n📦 Corpo da requisição: ${JSON.stringify(body, null, 2)}`);

        const agendaRes = await fetch(`${API_BASE_URL}/agendas`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (!agendaRes.ok) {
            const errorText = await agendaRes.text();
            throw new Error(`Falha no agendamento (Status ${agendaRes.status}): ${errorText}`);
        }

        const agendaData = await agendaRes.json();
        console.log("✨ AGENDAMENTO REALIZADO COM SUCESSO!");
        console.log(`📌 ID do Agendamento: ${agendaData.id}`);
        console.log(`🔔 Notificação enviada para a psicóloga ${loginPsicologo}.`);
        console.log("\nAgora você pode abrir o dashboard do psicólogo para ver o novo agendamento 'Pendente'.");

    } catch (error) {
        console.error("\n❌ ERRO NA SIMULAÇÃO:", error.message);
    }
}

simular();
