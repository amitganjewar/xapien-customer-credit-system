import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useToast } from './useToast';

function TestComponent() {
  const { showToast, Toast } = useToast(100);
  return (
    <div>
      <button onClick={() => showToast('Test')}>Show</button>
      {Toast}
    </div>
  );
}

jest.useFakeTimers();

test('useToast displays and hides toast', async () => {
  render(<TestComponent />);
  expect(screen.queryByText('Test')).toBeNull();
  fireEvent.click(screen.getByText('Show'));
  expect(screen.getByText('Test')).toBeInTheDocument();
  await act(() => jest.advanceTimersByTime(100));
  expect(screen.queryByText('Test')).toBeNull();
});