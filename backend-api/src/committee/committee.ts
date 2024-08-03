import { Announcement, Citizen, Otp, Role, User } from './data_types';
import { clearCandidates, clearCandidatesTemp, clearCitizens, clearUsers, clearVotersGenerated, readAnnouncement, readCandidates, readCandidatesTemp, readCitizen, readCitizens, readUser, readUsers, readVoterGenerated, removeCitizen, removeUser, writeAnnouncement, writeCandidateTemp, writeCitizen, writeUser, writeVoterCitizenRelation, writeVoterGenerated } from '../leveldb';
import CryptoBlockchain from '../crypto/cryptoBlockchain';
import { Candidate, Voter } from '../blockchain/data_types';
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const CryptoBlockIdentifier = new CryptoBlockchain(process.env.SECRET_KEY_IDENTIFIER, process.env.SECRET_IV_IDENTIFIER);
const CryptoBlockVote = new CryptoBlockchain(process.env.SECRET_KEY_VOTES, process.env.SECRET_IV_VOTES);

class Committee {
    citizens: Citizen[];
    users: User[];
    candidates: Candidate[];
    votersGenerated: Voter[];
    announcement: Announcement;

    constructor() {
        this.citizens = [];
        this.candidates = [];
        this.votersGenerated = [];
        this.users = [];
        this.loadCitizens();
        this.loadUsers();
    }

    public async loadCitizens() {
        try {
            this.citizens = await readCitizens();
        } catch (error) {
            // console.error('Error loading citizens:', error);
        }
    }

    public async loadUsers() {
        try {
            this.users = await readUsers();
        } catch (error) { }
    }

    public async generateIdentifiers() {
        let voters: Voter[] = [];

        try {
            await clearVotersGenerated();

            const length = 8;
            this.citizens.forEach(citizen => {
                if (citizen.status === 'verified') {
                    const id = CryptoBlockIdentifier.generateIdentifier(length);
                    const electoralIdEncrypted = CryptoBlockIdentifier.encryptData(citizen.electoralId);
                    const obj: Voter = {
                        identifier: id,
                        IV: electoralIdEncrypted.IV,
                        electoralId: electoralIdEncrypted.CIPHER_TEXT,
                        choiceCode: "not set yet",
                        state: false,
                        secret: "not set yet",
                    }

                    voters.push(obj);
                    writeVoterGenerated(id, obj);
                }
            });

            this.votersGenerated = voters;
            return voters;
        } catch (e) { }

        return [];
    }

    public async clearCandidates() {
        try {
            await clearCandidatesTemp();
            await clearCandidates();
            this.candidates = [];
            return this.candidates;

        } catch (e) { }

        return [];
    }

    public async addCandidateCommittee(name: string, code: number, party: string, acronym?: string, status?: string) {
        try {
            const obj: Candidate = {
                name: name,
                num_votes: 0,
                code: code,
                acronym: acronym,
                party: party,
                status: status
            }

            await writeCandidateTemp(code, obj);
            this.candidates = await readCandidatesTemp();
        } catch (e) { }

        return this.candidates;
    }

    public async authMobile(electoralId: string, password: string) {
        try {
            const response = await readCitizen(electoralId);
            const match = await bcrypt.compare(password, response.password);

            if (response !== null && match) {
                const output = {
                    electoralId: response.electoralId,
                    address: response.address,
                    email: response.email,
                    province: response.province,
                };

                return output;
            }
        } catch (error) { } 
        
        return null;
    }

    public async authWeb(username: string, password: string) {
        try {
            const response = await readUser(username);
            const match = await bcrypt.compare(password, response.password);

            if (response !== null && match) {
                const output = {
                    name: response.name,
                    username: response.username,
                    role: response.role
                };

                return output;
            }

        } catch (error) { } 
        return null;
    }

    public async eraseCitzens() {
        try {
            await clearCitizens();
            await this.loadCitizens();
        } catch (error) { }
    }

    public async eraseUsers() {
        try {
            await clearUsers();
            await this.loadUsers();
        } catch (error) { }

        return this.users;
    }

    public async eraseUser(key: string) {
        try {
            await removeUser(key);
            await this.loadUsers();
        } catch (error) { }

        return this.users;
    }

    public async eraseRegister(key: string) {
        try {
            await removeCitizen(key);
            await this.loadCitizens();
        } catch (error) { }

        return this.citizens;
    }

    private async saveCitizen(citzen: Citizen) {
        try {
            await writeCitizen(citzen.electoralId, citzen);
        } catch (e) { }
    }

    private async saveUser(user: User) {
        try {
            await writeUser(user.username, user);
        } catch (e) { }
    }

    public async updateTokenCitzen(electoralId: string, refreshToken: string) {
        let citizen = this.citizens.find(x => x.electoralId.localeCompare(electoralId) === 0);
        citizen.refreshToken = refreshToken;

        try {
            await this.saveCitizen(citizen);
        } catch (e) { }

        const tmp = this.citizens.filter(x => x.electoralId.localeCompare(citizen.electoralId) !== 0);
        this.citizens = [...tmp, citizen];
    }

