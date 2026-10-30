document.addEventListener('DOMContentLoaded', () => {
  const yearNode = document.querySelector('[data-year]');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('is-open');
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => mainNav.classList.remove('is-open'));
    });
  }

  const loadGitHubProjects = async () => {
    const container = document.querySelector('#github-projects');
    if (!container) return;

    const curatedProjects = [
      {
        repo: 'Cezec',
        name: 'Cezec',
        description: 'Casa Espiritual Zé Corisco — site institucional com divulgação da casa, atividades espirituais, informações e contato.',
        language: 'HTML',
        html_url: 'https://github.com/MorbidGuy/Cezec',
        featured: true
      },
      {
        repo: 'RNR-Automotivo',
        name: 'RNR Automotivo',
        description: 'Sistema de gestão automotiva em Python com Streamlit e Pandas para controle financeiro, serviços e operação da oficina.',
        language: 'Python',
        html_url: 'https://github.com/MorbidGuy/RNR-Automotivo'
      },
      {
        repo: 'Yukkita',
        name: 'Yukkita',
        description: 'Bot para League of Legends em Python para organizar times, jogadores, feedbacks e gestão da comunidade.',
        language: 'Python',
        html_url: 'https://github.com/MorbidGuy/Yukkita'
      },
      {
        repo: 'nexus_sla',
        name: 'Nexus SLA',
        description: 'Aplicação PHP 8.2 para controle de demandas, SLA e deploy em Render/Railway com Docker.',
        language: 'PHP',
        html_url: 'https://github.com/MorbidGuy/nexus_sla'
      }
    ];

    try {
      const repos = await Promise.all(
        curatedProjects.map(async (project) => {
          const response = await fetch(`https://api.github.com/repos/MorbidGuy/${project.repo}`, {
            headers: { Accept: 'application/vnd.github+json' }
          });

          if (!response.ok) {
            return project;
          }

          const repoData = await response.json();

          return {
            ...project,
            name: repoData.name || project.name,
            description: repoData.description || project.description,
            language: repoData.language || project.language,
            stargazers_count: repoData.stargazers_count || 0,
            html_url: repoData.html_url || project.html_url
          };
        })
      );

      const visibleRepos = repos.filter(Boolean);

      if (!visibleRepos.length) {
        throw new Error('Nenhum repositório encontrado');
      }

      container.innerHTML = visibleRepos.map((repo) => `
        <article class="project-card ${repo.featured ? 'featured' : ''}">
          <div class="project-top">
            <span class="project-tag">${repo.featured ? 'Destaque' : (repo.language || 'Code')}</span>
            <span class="project-stars">★ ${repo.stargazers_count || 0}</span>
          </div>
          <h3>${repo.name}</h3>
          <p>${repo.description || 'Projeto em desenvolvimento com foco em tecnologia, automação e soluções digitais.'}</p>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">Ver no GitHub <span>↗</span></a>
        </article>
      `).join('');
    } catch (error) {
      container.innerHTML = curatedProjects.map((repo) => `
        <article class="project-card ${repo.featured ? 'featured' : ''}">
          <div class="project-top">
            <span class="project-tag">${repo.featured ? 'Destaque' : repo.language}</span>
            <span class="project-stars">GitHub</span>
          </div>
          <h3>${repo.name}</h3>
          <p>${repo.description}</p>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">Ver GitHub <span>↗</span></a>
        </article>
      `).join('');
    }
  };

  loadGitHubProjects();

  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const name = formData.get('name')?.toString().trim() || 'Cliente';
      const service = formData.get('service')?.toString().trim() || 'solução tecnológica';
      const message = formData.get('message')?.toString().trim() || 'Gostaria de falar sobre um projeto.';

      const whatsappText = encodeURIComponent(
        `Olá João!\n\nMeu nome é ${name}.\nPreciso de ajuda com: ${service}.\n\nMensagem: ${message}`
      );

      window.open(`https://wa.me/5511967765437?text=${whatsappText}`, '_blank', 'noopener,noreferrer');
      form.reset();
    });
  }
});
