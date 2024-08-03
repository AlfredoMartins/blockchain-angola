import { Route, Routes } from 'react-router-dom';
import Dashboard from '../screens/Dashboard';
import Blockchain from '../screens/Blockchain';
import BlockchainDetails from '../screens/BlockchainDetails';
import UserManagement from '../screens/Users';
import ElectionResults from '../screens/ElectionResults';
import PopulationData from '../screens/PopulationData';
import Candidates from '../screens/Candidates';
import AnnounceElection from '../screens/AnnounceElection';
import PublicAnnouncement from '@/screens/PublicAnnouncement';
import Voters from '@/screens/Voters';
import EditAccount from '@/screens/EditAccount';
import VerificationDialog from '@/tables/voters_table/verification-modal';
import NoPage from '../screens/NoPage';

function Container() {
    return (
        <div>
            <Routes>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="announce-election" element={<AnnounceElection />} />
                <Route path="public-announcement" element={<PublicAnnouncement />} />
                <Route path="candidates" element={<Candidates />} />
                <Route path="voters" element={<Voters />} />
                <Route path="verification" element={<VerificationDialog url={''} />} />
                <Route path="blockchain" element={<Blockchain />} />
                <Route path="blockchain/block-details/:id" element={<BlockchainDetails />} />
                <Route path="user" element={<UserManagement />} />
                <Route path="election-results" element={<ElectionResults />} />
                <Route path="population-data" element={<PopulationData />} />
                <Route path="edit-account" element={<EditAccount />} />
                <Route path="*" element={<NoPage />} />
            </Routes>
        </div>
    );
}

export default Container