    public async updateTokenUser(username: string, refreshToken: string) {
        let user = this.users.find(x => x.username.localeCompare(username) === 0);
        user.refreshToken = refreshToken;

        try {
            await this.saveUser(user);
        } catch (e) { }

        const tmp = this.users.filter(x => x.username.localeCompare(user.username) !== 0);
        this.users = [...tmp, user];
    }

    public async addCitzen(data: any) {
        const count = this.citizens.filter(x => x.email === data.email).length;
        if (count > 0) return false;

        const hashedPwd = await bcrypt.hash(data.password, 10);

        let citzen: Citizen = {
            electoralId: data.electoralId,
            name: data.name,
            email: data.email,
            address: data.address,
            province: data.province,
            password: hashedPwd,
            status: "pending",
            verification: "0000000000",
            refreshToken: '',
            otp: this.generateOtp(),
        }

        if (this.existsCitizen(citzen)) {
            return false;
        }

        this.citizens.push(citzen);
        this.saveCitizen(citzen);

        return true;
    }

    public async updateCitizen(data: any) {
        try {
            await this.loadCitizens();
            let oldCitizen: Citizen = this.citizens.find((x) => x.electoralId === data.electoralId);

            if (oldCitizen) {
                Object.assign(oldCitizen, {
                    name: data.name,
                    email: data.email,
                    address: data.address,
                    province: data.province,
                    status: data.status,
                });

                await this.saveCitizen(oldCitizen);
                return true;
            }
        } catch (e) { }

        return false;
    }

    public async updateUser(data: any) {
        try {
            await this.loadUsers();
            let oldUser: User = this.users.find((x) => x.username === data.username);

            const hashedPwd = await bcrypt.hash(data.password, 10);

            if (oldUser) {
                Object.assign(oldUser, {
                    name: data.name,
                    // username: data.username,
                    password: data.password ? hashedPwd : oldUser.password,
                    role: data.role === "admin" ? Role.ADMIN : Role.NORMAL,
                });

                await this.saveUser(oldUser);
                return true;
            }

        } catch (e) { }

        return false;
    }

    public async addUser(data: any) {
        const hashedPwd = await bcrypt.hash(data.password, 10);

        let user: User = {
            name: data.name,
            username: data.username,
            password: hashedPwd,
            role: data.role === "admin" ? Role.ADMIN : Role.NORMAL,
            refreshToken: '',
            timestamp: Date.now(),
        }

        if (this.existsUser(user)) {
            return null;
        }

        this.saveUser(user);
        this.users.push(user);

        return this.users;
    }

    public async deployAnnouncement(data: any) {
        let announcement: Announcement = {
            startTimeVoting: data.startTimeVoting,
            endTimeVoting: data.endTimeVoting,
            dateResults: data.dateResults,
            numOfCandidates: parseInt(data.numOfCandidates),
            numOfVoters: parseInt(data.numOfVoters),
            dateCreated: Date.now()
        }

        try {
            await writeAnnouncement(announcement)
            this.announcement = announcement;
            return this.announcement;
        } catch (e) { }

        return null;
    }

    public async getAnnouncement() {
        try {
            this.announcement = await readAnnouncement();
        } catch (error) { }

        return this.announcement;
    }

    private existsCitizen(citizen: Citizen): boolean {
        return this.citizens.findIndex(x => x.electoralId === citizen.electoralId) !== -1;
    }

    private existsUser(user: User): boolean {
        return this.users.findIndex(x => x.username === user.username) !== -1;
    }

    public getRefreshTokens(): string[] {
        return this.citizens.map(x => x.refreshToken);
    }

    private generateOtp(): Otp {
        const secret = speakeasy.generateSecret({
            name: "Election Blockchain Angola",
            length: 6, // Length of the generated code
            step: 300 // Time step in seconds (5 minutes = 300 seconds)
        });

        let otp: Otp = {
            ascii: secret.ascii,
            hex: secret.hex,
            base32: secret.base32,
            otpauth_url: secret.otpauth_url,
        };

        return otp;
    }

    public verifyOtp(secret, token): boolean {
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token,
        });

        return verified;
    }

    public generateQRCode = async (otpauth_url: string): Promise<string | null> => {
        try {
            const qrCodeData = await new Promise<string>((resolve, reject) => {
                qrcode.toDataURL(otpauth_url, (err, data) => {
                    if (err) {
                        // console.error(err);
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });

            return qrCodeData;
        } catch (error) {
            // console.error(error);
            return null;
        }
    };


    public getCitizens() {
        return this.citizens;
    }

    public async getVotersGenerated() {
        try {
            this.votersGenerated = await readVoterGenerated();
        } catch (error) { }

        return this.votersGenerated;
    }

    public async getCandidates() {
        try {
            this.candidates = await readCandidatesTemp();
        } catch (error) { }

        return this.candidates;
    }

    public getUsers() {
        return this.users;
    }
}

export default Committee;