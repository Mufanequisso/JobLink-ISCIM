// src/pages/JobForm.tsx
import React, { useState } from 'react';
import axios from 'axios';

const JobForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/jobs', { title, company, description, type });
      alert('Vaga criada com sucesso!');
      setTitle(''); setCompany(''); setDescription(''); setType('');
    } catch (error) {
      console.error('Erro ao criar vaga:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Criar Vaga</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} className="border p-2 rounded"/>
        <input type="text" placeholder="Empresa" value={company} onChange={e => setCompany(e.target.value)} className="border p-2 rounded"/>
        <textarea placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} className="border p-2 rounded"/>
        <input type="text" placeholder="Tipo (Estágio / Emprego)" value={type} onChange={e => setType(e.target.value)} className="border p-2 rounded"/>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Criar Vaga</button>
      </form>
    </div>
  );
};

export default JobForm;
