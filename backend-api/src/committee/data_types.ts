export interface Citizen {
    electoralId: string,
    name: string,
    email: string,
    address: string,
    province: string,
    password?: string,
    status: string, /*"pending" | "processing" | "verified" | "failed"*/
    verification: string,
    refreshToken: string,
    otp: Otp
}

export enum Role { ADMIN, NORMAL };

export interface User {
    name: string,
    username: string,
    password: string,
    refreshToken: string,
    role: Role,
    timestamp: number
}

export interface Announcement {
    startTimeVoting: Date,
    endTimeVoting: Date,
    dateResults: Date,
    numOfCandidates: number,
    numOfVoters: number,
    dateCreated?: number
}

export interface Otp {
    ascii: string,
    hex: string,
    base32: string,
    otpauth_url: string,
}

export const PROVINCES_PORT = {
    "Bengo": "3000",
    "Benguela": "3001",
    "Bié": "3002",
    "Cabinda": "3003",
    "Cuando Cubango": "3004",
    "Cuanza Norte": "3005",
    "Cuanza Sul": "3006",
    "Cunene": "3007",
    "Huambo": "3008",
    "Huíla": "3009",
    "Luanda": "3010",
    "Lunda Norte": "3011",
    "Lunda Sul": "3012",
    "Malanje": "3013",
    "Moxico": "3014",
    "Namibe": "3015",
    "Uíge": "3016",
    "Zaire": "3017"
};
