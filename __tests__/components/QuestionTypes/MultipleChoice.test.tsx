import { render, screen, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import MultipleChoice from '@/components/QuestionTypes/MultipleChoice';

// Helper function to render with MantineProvider
const renderWithMantine = (ui: React.ReactElement) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

const mockOptions = ['Option 1', 'Option 2', 'Option 3'];

describe('MultipleChoice - List Variant', () => {
  it('should render all options as radio buttons', () => {
    const mockOnChange = jest.fn();
    renderWithMantine(
      <MultipleChoice
        options={mockOptions}
        value={null}
        onChange={mockOnChange}
        variant="list"
      />
    );

    mockOptions.forEach((option) => {
      expect(screen.getByLabelText(option)).toBeInTheDocument();
    });
  });

  it('should call onChange when an option is selected', () => {
    const mockOnChange = jest.fn();
    renderWithMantine(
      <MultipleChoice
        options={mockOptions}
        value={null}
        onChange={mockOnChange}
        variant="list"
      />
    );

    const radio = screen.getByLabelText('Option 2');
    fireEvent.click(radio);

    expect(mockOnChange).toHaveBeenCalledWith('Option 2');
  });

  it('should show the selected option as checked', () => {
    const mockOnChange = jest.fn();
    renderWithMantine(
      <MultipleChoice
        options={mockOptions}
        value="Option 1"
        onChange={mockOnChange}
        variant="list"
      />
    );

    const radio = screen.getByLabelText('Option 1') as HTMLInputElement;
    expect(radio.checked).toBe(true);
  });

  it('should display error message when provided', () => {
    const mockOnChange = jest.fn();
    renderWithMantine(
      <MultipleChoice
        options={mockOptions}
        value={null}
        onChange={mockOnChange}
        variant="list"
        error="This field is required"
      />
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should use list variant by default when variant is not specified', () => {
    const mockOnChange = jest.fn();
    renderWithMantine(
      <MultipleChoice options={mockOptions} value={null} onChange={mockOnChange} />
    );

    // List variant renders Radio components, check for radio role
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
  });
});

describe('MultipleChoice - Cards Variant', () => {
  it('should render all options as clickable cards', () => {
    const mockOnChange = jest.fn();
    renderWithMantine(
      <MultipleChoice
        options={mockOptions}
        value={null}
        onChange={mockOnChange}
        variant="cards"
      />
    );

    mockOptions.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('should call onChange when a card is clicked', () => {
    const mockOnChange = jest.fn();
    renderWithMantine(
      <MultipleChoice
        options={mockOptions}
        value={null}
        onChange={mockOnChange}
        variant="cards"
      />
    );

    const card = screen.getByText('Option 2');
    fireEvent.click(card);

    expect(mockOnChange).toHaveBeenCalledWith('Option 2');
  });

  it('should visually highlight the selected card', () => {
    const mockOnChange = jest.fn();
    renderWithMantine(
      <MultipleChoice
        options={mockOptions}
        value="Option 1"
        onChange={mockOnChange}
        variant="cards"
      />
    );

    const selectedCard = screen.getByText('Option 1').closest('div[class*="Paper"]');
    expect(selectedCard).toHaveStyle({
      borderWidth: '2px',
    });
  });

  it('should handle hover interactions on unselected cards', () => {
    const mockOnChange = jest.fn();
    renderWithMantine(
      <MultipleChoice
        options={mockOptions}
        value="Option 1"
        onChange={mockOnChange}
        variant="cards"
      />
    );

    const unselectedCard = screen.getByText('Option 2').closest('div[class*="Paper"]');

    // Mouse enter
    if (unselectedCard) {
      fireEvent.mouseEnter(unselectedCard);
      expect(unselectedCard.style.borderColor).toBe('var(--mantine-color-gray-4)');

      // Mouse leave
      fireEvent.mouseLeave(unselectedCard);
      expect(unselectedCard.style.borderColor).toBe('var(--mantine-color-gray-3)');
    }
  });

  it('should display error message in cards variant', () => {
    const mockOnChange = jest.fn();
    renderWithMantine(
      <MultipleChoice
        options={mockOptions}
        value={null}
        onChange={mockOnChange}
        variant="cards"
        error="Please select an option"
      />
    );

    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('should not apply hover styles to selected card', () => {
    const mockOnChange = jest.fn();
    renderWithMantine(
      <MultipleChoice
        options={mockOptions}
        value="Option 1"
        onChange={mockOnChange}
        variant="cards"
      />
    );

    const selectedCard = screen.getByText('Option 1').closest('div[class*="Paper"]');

    if (selectedCard) {
      const initialBorderColor = selectedCard.style.borderColor;

      fireEvent.mouseEnter(selectedCard);
      // Selected card should maintain its border color
      expect(selectedCard.style.borderColor).toBe(initialBorderColor);
    }
  });
});

describe('MultipleChoice - Edge Cases', () => {
  it('should handle empty options array', () => {
    const mockOnChange = jest.fn();
    renderWithMantine(
      <MultipleChoice options={[]} value={null} onChange={mockOnChange} variant="list" />
    );

    const radios = screen.queryAllByRole('radio');
    expect(radios).toHaveLength(0);
  });

  it('should handle single option', () => {
    const mockOnChange = jest.fn();
    renderWithMantine(
      <MultipleChoice
        options={['Only Option']}
        value={null}
        onChange={mockOnChange}
        variant="list"
      />
    );

    expect(screen.getByLabelText('Only Option')).toBeInTheDocument();
  });

  it('should handle required prop', () => {
    const mockOnChange = jest.fn();
    renderWithMantine(
      <MultipleChoice
        options={mockOptions}
        value={null}
        onChange={mockOnChange}
        required={true}
      />
    );

    // Component should render normally with required prop
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
  });

  it('should allow changing selection in list variant', () => {
    const mockOnChange = jest.fn();
    const { rerender } = renderWithMantine(
      <MultipleChoice
        options={mockOptions}
        value="Option 1"
        onChange={mockOnChange}
        variant="list"
      />
    );

    // Click on Option 2
    const radio2 = screen.getByLabelText('Option 2');
    fireEvent.click(radio2);

    expect(mockOnChange).toHaveBeenCalledWith('Option 2');

    // Rerender with new value
    rerender(
      <MantineProvider>
        <MultipleChoice
          options={mockOptions}
          value="Option 2"
          onChange={mockOnChange}
          variant="list"
        />
      </MantineProvider>
    );

    const radio2Checked = screen.getByLabelText('Option 2') as HTMLInputElement;
    expect(radio2Checked.checked).toBe(true);
  });

  it('should allow changing selection in cards variant', () => {
    const mockOnChange = jest.fn();
    renderWithMantine(
      <MultipleChoice
        options={mockOptions}
        value="Option 1"
        onChange={mockOnChange}
        variant="cards"
      />
    );

    // Click on Option 3 card
    const card3 = screen.getByText('Option 3');
    fireEvent.click(card3);

    expect(mockOnChange).toHaveBeenCalledWith('Option 3');
  });
});
