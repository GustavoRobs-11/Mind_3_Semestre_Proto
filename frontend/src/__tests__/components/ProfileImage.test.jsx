import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProfileImage from '../../components/common/ProfileImage';

describe('ProfileImage Component', () => {
  it('deve renderizar com a url padrão se nenhum src for fornecido', () => {
    render(<ProfileImage />);
    const img = screen.getByRole('img');
    
    // A função getImageUrl retorna /api/images/default quando não tem src
    expect(img.src).toContain('/api/images/default');
  });

  it('deve renderizar com a url correta quando src é fornecido', () => {
    render(<ProfileImage src="foto_usuario.png" alt="Foto teste" />);
    const img = screen.getByRole('img');
    
    expect(img.src).toContain('/api/images/foto_usuario.png');
    expect(img.alt).toBe('Foto teste');
  });

  it('deve alterar para a imagem padrão quando ocorre erro no carregamento (fallback)', () => {
    render(<ProfileImage src="invalida.png" />);
    const img = screen.getByRole('img');
    
    // Verifica se a imagem inicialmente aponta para invalida.png
    expect(img.src).toContain('invalida.png');
    
    // Simula erro de carregamento da imagem (onError)
    fireEvent.error(img);
    
    // Deve ter ativado a proteção e voltado para a imagem padrão do servidor
    expect(img.src).toContain('/api/images/default');
  });
});
