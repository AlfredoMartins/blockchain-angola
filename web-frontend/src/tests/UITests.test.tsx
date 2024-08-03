/* eslint-disable @typescript-eslint/no-var-requires */
import 'resize-observer-polyfill';
import { fireEvent, render, screen } from '@testing-library/react';
import Login from '@/screens/Login';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest'
import axios from 'axios';
import userEvent from '@testing-library/user-event'
import Dashboard from '@/screens/Dashboard';
import Candidates from '@/screens/Candidates';
import { DataTable } from '@/tables/population_table/data-table';
import PopulationData from '@/screens/PopulationData';
import Users from '@/screens/Users';

vi.mock('@/context/AuthContext', () => ({
    useAuth: () => ({
        onLogOut: vi.fn(),
        updateImages: vi.fn(), 
        isLoggedIn: vi.fn()
    }),
}));

global.ResizeObserver = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

vi.mock('axios');
module.exports = {
    get: vi.fn()
};

describe('Login component', () => {
    it('Renders custom Login Button', () => {
        const { getByRole } = render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const loginButton = getByRole('button', { name: /Login/i });
        expect(loginButton).toBeInTheDocument();
        fireEvent.click(loginButton);
    });

    it('Filling and submitting the login info', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        userEvent.type(screen.getByLabelText("Username"), "ABC123");
        userEvent.type(screen.getByLabelText("Password"), "ABC123");
        userEvent.click(screen.getByRole("button", { name: "Login" }));
    });
});

describe('Dashboard component', () => {
    it('Renders all the label texts for the statistics', () => {
        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        const votesReceivedLabel = screen.getByText(/Votes Received/i);
        const totalVotersLabel = screen.getByText(/Total voters/i);
        const totalCandidatesLabel = screen.getByText(/Total Candidates/i);
        const averageTimeLabel = screen.getByText(/Average time/i);
        const averageVoteLabel = screen.getByText(/Average vote/i);
        const topPartyLabel = screen.getByText(/Top Party/i);
        const topVotesByProvinceLabel = screen.getByText(/Top votes by province/i);
        const dailyIncrementLabel = screen.getByText(/Daily increment in vote/i);
        const statisticsLabel = screen.getByText(/Statistics/i);
        const coverageRegionLabel = screen.getByText(/Coverage Region/i);

        expect(votesReceivedLabel).toBeInTheDocument();
        expect(totalVotersLabel).toBeInTheDocument();
        expect(totalCandidatesLabel).toBeInTheDocument();
        expect(averageTimeLabel).toBeInTheDocument();
        expect(averageVoteLabel).toBeInTheDocument();
        expect(topPartyLabel).toBeInTheDocument();
        expect(topVotesByProvinceLabel).toBeInTheDocument();
        expect(dailyIncrementLabel).toBeInTheDocument();
        expect(statisticsLabel).toBeInTheDocument();
        expect(coverageRegionLabel).toBeInTheDocument();
    });
});


describe('Candidates component', () => {
    it('Renders all buttons and labels correctly', () => {
        render(
            <BrowserRouter>
                <Candidates />
            </BrowserRouter>
        );

        const loadCandidatesNotDeployedButton = screen.getByText(/Load Candidates \[Not Deployed\]/i);
        expect(loadCandidatesNotDeployedButton).toBeInTheDocument();

        const deployButton = screen.getByText(/Deploy to Blockchain/i);
        expect(deployButton).toBeInTheDocument();

        const deleteButton = screen.getByText(/Delete from Blockchain/i);
        expect(deleteButton).toBeInTheDocument();
    });

    it('Opens dialog for deploying to blockchain', () => {
        render(
            <BrowserRouter>
                <Candidates />
            </BrowserRouter>
        );

        const deployButton = screen.getByText(/Deploy to Blockchain/i);
        fireEvent.click(deployButton);

        const dialogTitle = screen.getByText(/Are you absolutely sure?/i);
        expect(dialogTitle).toBeInTheDocument();

        const continueButton = screen.getByText(/Continue/i);
        expect(continueButton).toBeInTheDocument();
    });

    it('Opens dialog for deleting from blockchain', () => {
        render(
            <BrowserRouter>
                <Candidates />
            </BrowserRouter>
        );

        const deleteButton = screen.getByText(/Delete from Blockchain/i);
        fireEvent.click(deleteButton);

        const dialogTitle = screen.getByText(/Are you absolutely sure?/i);
        expect(dialogTitle).toBeInTheDocument();

        const continueButton = screen.getByText(/Continue/i);
        expect(continueButton).toBeInTheDocument();
    });
});

