import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CustomButton } from '@/components/custom/CustomButton';

describe('CustomButton', () => {
  it('renders its children', () => {
    render(<CustomButton>Save</CustomButton>);
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('shows a loading spinner when isLoading is true', () => {
    const { container } = render(<CustomButton isLoading>Save</CustomButton>);
    // Loader2Icon renders an animated SVG.
    expect(container.querySelector('svg.animate-spin')).toBeInTheDocument();
  });

  it('does not render a spinner by default', () => {
    const { container } = render(<CustomButton>Save</CustomButton>);
    expect(container.querySelector('svg.animate-spin')).toBeNull();
  });

  it('respects the disabled prop', () => {
    render(<CustomButton disabled>Save</CustomButton>);
    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
  });

  it('forwards click handlers', async () => {
    const onClick = vi.fn();
    render(<CustomButton onClick={onClick}>Save</CustomButton>);
    screen.getByRole('button', { name: /save/i }).click();
    expect(onClick).toHaveBeenCalledOnce();
  });
});
