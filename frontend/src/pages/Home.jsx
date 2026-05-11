import SearchSection from "../components/homepage/SearchSection";
import AreaCards from "../components/homepage/AreaCards";
import VerPsi from "../components/popups/Verpsi";
import ActiveFilters from "../components/homepage/ActiveFilters";
import SkipNavigation from "../components/SkipNavigation";
import { useState, useEffect } from "react";
import { usePsicologos } from "../context/Psicologos";
import { agendar } from "../services/agendaService.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import '../assets/styles/home/filtros-home.css';
import '../assets/styles/home/card-psicologo.css';

export default function Home() {
  const { isPsicologo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPsicologo) {
      navigate("/artigos", { replace: true });
    }
  }, [isPsicologo, navigate]);

  // Filtros
  const [selectedSpecialities, setSelectedSpecialities] = useState([]);
  const [selectedLocals, setSelectedLocals] = useState([]);
  const [visualizacao, setVisualizacao] = useState("col");
  const [selectedDays, setSelectedDays] = useState([]);
  const [searchText, setSearchText] = useState(""); // Texto de busca
  // Cards
  const [openPsi, setOpenPsi] = useState(false);
  const [selectedPerfil, setSelectedPerfil] = useState(null);

  const { psicologos, loading, error, recarregar } = usePsicologos();

  // Ao montar a Home, se a lista estiver vazia (erro ou fetch falhou antes do backend subir),
  // tenta buscar os dados de novo. O [] garante que só roda uma vez por montagem.
  useEffect(() => {
    if (!loading && (error || psicologos.length === 0)) {
      recarregar();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Mapear os dados dos psicólogos
  const perfis = (psicologos || []).map(p => ({
      id: p.id,
      nome: p.nome,
      idade: p.idade,
      local: p.local,
      tags: p.tags || [],
      foto: p.foto || null,
      horarios: p.horarios || {},
      // Dados extras disponíveis
      email: p.email,
      telefone: p.telefone,
      genero: p.genero,
      crp: p.crp,
      sobreMim: p.sobreMim
  }));

  // Extrair locais únicos dos perfis
  const locais = [...new Set(perfis.map(perfil => perfil.local))];

  // Aplicar filtros
  const perfisFiltrados = perfis.filter(perfil => {

    // Pesquisa
    const matchTexto =
        searchText.trim() === "" ||
        perfil.nome.toLowerCase().includes(searchText.toLowerCase()) ||
        perfil.local.toLowerCase().includes(searchText.toLowerCase()) ||
        perfil.tags.some(tag =>
            tag.toLowerCase().includes(searchText.toLowerCase())
        );

    // Especialidade
    const matchEspecialidade =
        selectedSpecialities.length === 0 ||
        perfil.tags.some(tag =>
            selectedSpecialities.includes(tag)
        );

    // Local
    const matchLocal =
        selectedLocals.length === 0 ||
        selectedLocals.includes(perfil.local);

    // Semana
    const matchDias =
        selectedDays.length === 0 ||
        selectedDays.some(dia =>
            Object.keys(perfil.horarios || {}).includes(dia)
        );

    return (
        matchTexto &&
        matchEspecialidade &&
        matchLocal &&
        matchDias 
    );
});

  const handleAgendamento = async (dados) => { // Guardar agendamento feito
    try{

      await agendar({
        ...dados,
        psicologoId: selectedPerfil.id
      });

    } catch (err) {
      toast.error(err.message || "Erro ao realizar agendamento")
    }
  }

  // Exibir estado de carregamento
  if (loading) {
    return (
      <>
        <SkipNavigation mainContent="sectionHome" />
        <SearchSection 
          selectedSpecialities={selectedSpecialities}
          setSelectedSpecialities={setSelectedSpecialities}
          selectedLocals={selectedLocals}
          setSelectedLocals={setSelectedLocals}
          locais={locais}
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
          visualizacao={visualizacao}
          setVisualizacao={setVisualizacao}
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          fontSize: '1.1rem',
          color: '#666' 
        }}>
          Carregando psicólogos...
        </div>
      </>
    );
  }

  // Exibir erro se houver
  if (error) {
    return (
      <>
        <SkipNavigation mainContent="sectionHome" />
        <SearchSection 
          selectedSpecialities={selectedSpecialities}
          setSelectedSpecialities={setSelectedSpecialities}
          selectedLocals={selectedLocals}
          setSelectedLocals={setSelectedLocals}
          locais={locais}
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
          visualizacao={visualizacao}
          setVisualizacao={setVisualizacao}
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          fontSize: '1.1rem',
          color: '#d32f2f' 
        }}>
          Erro ao carregar psicólogos: {error}
        </div>
      </>
    );
  }

  return (
    <>
      <SkipNavigation mainContent="sectionHome" />
      <SearchSection 
        selectedSpecialities={selectedSpecialities}
        setSelectedSpecialities={setSelectedSpecialities}
        selectedLocals={selectedLocals}
        setSelectedLocals={setSelectedLocals}
        locais={locais}
        selectedDays={selectedDays}
        setSelectedDays={setSelectedDays}
        visualizacao={visualizacao}
        setVisualizacao={setVisualizacao}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <AreaCards
        perfis={perfisFiltrados} 
        setSelectedPerfil={setSelectedPerfil} 
        setOpenPsi={setOpenPsi}
        visualizacao={visualizacao}
      />
      {openPsi && selectedPerfil && (
          <VerPsi
              open={openPsi}
              close={() => setOpenPsi(false)}
              perfil={selectedPerfil}
              modo="marcar"
              onConfirm={handleAgendamento}
          />
      )}
    </>
  );
}