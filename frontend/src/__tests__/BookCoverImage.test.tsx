import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BookCoverImage from '../components/books/BookCoverImage';

describe('BookCoverImage', () => {
  it('renders an img when coverImageUrl is provided', () => {
    render(<BookCoverImage coverImageUrl="https://example.com/cover.jpg" title="Test Book" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/cover.jpg');
    expect(img).toHaveAttribute('alt', 'Test Book');
  });

  it('renders placeholder when coverImageUrl is null', () => {
    render(<BookCoverImage coverImageUrl={null} title="Test Book" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('📖')).toBeInTheDocument();
  });

  it('renders placeholder after image load error', () => {
    render(<BookCoverImage coverImageUrl="https://example.com/broken.jpg" title="Test Book" />);
    fireEvent.error(screen.getByRole('img'));
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('📖')).toBeInTheDocument();
  });
});
