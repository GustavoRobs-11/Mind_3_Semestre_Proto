const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Criar diretório se não existir
const uploadsDir = path.join(__dirname, 'backend', 'src', 'main', 'resources', 'static', 'images', 'articles');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Definir artigos com suas cores temáticas
const articles = [
    {
        filename: 'artigo-ansiedade.jpg',
        title: 'Ansiedade',
        color: '#6B5B95', // Roxo para ansiedade
        gradient: 'linear-gradient(135deg, #6B5B95 0%, #88B0D3 100%)'
    },
    {
        filename: 'artigo-luto.jpg',
        title: 'Luto',
        color: '#4A4A4A', // Cinza escuro para luto
        gradient: 'linear-gradient(135deg, #4A4A4A 0%, #6D6D6D 100%)'
    },
    {
        filename: 'artigo-tdah.jpg',
        title: 'TDAH',
        color: '#FF6B6B', // Vermelho para energia/hiperatividade
        gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)'
    },
    {
        filename: 'artigo-relacionamentos.jpg',
        title: 'Relacionamentos',
        color: '#FF6B9D', // Rosa para relacionamentos
        gradient: 'linear-gradient(135deg, #FF6B9D 0%, #FFB3C1 100%)'
    },
    {
        filename: 'artigo-neuropsicologia.jpg',
        title: 'Neuropsicologia',
        color: '#4ECDC4', // Azul-verde para cérebro
        gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)'
    },
    {
        filename: 'artigo-alimentares.jpg',
        title: 'Saúde',
        color: '#95E1D3', // Verde claro para saúde
        gradient: 'linear-gradient(135deg, #95E1D3 0%, #38ADA9 100%)'
    },
    {
        filename: 'artigo-ocupacional.jpg',
        title: 'Autonomia',
        color: '#F4A261', // Laranja para energia
        gradient: 'linear-gradient(135deg, #F4A261 0%, #E76F51 100%)'
    },
    {
        filename: 'artigo-psicoterapia-breve.jpg',
        title: 'Psicoterapia',
        color: '#2A9D8F', // Verde escuro para terapia
        gradient: 'linear-gradient(135deg, #2A9D8F 0%, #264653 100%)'
    },
    {
        filename: 'artigo-carreira.jpg',
        title: 'Carreira',
        color: '#E9C46A', // Amarelo para futuro
        gradient: 'linear-gradient(135deg, #E9C46A 0%, #F4A261 100%)'
    }
];

async function generateImages() {
    console.log('🎨 Gerando imagens dos artigos...\n');
    
    for (const article of articles) {
        try {
            // Criar SVG com gradiente e texto
            const svgImage = `
                <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:${getColor1(article.color)};stop-opacity:1" />
                            <stop offset="100%" style="stop-color:${getColor2(article.color)};stop-opacity:1" />
                        </linearGradient>
                        <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)"/>
                        </pattern>
                    </defs>
                    <rect width="1200" height="630" fill="url(#grad)"/>
                    <rect width="1200" height="630" fill="url(#pattern)"/>
                    <rect x="50" y="50" width="1100" height="530" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2" rx="20"/>
                    <text x="600" y="300" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">
                        ${article.title}
                    </text>
                    <text x="600" y="400" font-family="Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.8)" text-anchor="middle">
                        Artigos de Psicologia
                    </text>
                </svg>
            `;

            const outputPath = path.join(uploadsDir, article.filename);
            
            // Converter SVG para JPEG
            await sharp(Buffer.from(svgImage))
                .jpeg({ quality: 90, progressive: true })
                .toFile(outputPath);
                
            console.log(`✅ ${article.filename}`);
        } catch (error) {
            console.error(`❌ Erro ao gerar ${article.filename}:`, error.message);
        }
    }
    
    console.log('\n✨ Imagens geradas com sucesso!');
    console.log(`📁 Localização: ${uploadsDir}`);
}

function getColor1(baseColor) {
    const colors = {
        '#6B5B95': '#6B5B95',
        '#4A4A4A': '#5C6B7C',
        '#FF6B6B': '#FF8A80',
        '#FF6B9D': '#FF8AB5',
        '#4ECDC4': '#5FD4C7',
        '#95E1D3': '#A8E6D5',
        '#F4A261': '#F5B878',
        '#2A9D8F': '#3FB8A0',
        '#E9C46A': '#EDD07C'
    };
    return colors[baseColor] || baseColor;
}

function getColor2(baseColor) {
    const colors = {
        '#6B5B95': '#88B0D3',
        '#4A4A4A': '#6D6D6D',
        '#FF6B6B': '#FFE66D',
        '#FF6B9D': '#FFB3C1',
        '#4ECDC4': '#44A08D',
        '#95E1D3': '#38ADA9',
        '#F4A261': '#E76F51',
        '#2A9D8F': '#264653',
        '#E9C46A': '#F4A261'
    };
    return colors[baseColor] || baseColor;
}

generateImages().catch(console.error);
