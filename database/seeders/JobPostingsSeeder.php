<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class JobPostingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call(JobPostingsSeeder::class);

        $now = Carbon::now();

        DB::table('job_postings')->insert([
            [
                'company_id' => 1,
                'title' => 'Backend Developer',
                'description' => 'Responsável por desenvolver e manter APIs REST em Node.js e Laravel.',
                'location' => 'Maputo',
                'type' => 'full-time',
                'perks' => 'Seguro de saúde, bônus anual, horário flexível',
                'published_at' => '2025-08-29 09:00:00',
                'expires_at' => '2025-10-29 09:00:00',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'company_id' => 2,
                'title' => 'UI/UX Designer',
                'description' => 'Criação de protótipos e experiências visuais para aplicações web e mobile.',
                'location' => 'Beira',
                'type' => 'contract',
                'perks' => 'Trabalho remoto, workshops, plano de carreira',
                'published_at' => '2025-08-29 10:00:00',
                'expires_at' => '2025-09-30 10:00:00',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'company_id' => 3,
                'title' => 'Project Manager',
                'description' => 'Gestão de projetos ágeis com foco em tecnologia e inovação.',
                'location' => 'Nampula',
                'type' => 'full-time',
                'perks' => 'Subsídio de transporte, seguro de vida, treinamentos',
                'published_at' => '2025-08-29 11:00:00',
                'expires_at' => '2025-11-15 11:00:00',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'company_id' => 4,
                'title' => 'Marketing Specialist',
                'description' => 'Planejamento e execução de campanhas digitais em redes sociais.',
                'location' => 'Tete',
                'type' => 'part-time',
                'perks' => 'Comissões atrativas, bônus por metas alcançadas',
                'published_at' => '2025-08-29 12:00:00',
                'expires_at' => '2025-10-15 12:00:00',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'company_id' => 5,
                'title' => 'Technical Support',
                'description' => 'Atendimento a clientes, resolução de problemas técnicos e suporte remoto.',
                'location' => 'Quelimane',
                'type' => 'full-time',
                'perks' => 'Ambiente colaborativo, plano de saúde, capacitações',
                'published_at' => '2025-08-29 14:00:00',
                'expires_at' => '2025-10-29 14:00:00',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'company_id' => 6,
                'title' => 'Estágio em Desenvolvimento Frontend',
                'description' => 'Apoiar a equipe de desenvolvimento na criação de interfaces em React e HTML/CSS.',
                'location' => 'Maputo',
                'type' => 'internship',
                'perks' => 'Certificado de estágio, orientação profissional',
                'published_at' => '2025-08-29 15:00:00',
                'expires_at' => '2025-11-29 15:00:00',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'company_id' => 7,
                'title' => 'Estágio em Marketing Digital',
                'description' => 'Auxiliar na criação de campanhas digitais e análise de métricas.',
                'location' => 'Beira',
                'type' => 'internship',
                'perks' => 'Certificado de estágio, treinamentos online',
                'published_at' => '2025-08-29 16:00:00',
                'expires_at' => '2025-11-29 16:00:00',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'company_id' => 8,
                'title' => 'Estágio em Suporte Técnico',
                'description' => 'Dar suporte a usuários internos, manutenção de hardware e software.',
                'location' => 'Nampula',
                'type' => 'internship',
                'perks' => 'Certificado de estágio, possibilidade de efetivação',
                'published_at' => '2025-08-29 17:00:00',
                'expires_at' => '2025-11-29 17:00:00',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}
