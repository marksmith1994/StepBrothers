import { render, screen, waitFor } from '@testing-library/react';
import PersonPage from './PersonPage';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('../hooks/useStepsData', () => ({
  useStepsData: jest.fn(() => ({
    data: [
      { month: 'January', steps: { Mark: 1000 }, total: 3000 },
      { month: 'February', steps: { Mark: 1500 }, total: 4000 },
    ],
    loading: false,
    error: null,
  })),
}));

jest.mock('./charts/StepLineChart', () => () => <div data-testid="line-chart">Line Chart</div>);
jest.mock('./charts/StepBarChart', () => () => <div data-testid="bar-chart">Bar Chart</div>);


describe('PersonPage', () => {
  it('renders person page title and charts', async () => {
    render(
      <MemoryRouter initialEntries={["/person/Mark"]}>
        <Routes>
          <Route path="/person/:name" element={<PersonPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Step Brother - Mark/i)).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    await waitFor(() => screen.getByText('Step Brother - Mark'));
  });
});
