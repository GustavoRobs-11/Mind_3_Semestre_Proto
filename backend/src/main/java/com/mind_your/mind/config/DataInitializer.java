package com.mind_your.mind.config;

import com.mind_your.mind.models.Paciente;
import com.mind_your.mind.repository.PacienteRepository;
import com.mind_your.mind.models.Psicologo;
import com.mind_your.mind.repository.PsicologoRepository;
import com.mind_your.mind.models.Horario;
import com.mind_your.mind.repository.HorarioRepository;
import com.mind_your.mind.models.Artigo;
import com.mind_your.mind.repository.ArtigoRepository;
import com.mind_your.mind.models.Especialidade;
import com.mind_your.mind.repository.EspecialidadeRepository;
import com.mind_your.mind.models.Agenda;
import com.mind_your.mind.repository.AgendaRepository;
import com.mind_your.mind.models.Prontuario;
import com.mind_your.mind.repository.ProntuarioRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initData(PsicologoRepository psiRepo,
                               PacienteRepository pacRepo,
                               HorarioRepository horRepo,
                               ArtigoRepository artigoRepo,
                               EspecialidadeRepository espRepo,
                               AgendaRepository agendaRepo,
                               ProntuarioRepository prontuarioRepo) {
        return args -> {
            // Inicializar Especialidades se estiver vazio
            if (espRepo.count() == 0) {
                List<String> iniciais = List.of(
                    "Ansiedade", "Depressão", "Terapia Cognitivo-Comportamental", "Psicanálise", "Luto",
                    "Terapia Infantil", "TDAH", "Autismo", "Terapia de Casal", "Relacionamentos",
                    "Conflitos Familiares", "Neuropsicologia", "Reabilitação Cognitiva", "Terapia Familiar",
                    "Transtornos Alimentares", "Terapia Ocupacional", "Reabilitação", "Psicologia Clínica",
                    "Psicologia do Desenvolvimento", "Orientação Profissional", "Autoestima", "Estresse"
                );
                iniciais.forEach(nome -> espRepo.save(new Especialidade(nome)));
                System.out.println("Especialidades iniciais cadastradas!");
            }

            // Inicializar Psicólogos se estiver vazio
            if (psiRepo.count() == 0) {
                System.out.println("Iniciando carga de psicólogos (Interior e Capital de SP)...");
                
                List<Psicologo> psicologos = new ArrayList<>();
                
                psicologos.add(createPsicologo("ana", "1234", "ana@gmail.com", "Ana", "Silva", "Feminino", "1985-05-20", "(11) 98765-4321", 
                        "01310-100", "São Paulo", "SP", "perfil-ana.png", "123456", "123.456.789-01",
                        List.of("Ansiedade", "Depressão", "Terapia Cognitivo-Comportamental"), 
                        "Psicóloga com 10 anos de experiência em casos de ansiedade extrema e fobias sociais."));
                
                psicologos.add(createPsicologo("bruno", "5678", "bruno@gmail.com", "Bruno", "Ferreira", "Masculino", "1990-11-10", "(11) 91234-5678", 
                        "07010-000", "Guarulhos", "SP", "perfil-bruno.png", "654321", "234.567.890-12",
                        List.of("Psicanálise", "Luto", "Depressão"), 
                        "Especialista em psicanálise clínica, focado em processos de luto e autoconhecimento profundo."));
                
                psicologos.add(createPsicologo("carla1", "ab3cd", "carla1@gmail.com", "Carla", "Souza", "Feminino", "1988-03-15", "(11) 99876-5432", 
                        "09910-000", "Diadema", "SP", "perfil-carla.png", "112233", "345.678.901-23",
                        List.of("Terapia Infantil", "TDAH", "Autismo"), 
                        "Atendimento especializado para crianças e adolescentes com foco em desenvolvimento cognitivo."));
                
                psicologos.add(createPsicologo("carla2", "ab4cd", "carla2@gmail.com", "Carla", "Mendes", "Feminino", "1988-03-15", "(19) 99876-5432", 
                        "13010-001", "Campinas", "SP", "perfil-carla.png", "445511", "456.789.012-34",
                        List.of("Terapia de Casal", "Relacionamentos", "Conflitos Familiares"), 
                        "Focada em restaurar a comunicação e o respeito em relacionamentos afetivos e familiares."));
                
                psicologos.add(createPsicologo("daniel", "ef5gh", "daniel@gmail.com", "Daniel", "Oliveira", "Masculino", "1979-07-22", "(12) 98765-1234", 
                        "12245-000", "São José dos Campos", "SP", "perfil-daniel.png", "445566", "567.890.123-45",
                        List.of("Neuropsicologia", "Reabilitação Cognitiva"), 
                        "Especialista em avaliações neuropsicológicas e reabilitação após traumas cranianos."));
                
                psicologos.add(createPsicologo("elisa", "ij6kl", "elisa@gmail.com", "Elisa", "Costa", "Feminino", "1992-12-05", "(16) 91234-8765", 
                        "14010-000", "Ribeirão Preto", "SP", "perfil-elisa.png", "778899", "678.901.234-56",
                        List.of("Terapia Familiar", "Transtornos Alimentares"), 
                        "Abordagem sistêmica para tratar dinâmicas familiares complexas e suporte em transtornos alimentares."));

                psicologos.add(createPsicologo("felipe", "mn7op", "felipe@gmail.com", "Felipe", "Martins", "Masculino", "1983-09-30", "(13) 99876-4321", 
                        "11010-001", "Santos", "SP", "perfil-felipe.png", "334455", "789.012.345-67",
                        List.of("Terapia Ocupacional", "Reabilitação"), 
                        "Focado em ajudar pacientes a recuperar autonomia através de terapia ocupacional personalizada."));
                
                psicologos.add(createPsicologo("gabriel_psi", "psi123", "gabriel_psi@gmail.com", "Gabriel", "Ramos", "Masculino", "1987-04-12", "(15) 98765-1122", 
                        "18010-001", "Sorocaba", "SP", "perfil-gabriela.png", "223311", "890.123.456-78",
                        List.of("Psicologia Clínica", "Ansiedade"), 
                        "Especialista em psicoterapia breve e acolhimento em crises de ansiedade."));

                psicologos.add(createPsicologo("helena", "psi456", "helena@gmail.com", "Helena", "Mendes", "Feminino", "1991-08-25", "(11) 97766-5544", 
                        "09710-000", "São Bernardo do Campo", "SP", "perfil-elisa.png", "998811", "901.234.567-89",
                        List.of("Psicologia do Desenvolvimento", "Orientação Profissional"), 
                        "Apoio no desenvolvimento de carreira e transições de vida."));

                psiRepo.saveAll(psicologos);
                
                // Gerar horários para cada psicólogo
                for (Psicologo p : psicologos) {
                    gerarHorariosPadrao(horRepo, p.getId());
                }
                
                System.out.println("Psicólogos de diversas cidades de SP criados!");
            }

            // Inicializar Pacientes se estiver vazio
            if (pacRepo.count() == 0) {
                System.out.println("Iniciando carga de pacientes (SP Focus)...");
                List<Paciente> pacientes = List.of(
                    createPaciente("gabriel", "2000", "gabriel@gmail.com", "Gabriel", "Santos", "Masculino", "2000-09-13", "(12) 92959-7375", "12245-000", "São José dos Campos", "SP", "789.012.345-67", "perfil-snoopy.png"),
                    createPaciente("snoopy", "1950", "snoopy@gmail.com", "Snoopy", "Dog", "Masculino", "1969-09-13", "(11) 92337-2615", "01310-100", "São Paulo", "SP", "890.123.456-78", "perfil-snoopy.png"),
                    createPaciente("scooby", "1950", "scooby@gmail.com", "Scoobert", "Cornelius Doo", "Masculino", "1950-10-04", "(11) 93070-0787", "07010-000", "Guarulhos", "SP", "901.234.567-89", "perfil-scooby.png"),
                    // Pacientes da lista de clientes da Ana Silva
                    createPaciente("amara", "amara123", "amara.silva@email.com", "Amara", "Silva", "Feminino", "1998-03-22", "(11) 98765-1234", "01310-100", "São Paulo", "SP", "111.222.333-44", ""),
                    createPaciente("lira", "lira123", "lira.costa@email.com", "Lira", "Costa", "Feminino", "1995-07-15", "(11) 97654-3210", "04040-000", "São Paulo", "SP", "222.333.444-55", ""),
                    createPaciente("marcos_silva", "marcos123", "marcos.silva@email.com", "Marcos", "Silva", "Masculino", "1990-11-05", "(11) 96543-2109", "09090-000", "São Paulo", "SP", "333.444.555-66", ""),
                    createPaciente("carlos_mat", "carlos123", "carlos.matheus@email.com", "Carlos", "Matheus", "Masculino", "1988-05-18", "(11) 95432-1098", "08080-000", "São Paulo", "SP", "444.555.666-77", ""),
                    createPaciente("luis_alc", "luis123", "luis.alcantara@email.com", "Luis", "Alcantara", "Masculino", "2001-02-28", "(11) 94321-0987", "07070-000", "Guarulhos", "SP", "555.666.777-88", ""),
                    createPaciente("heugenia", "heugenia123", "heugenia.silva@email.com", "Heugenia", "Silva", "Feminino", "1993-09-10", "(11) 93210-9876", "06060-000", "Osasco", "SP", "666.777.888-99", ""),
                    createPaciente("marcos_santos", "marcos456", "marcos.santos@email.com", "Marcos", "Santos", "Masculino", "1985-12-01", "(11) 92109-8765", "05050-000", "São Paulo", "SP", "777.888.999-00", "")
                );

                pacRepo.saveAll(pacientes);
                System.out.println("Pacientes de teste criados!");
            }

            // Inicializar Artigos se estiver vazio
            if (artigoRepo.count() == 0) {
                System.out.println("Iniciando carga de artigos de exemplo...");
                List<Artigo> artigos = new ArrayList<>();

                // Buscar psicólogos para associar aos artigos
                List<Psicologo> psicologos = psiRepo.findAll();

                if (psicologos.size() > 0) {
                    // Artigo 1 - Ana Silva (Ansiedade)
                    artigos.add(criarArtigo(psicologos.get(0),
                        "Entendendo a Ansiedade: Causas e Estratégias de Enfrentamento",
                        "A ansiedade é uma resposta natural do nosso corpo diante de situações desafiadoras. Porém, quando se torna excessiva, pode impactar significativamente nossa qualidade de vida. " +
                        "Neste artigo, exploraremos as principais causas da ansiedade, como ela se manifesta no corpo e, mais importante, apresentaremos estratégias práticas e eficazes para lidar com esses sentimentos. " +
                        "Aprenderemos técnicas de respiração, mindfulness e mudanças de comportamento que podem ajudar você a recuperar o controle e a paz mental. " +
                        "Lembre-se: procurar ajuda profissional é um sinal de força, não de fraqueza.",
                        "Artigos sobre ansiedade, técnicas de relaxamento, autocuidado",
                        "artigo-ansiedade.jpg"
                    ));

                    // Artigo 2 - Bruno Ferreira (Psicanálise)
                    artigos.add(criarArtigo(psicologos.get(1),
                        "O Processo de Luto: Compreendendo as Fases Emocionais",
                        "O luto é uma experiência universal, mas profundamente pessoal. Perdemos pessoas, relacionamentos, e até mesmo partes de nós mesmos em diferentes momentos da vida. " +
                        "Este artigo busca iluminar as fases clássicas do luto - negação, raiva, barganha, depressão e aceitação - ajudando você a compreender melhor o que está sentindo. " +
                        "É importante saber que não há um cronograma 'certo' para o luto, e é completamente normal reviver certas emoções ao longo do tempo. " +
                        "Compartilharemos também estratégias para honrar a memória de quem perdemos e encontrar significado na continuidade de nossas vidas.",
                        "Luto, perda, resiliência emocional, apoio psicológico",
                        "artigo-luto.jpg"
                    ));

                    // Artigo 3 - Carla Souza (Crianças)
                    artigos.add(criarArtigo(psicologos.get(2),
                        "TDAH em Crianças: Sinais, Diagnóstico e Intervenções",
                        "O Transtorno do Déficit de Atenção com Hiperatividade (TDAH) é uma condição neurodesenvolvimental que afeta milhões de crianças em todo o mundo. " +
                        "Como pais e educadores, é fundamental reconhecer os sinais precoces para garantir uma intervenção adequada. " +
                        "Neste artigo, discutiremos os sintomas principais - dificuldade de concentração, impulsividade e hiperatividade - e explicaremos o processo de diagnóstico. " +
                        "Apresentaremos também estratégias práticas para casa e escola, além de orientações sobre as diferentes abordagens terapêuticas disponíveis. " +
                        "Lembre-se: uma criança com TDAH pode ter um desenvolvimento saudável e bem-sucedido com o apoio adequado.",
                        "TDAH, desenvolvimento infantil, educação, estratégias pedagógicas",
                        "artigo-tdah.jpg"
                    ));

                    // Artigo 4 - Carla Mendes (Relacionamentos)
                    artigos.add(criarArtigo(psicologos.get(3),
                        "Comunicação Efetiva em Relacionamentos: A Base para Conexões Saudáveis",
                        "Muitos conflitos relacionais surgem não da falta de amor, mas da falta de comunicação clara e empática. " +
                        "A comunicação efetiva é uma habilidade que pode ser desenvolvida e aperfeiçoada ao longo do tempo. " +
                        "Neste artigo, aprenderemos sobre: escuta ativa, expressão clara de sentimentos, uso de 'eu' em vez de 'você', e estratégias para resolver conflitos construtivamente. " +
                        "Discutiremos também a importância da vulnerabilidade emocional e como criar um espaço seguro para seu parceiro expressar suas necessidades. " +
                        "Relacionamentos saudáveis são construídos dia após dia, através de pequenos atos de compreensão e respeito mútuo.",
                        "Comunicação, relacionamentos, conflitos, empatia, relacionamentos amorosos",
                        "artigo-relacionamentos.jpg"
                    ));

                    // Artigo 5 - Daniel Oliveira (Neuropsicologia)
                    artigos.add(criarArtigo(psicologos.get(4),
                        "Reabilitação Cognitiva Após Lesão Cerebral: Recuperando Funções",
                        "Uma lesão cerebral pode impactar diferentes aspectos da função cognitiva - memória, atenção, linguagem e processamento executivo. " +
                        "A neuropsicologia oferece avaliações detalhadas que nos ajudam a entender exatamente quais funções foram afetadas e qual é o potencial de recuperação. " +
                        "Este artigo explora os princípios da reabilitação cognitiva, que se baseia na neuroplasticidade - a capacidade do cérebro de se reorganizar e criar novas conexões. " +
                        "Apresentaremos exercícios práticos, tecnologias assistivas e a importância do apoio multidisciplinar na jornada de recuperação. " +
                        "A persistência e um plano individualizado são as chaves para otimizar a recuperação neurológica.",
                        "Neuropsicologia, reabilitação, cérebro, recuperação, neuroplasticidade",
                        "artigo-neuropsicologia.jpg"
                    ));

                    // Artigo 6 - Elisa Costa (Transtornos Alimentares)
                    artigos.add(criarArtigo(psicologos.get(5),
                        "Transtornos Alimentares: Uma Abordagem Sistêmica e Compassiva",
                        "Os transtornos alimentares são condições psicológicas complexas que vão muito além de questões nutricionais. " +
                        "Eles frequentemente refletem tentativas de lidar com emoções difíceis, baixa autoestima ou problemas de controle na vida. " +
                        "Uma abordagem sistêmica reconhece que a família, cultura e ambiente desempenham papéis significativos nesses transtornos. " +
                        "Neste artigo, exploraremos a conexão entre corpo e mente, discutiremos fatores de risco e proteção, e apresentaremos estratégias terapêuticas que funcionam. " +
                        "A recuperação é possível quando combinamos tratamento nutricionista, psicológico e apoio familiar com compaixão e paciência.",
                        "Transtornos alimentares, anorexia, bulimia, imagem corporal, saúde mental",
                        "artigo-alimentares.jpg"
                    ));

                    // Artigo 7 - Felipe Martins (Reabilitação)
                    artigos.add(criarArtigo(psicologos.get(6),
                        "Redescubrindo a Autonomia: Terapia Ocupacional e Qualidade de Vida",
                        "A terapia ocupacional vai além de exercícios: trata-se de restaurar a capacidade de uma pessoa realizar atividades significativas do dia a dia. " +
                        "Seja devido a uma lesão, doença crônica ou incapacidade, muitas pessoas enfrentam desafios para manter sua independência e senso de propósito. " +
                        "Neste artigo, descrevemos como a terapia ocupacional funciona, quais atividades são trabalhadas, e como adaptações do ambiente podem fazer uma grande diferença. " +
                        "Compartilhamos histórias de clientes que recuperaram não apenas habilidades, mas também a confiança em suas próprias capacidades. " +
                        "Sua jornada para a autonomia e dignidade é nossa prioridade.",
                        "Terapia ocupacional, reabilitação, autonomia, qualidade de vida, incapacidade",
                        "artigo-ocupacional.jpg"
                    ));

                    // Artigo 8 - Gabriel Ramos (Ansiedade)
                    artigos.add(criarArtigo(psicologos.get(7),
                        "Psicoterapia Breve: Resultados Significativos em Menos Tempo",
                        "Você não precisa de anos de terapia para experimentar mudanças significativas. A psicoterapia breve é uma abordagem focada e eficiente que se concentra em objetivos específicos. " +
                        "Este artigo explora como, em um número menor de sessões, é possível trabalhar os problemas mais urgentes e desenvolver habilidades práticas. " +
                        "Discutiremos técnicas cognitivo-comportamentais, resolução de problemas, e como o terapeuta trabalha colaborativamente com você para estabelecer e alcançar metas. " +
                        "Muitos pacientes encontram que esse formato intensivo e orientado os ajuda a iniciar uma jornada de transformação pessoal. " +
                        "Qualidade supera quantidade quando há clareza de propósito e comprometimento mútuo.",
                        "Psicoterapia breve, terapia cognitivo-comportamental, mindfulness, ansiedade",
                        "artigo-psicoterapia-breve.jpg"
                    ));

                    // Artigo 9 - Helena Mendes (Desenvolvimento e Carreira)
                    artigos.add(criarArtigo(psicologos.get(8),
                        "Orientação Profissional: Encontrando Seu Caminho no Mercado de Trabalho",
                        "A escolha de uma carreira é uma das decisões mais importantes da vida, mas muitas pessoas sentem-se perdidas ou inseguras nesse processo. " +
                        "A orientação profissional não é sobre dizer a você qual trabalho fazer, mas sim ajudá-lo a explorar seus valores, habilidades, interesses e aspirações. " +
                        "Neste artigo, discutiremos como conduzir uma autoavaliação honesta, explorar oportunidades, e navegar transições de carreira com confiança. " +
                        "Também abordaremos ansiedade relacionada ao trabalho, síndrome do impostor, e como construir uma carreira alinhada com seus valores pessoais. " +
                        "Seu trabalho deve alimentar sua alma, não apenas sua conta bancária.",
                        "Orientação profissional, carreira, desenvolvimento pessoal, transição de carreira, escolha profissional",
                        "artigo-carreira.jpg"
                    ));

                    // Configurar todos os artigos como publicados e com engajamento inicial
                    for (int i = 0; i < artigos.size(); i++) {
                        Artigo artigo = artigos.get(i);
                        artigo.setPublicado(true);
                        artigo.setLikes(8 + (i * 3));
                        artigo.setViews(42 + (i * 11));
                    }

                    artigoRepo.saveAll(artigos);
                    System.out.println("Artigos de exemplo criados com sucesso!");
                }
            }

            if (artigoRepo.count() > 0) {
                List<Artigo> artigosExemplo = new ArrayList<>();
                for (Artigo artigo : artigoRepo.findAll()) {
                    int[] engajamento = getEngajamentoInicial(artigo.getImagem());
                    if (engajamento != null && artigo.getLikes() == 0 && artigo.getViews() == 0) {
                        artigo.setLikes(engajamento[0]);
                        artigo.setViews(engajamento[1]);
                        artigosExemplo.add(artigo);
                    }
                }

                if (!artigosExemplo.isEmpty()) {
                    artigoRepo.saveAll(artigosExemplo);
                    System.out.println("Engajamento inicial dos artigos de exemplo atualizado!");
                }
            }

            // Inicializar agendas e prontuários históricos se não existirem
            if (agendaRepo.count() == 0) {
                List<Psicologo> psicologos = psiRepo.findAll();
                List<Paciente> pacientes = pacRepo.findAll();

                if (!psicologos.isEmpty() && !pacientes.isEmpty()) {
                    // Ana Silva = psicologos.get(0)
                    Psicologo ana = psicologos.get(0);

                    // Busca pacientes pelos logins criados
                    Paciente amara = pacientes.stream().filter(p -> "amara".equals(p.getLogin())).findFirst().orElse(null);
                    Paciente lira = pacientes.stream().filter(p -> "lira".equals(p.getLogin())).findFirst().orElse(null);
                    Paciente marcos = pacientes.stream().filter(p -> "marcos_silva".equals(p.getLogin())).findFirst().orElse(null);
                    Paciente carlos = pacientes.stream().filter(p -> "carlos_mat".equals(p.getLogin())).findFirst().orElse(null);
                    Paciente luis = pacientes.stream().filter(p -> "luis_alc".equals(p.getLogin())).findFirst().orElse(null);
                    Paciente heugenia = pacientes.stream().filter(p -> "heugenia".equals(p.getLogin())).findFirst().orElse(null);
                    Paciente marcosSantos = pacientes.stream().filter(p -> "marcos_santos".equals(p.getLogin())).findFirst().orElse(null);

                    LocalDate hoje = LocalDate.now();
                    List<Agenda> agendas = new ArrayList<>();

                    if (amara != null) {
                        agendas.add(criarAgendaRealizada(ana.getId(), amara.getId(), hoje.minusDays(28).toString(), "08:00"));
                        agendas.add(criarAgendaRealizada(ana.getId(), amara.getId(), hoje.minusDays(21).toString(), "09:00"));
                        agendas.add(criarAgendaRealizada(ana.getId(), amara.getId(), hoje.minusDays(14).toString(), "08:00"));
                        // Agenda futura confirmada (Amara = Ativo)
                        agendas.add(criarAgendaFutura(ana.getId(), amara.getId(), hoje.plusDays(7).toString(), "09:00"));
                    }
                    if (lira != null) {
                        agendas.add(criarAgendaRealizada(ana.getId(), lira.getId(), hoje.minusDays(35).toString(), "10:00"));
                        agendas.add(criarAgendaRealizada(ana.getId(), lira.getId(), hoje.minusDays(14).toString(), "10:00"));
                        // Sem futuro = Inativo
                    }
                    if (marcos != null) {
                        // Apenas pendente = Pendente
                        agendas.add(criarAgendaPendente(ana.getId(), marcos.getId(), hoje.plusDays(3).toString(), "14:00"));
                    }
                    if (carlos != null) {
                        agendas.add(criarAgendaRealizada(ana.getId(), carlos.getId(), hoje.minusDays(10).toString(), "15:00"));
                        agendas.add(criarAgendaRealizada(ana.getId(), carlos.getId(), hoje.minusDays(3).toString(), "16:00"));
                        agendas.add(criarAgendaFutura(ana.getId(), carlos.getId(), hoje.plusDays(4).toString(), "15:00"));
                    }
                    if (luis != null) {
                        agendas.add(criarAgendaRealizada(ana.getId(), luis.getId(), hoje.minusDays(60).toString(), "11:00"));
                        // Inativo
                    }
                    if (heugenia != null) {
                        agendas.add(criarAgendaRealizada(ana.getId(), heugenia.getId(), hoje.minusDays(7).toString(), "17:00"));
                        agendas.add(criarAgendaFutura(ana.getId(), heugenia.getId(), hoje.plusDays(14).toString(), "17:00"));
                    }
                    if (marcosSantos != null) {
                        agendas.add(criarAgendaRealizada(ana.getId(), marcosSantos.getId(), hoje.minusDays(45).toString(), "09:00"));
                        // Inativo
                    }

                    agendaRepo.saveAll(agendas);
                    System.out.println("Agendas históricas criadas para Ana Silva!");

                    // Prontuários para as agendas realizadas
                    if (prontuarioRepo.count() == 0) {
                        List<Prontuario> prontuarios = new ArrayList<>();
                        List<Agenda> realizadas = agendaRepo.findByPsicologoId(ana.getId())
                                .stream().filter(a -> "REALIZADO".equals(a.getStatus())).toList();

                        for (int i = 0; i < realizadas.size(); i++) {
                            Agenda ag = realizadas.get(i);
                            Paciente pac = pacientes.stream()
                                    .filter(p -> p.getId().equals(ag.getPacienteId()))
                                    .findFirst().orElse(null);
                            if (pac == null) continue;

                            String nomePac = pac.getNome();
                            Prontuario pr = new Prontuario();
                            pr.setAgendaId(ag.getId());
                            pr.setPsicologoId(ag.getPsicologoId());
                            pr.setPacienteId(ag.getPacienteId());
                            pr.setData(ag.getData());
                            pr.setSessao1(nomePac + " busca acompanhamento psicológico por queixas de ansiedade e dificuldades no ambiente de trabalho. Hipótese inicial: Transtorno de Ansiedade Generalizada.");
                            pr.setSessao2("Demanda centrada em manejo emocional e redução de estresse. Objetivo: desenvolver estratégias de enfrentamento e autoregulação emocional com sessões semanais.");
                            pr.setSessao3("Realizada escuta ativa com abordagem cognitivo-comportamental. Identificados pensamentos automaticos negativos relacionados a desempenho. Proposta de registro de pensamentos diário.");
                            pr.setSessao4("");
                            pr.setRelatorioTecnico("Sessão " + (i + 1) + ": " + nomePac + " demonstrou boa adesao ao processo terapêutico. Relata melhora parcial nas queixas iniciais.");
                            pr.setInformacoesAdicionais(i % 2 == 0 ? "Paciente demonstrou boa adesao às orientações propostas." : "");
                            prontuarios.add(pr);
                        }

                        prontuarioRepo.saveAll(prontuarios);
                        System.out.println("Prontuários históricos criados!");
                    }
                }
            }
        };
    }

    private Artigo criarArtigo(Psicologo psicologo, String titulo, String corpo, String tags, String imagem) {
        Artigo artigo = new Artigo();
        artigo.setTitulo(titulo);
        artigo.setCorpo(corpo);
        artigo.setAutorNome(psicologo.getNome() + " " + psicologo.getSobrenome());
        artigo.setAutorAvatar(psicologo.getImgPerfil());
        artigo.setPsicologoId(psicologo.getId());
        artigo.setImagem(imagem);
        artigo.setPublicado(true);
        artigo.setViews(0);
        artigo.setLikes(0);
        return artigo;
    }

    private int[] getEngajamentoInicial(String imagem) {
        if (imagem == null) {
            return null;
        }

        return switch (imagem) {
            case "artigo-ansiedade.jpg" -> new int[] {18, 126};
            case "artigo-luto.jpg" -> new int[] {14, 114};
            case "artigo-tdah.jpg" -> new int[] {22, 141};
            case "artigo-relacionamentos.jpg" -> new int[] {17, 132};
            case "artigo-neuropsicologia.jpg" -> new int[] {12, 98};
            case "artigo-alimentares.jpg" -> new int[] {15, 109};
            case "artigo-ocupacional.jpg" -> new int[] {11, 87};
            case "artigo-psicoterapia-breve.jpg" -> new int[] {19, 145};
            case "artigo-carreira.jpg" -> new int[] {16, 121};
            default -> null;
        };
    }

    private void gerarHorariosPadrao(HorarioRepository horRepo, String psicologoId) {
        String[] dias = {"Segunda", "Terca", "Quarta", "Quinta", "Sexta"};
        String[] horas = {"08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"};
        
        List<Horario> horarios = new ArrayList<>();
        for (String dia : dias) {
            for (String hora : horas) {
                Horario h = new Horario();
                h.setPsicologoId(psicologoId);
                h.setDiaDaSemana(dia);
                h.setHoraInicio(hora);
                int hourInt = Integer.parseInt(hora.split(":")[0]);
                h.setHoraFim(String.format("%02d:00", hourInt + 1));
                h.setDisponivel(true);
                horarios.add(h);
            }
        }
        horRepo.saveAll(horarios);
    }

    private Paciente createPaciente(String login, String senha, String email, String nome, String sobrenome,
                                    String genero, String dtNascimento, String telefone, String cep, String cidade, String uf, String cpf, String imgPerfil) {
        Paciente p = new Paciente();
        p.setLogin(login);
        p.setSenha(passwordEncoder.encode(senha));
        p.setEmail(email);
        p.setNome(nome);
        p.setSobrenome(sobrenome);
        p.setGenero(genero);
        p.setDtNascimento(LocalDate.parse(dtNascimento));
        p.setTelefone(telefone);
        p.setCep(cep);
        p.setCidade(cidade);
        p.setUf(uf);
        p.setCpf(cpf);
        p.setEndereco(cidade + " - " + uf);
        p.setImgPerfil(imgPerfil);
        return p;
    }

    private Psicologo createPsicologo(String login, String senha, String email, String nome, String sobrenome,
                                    String genero, String dtNascimento, String telefone, String cep, String cidade, String uf, 
                                    String imgPerfil, String crp, String cpf, List<String> especialidades, String sobreMim) {
        Psicologo p = new Psicologo();
        p.setLogin(login);
        p.setSenha(passwordEncoder.encode(senha));
        p.setEmail(email);
        p.setNome(nome);
        p.setSobrenome(sobrenome);
        p.setGenero(genero);
        p.setDtNascimento(LocalDate.parse(dtNascimento));
        p.setTelefone(telefone);
        p.setCep(cep);
        p.setCidade(cidade);
        p.setUf(uf);
        p.setEndereco(cidade + " - " + uf);
        p.setImgPerfil(imgPerfil);
        p.setCrp(crp);
        p.setCpf(cpf);
        p.setEspecialidades(especialidades);
        p.setSobreMim(sobreMim);
        return p;
    }

    private Agenda criarAgendaRealizada(String psicologoId, String pacienteId, String data, String hora) {
        Agenda a = new Agenda();
        a.setPsicologoId(psicologoId);
        a.setPacienteId(pacienteId);
        a.setData(data);
        a.setHoraInicio(hora);
        a.setDiaDaSemana("Segunda");
        a.setStatus("REALIZADO");
        return a;
    }

    private Agenda criarAgendaFutura(String psicologoId, String pacienteId, String data, String hora) {
        Agenda a = new Agenda();
        a.setPsicologoId(psicologoId);
        a.setPacienteId(pacienteId);
        a.setData(data);
        a.setHoraInicio(hora);
        a.setDiaDaSemana("Segunda");
        a.setStatus("CONFIRMADO");
        return a;
    }

    private Agenda criarAgendaPendente(String psicologoId, String pacienteId, String data, String hora) {
        Agenda a = new Agenda();
        a.setPsicologoId(psicologoId);
        a.setPacienteId(pacienteId);
        a.setData(data);
        a.setHoraInicio(hora);
        a.setDiaDaSemana("Segunda");
        a.setStatus("PENDENTE");
        return a;
    }
}