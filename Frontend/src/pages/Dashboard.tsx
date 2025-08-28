// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import JobCard from '../components/JobCard';
import FilterBar from '../components/FilterBar';
import Navbar from '../components/Navbar';
import axios from 'axios';
import '../styles/Dashboard.css';

interface Job {
  id: number;
  title: string;
  company: { id: number; name: string; website: string; email: string; description: string };
  type: string;
  location: string;
}

// Dados do carousel com imagens
const carouselItems = [
  {
    id: 1,
    title: "Conecte-se com o mercado de emprego",
    description: "Encontre oportunidades perto de você e conecte-se com empresas locais.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    title: "Cadastre-se e receba alertas",
    description: "Mantenha-se atualizado com novas vagas e oportunidades na sua área.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    title: "Mostre seu talento",
    description: "Crie seu perfil e destaque suas habilidades para empresas da sua região.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    title: "Diversas oportunidades",
    description: "Encontre vagas em diferentes áreas e níveis de experiência.",
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    title: "Networking profissional",
    description: "Conecte-se com outros profissionais e expanda sua rede de contatos.",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  }
];

const Dashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/jobs')
      .then(res => {
        if (Array.isArray(res.data.data)) {
          const jobsWithLocation = res.data.data.map((job: any) => ({
            ...job,
            location: job.location || 'Não especificado',
          }));
          setJobs(jobsWithLocation);
        } else {
          console.error('Resposta da API inesperada:', res.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  // Efeito para rotacionar automaticamente o carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const filteredJobs = Array.isArray(jobs)
    ? jobs.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const handleShowLess = () => {
    setVisibleCount(prev => Math.max(6, prev - 6));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (isLoading) {
    return (
      <div className="loading-container pt-20 flex flex-col items-center justify-center min-h-screen">
        <div className="loading-spinner w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
        <div className="loading-text text-gray-700 text-lg font-medium">Carregando vagas...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      
      {/* Espaço para a navbar fixa */}
      <div className="navbar-spacer"></div>

      <div className="main-content">
        {/* ===== CAROUSEL COM FOTOS ===== */}
        <div className="carousel-container">
          <div className="carousel-slide" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {carouselItems.map((item, index) => (
              <div key={item.id} className="carousel-item">
                <div 
                  className="carousel-image"
                  style={{ backgroundImage: `url(${item.image})` }}
                >
                  <div className="carousel-overlay"></div>
                  <div className="carousel-content">
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Controles do carousel */}
          <button className="carousel-prev" onClick={prevSlide}>‹</button>
          <button className="carousel-next" onClick={nextSlide}>›</button>
          
          {/* Indicadores */}
          <div className="carousel-indicators">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>

        <div className="dashboard-container pt-8">
          <FilterBar search={search} setSearch={setSearch} />

          {filteredJobs.length === 0 ? (
            <div className="no-jobs-message">
              <div className="no-jobs-icon">🔍</div>
              <p>Nenhuma vaga encontrada.</p>
            </div>
          ) : (
            <>
              <div className="jobs-grid">
                {filteredJobs.slice(0, visibleCount).map((job, index) => (
                  <div
                    key={job.id}
                    className="job-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <JobCard
                      title={job.title}
                      company={job.company.name}
                      type={job.type}
                      location={job.location}
                    />
                  </div>
                ))}
              </div>

              <div className="buttons-container">
                {visibleCount < filteredJobs.length && (
                  <button className="show-more-btn" onClick={handleShowMore}>
                    Ver mais
                  </button>
                )}
                
                {visibleCount > 6 && (
                  <button className="show-less-btn" onClick={handleShowLess}>
                    Ver menos
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;