vi.mock('axios');
describe('DataTable Component', () => {
    const columns = [
        { header: 'Name', cell: (row) => row.name },
    ];

    const data = [
        { id: 1, name: 'Alfredo Martins' },
        { id: 2, name: 'Genilson Araújo' },
    ];

    it('should render table with provided data and columns', () => {
        render(<DataTable columns={columns} data={data} />);
    });

    it('should sort data when clicking on column header', () => {
        render(<DataTable columns={columns} data={data} />);
        const nameColumnHeader = screen.getByText('Name');
        fireEvent.click(nameColumnHeader);
    });

    it('should filter data based on input values', () => {
        render(<DataTable columns={columns} data={data} />);
        const nameFilterInput = screen.getByPlaceholderText('Filter names ...');
        fireEvent.change(nameFilterInput, { target: { value: 'Alfredo' } });
    });

});

const mockData = {
    data: {
        registers: [
            {
                name: 'Alfredo Martins',
                electoralId: '1234',
                email: 'alfredo.martins@hotmail.com',
                address: '123 Main St',
                province: 'Luanda',
                password: 'password',
                status: 'verified',
                verification: 'done',
                otp: '5678',
            },
        ],
    },
};

describe('PopulationData Component', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders PopulationData component', () => {
        render(<PopulationData />);
        expect(screen.getByText('Population Data')).toBeInTheDocument();
    });

    it('loads and displays data correctly', async () => {
        (axios.get as any).mockResolvedValue(mockData);

        render(<PopulationData />);

        // Click the Load/Refresh Data button
        fireEvent.click(screen.getByText(/Load \/ Refresh Data/i));

        // Wait for the data to be loaded and displayed
        const rowData = await screen.findByText(/Alfredo Martins/i);
        expect(rowData).toBeInTheDocument();
    });
});

vi.mock('@/context/AuthContext', () => ({
    useAuth: () => ({
        updateImages: vi.fn(), // 
    }),
}));

describe('Users component', () => {
    beforeEach(() => {
        vi.spyOn(axios, 'get').mockResolvedValue({
            data: {
                users: [
                    {
                        name: 'Alfredo Martins',
                        username: 'alfredo.martins',
                        password: 'password',
                        role: 'admin',
                        refreshToken: 'refreshToken',
                        timestamp: '2024-05-24'
                    }
                ]
            }
        });
    });

    it('Renders user management section', async () => {
        render(<Users />);
        expect(screen.getByText(/User Management/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Add User/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Load \/ Refresh Users/i })).toBeInTheDocument();
        await screen.findByText('Alfredo Martins');
    });

    it('Loads users and displays them in the table', async () => {
        render(<Users />);

        await screen.findByText('Alfredo Martins');

        expect(screen.queryByText((content, element) => {
            return element.tagName.toLowerCase() === 'td' && content.includes('Alfredo Martins');
        })).toBeInTheDocument();

        expect(screen.queryByText((content, element) => {
            return element.tagName.toLowerCase() === 'td' && content.includes('alfredo.martins');
        })).toBeInTheDocument();

    });

    it('Opens add user modal when "Add User" button is clicked', async () => {
        render(<Users />);

        await screen.findByText('Alfredo Martins');

        const addUserButton = screen.getByRole('button', { name: /Add User/i });
        fireEvent.click(addUserButton);

        expect(addUserButton).toBeInTheDocument();

        const nameInputs = screen.queryAllByLabelText(/Name/i);
        expect(nameInputs.length).toBeGreaterThan(0);

        const usernameInput = screen.getByLabelText(/Username/i);
        expect(usernameInput).toBeInTheDocument();
    });

});