// src/pages/JobDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  type: string;
}

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const res = await axios.get<Job>(`http://localhost:8000/api/jobs/${id}`);
      setJob(res.data);
    } catch (error) {
      console.error('Erro ao buscar vaga:', error);
    }
  };

  const handleApply = async () => {
    try {
      await axios.post(`http://localhost:8000/api/applications`, { job_id: id });
      alert('Candidatura enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao candidatar-se:', error);
    }
  };

  if (!job) return <p>Carregando...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
      <p className="text-gray-600 mb-2">{job.company}</p>
      <p className="mb-4"><strong>Tipo:</strong> {job.type}</p>
      <p className="mb-6">{job.description}</p>
      <button 
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={handleApply}
      >
        Candidatar-se
      </button>
    </div>
  );
};

export default JobDetails;
