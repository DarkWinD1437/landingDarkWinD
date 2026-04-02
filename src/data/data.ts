export const data = {
    name: 'Darwin Vigabriel',
    fullName: 'Darwin Israel Vigabriel Cordova',
    title: 'Ingeniero en Sistemas · FullStack Developer · IA',
    heroPhrase: 'Código que piensa, interfaces que conectan.',
    url: 'https://github.com/DarkWinD1437',
    description: 'Ingeniero en Sistemas y Desarrollador FullStack especializado en soluciones web modernas, arquitecturas backend robustas e integración de IA.',
    bio: [
        'Una es hacer las cosas y otra es hacer las cosas bien.',
        'Nunca puede estar algo bien, siempre hay que ver hasta dónde no se encuentra el límite.',
        'Siempre explorando tecnologías emergentes — especialmente IA — y buscando cómo integrarlas en soluciones reales.'
    ],
    links: {
        github: 'https://github.com/DarkWinD1437',
        linkedin: 'https://www.linkedin.com/in/darwin-israel-vigabriel-cordova',
        email: 'vigabriel.darwin@hotmail.com',
    },
    skills: [
        {
            id: 'skill-frontend',
            category: 'Frontend',
            iconBg: 'from-indigo-600 to-indigo-500',
            items: ['React', 'Vite', 'TypeScript', 'JavaScript', 'Handlebars']
        },
        {
            id: 'skill-backend',
            category: 'Backend',
            iconBg: 'from-pink-600 to-pink-500',
            items: ['NestJS', 'Express.js', 'Python', 'Django', 'FastAPI']
        },
        {
            id: 'skill-db',
            category: 'Bases de datos',
            iconBg: 'from-emerald-600 to-emerald-500',
            items: ['PostgreSQL', 'MySQL', 'SQL Server']
        },
        {
            id: 'skill-devops',
            category: 'DevOps & Cloud',
            iconBg: 'from-orange-600 to-orange-500',
            items: ['Docker', 'Kubernetes', 'Jenkins', 'Podman']
        }
    ],
    experience: [
        {
            id: 'exp-nexus',
            role: 'Desarrollador de Software',
            company: 'Nexus',
            period: 'Oct 2025 – Presente',
            description: 'Desarrollo de soluciones de software a medida, implementando arquitecturas modernas y buenas prácticas de ingeniería.'
        },
        {
            id: 'exp-uagrm',
            role: 'Docente CUP',
            company: 'UAGRM',
            period: '2025',
            description: 'Docente del Curso Preuniversitario de la Universidad Autónoma Gabriel René Moreno.'
        },
        {
            id: 'exp-consultor',
            role: 'Consultor TI',
            company: 'Independiente',
            period: 'Mar 2022 – Presente',
            description: 'Consultoría tecnológica para empresas y proyectos, asesorando en arquitectura, desarrollo e integración de sistemas.'
        }
    ],
    education: [
        {
            id: 'edu-sistemas',
            title: 'Ingeniería en Sistemas',
            institution: 'Universidad Autónoma Gabriel René Moreno',
            year: 'Concluida · Pendiente diplomado',
            type: 'Licenciatura'
        },
        {
            id: 'edu-operador',
            title: 'Operador en Sistemas Empresariales',
            institution: 'Universidad Autónoma Gabriel René Moreno',
            year: 'Nov 2024',
            type: 'Técnico Superior'
        }
    ]
}

export type Data = typeof data;
