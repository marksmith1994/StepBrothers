import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../hooks/useStepsData', () => ({
  useStepsData: jest.fn(() => ({
    data: [
      { month: 'January', steps: { Mark: 1000, John: 2000 }, total: 3000 },
      { month: 'February', steps: { Mark: 1500, John: 2500 }, total: 4000 },
    ],
    loading: false,
    error: null,
  })),
}));

jest.mock('./charts/StepPieChart', () => () => <div data-testid="pie-chart">Pie Chart</div>);


describe('Dashboard', () => {
  it('renders dashboard title and table', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText(/Step Dashboard/i)).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    await waitFor(() => screen.getByText('January'));
    expect(screen.getByText('January')).toBeInTheDocument();
    expect(screen.getByText('February')).toBeInTheDocument();
  });
});
