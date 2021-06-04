export interface PollVote {
    id: number;
    vote: number;
}
export interface PollForm {
    question: string;
    thumbnail: string;
    options: string[];
}
export interface Poll extends PollForm {
    id: number;
    results: number[];
    voted: boolean;
}
export interface Voter {
    id: string;
    voted: number[];
}
