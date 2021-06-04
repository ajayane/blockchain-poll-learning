import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Poll, PollForm, PollVote, Voter } from '../types';
import { Web3Service } from '../blockchain/web3.service';
import { fromAscii, toAscii } from 'web3-utils';
@Injectable({
  providedIn: 'root'
})
export class PollService {

  constructor(private web3: Web3Service) { }
  async getTotalPolls() {
    const totalPolls = await this.web3.call('totalPolls');
    console.log(totalPolls);
  }
  async getVoter() {
    const address = this.web3.getAccount();
    return await this.web3.call('getVoter', address);
  }
  async getPolls(): Promise<Poll[]> {
    const totalpolls = await this.web3.call('totalPolls');
    if (!totalpolls) {
      return [];
    }
    const address = await this.web3.getAccount();
    const voter = await this.web3.call('getVoter', address);

    const voterNormalized = this.normalizeVoter(voter);
    const polls: Poll[] = [];
    for (let i = 0; i < totalpolls; i++) {
      const poll = await this.web3.call('getPoll', i);
      const pollNormalized = this.normalizePoll(poll, voterNormalized);
      polls.push(pollNormalized);
    }
    return polls;
  }
  normalizeVoter(v: Array<any>) {
    return {
      id: v[0],
      votedIds: v[1].map((vote: any) => parseInt(vote))
    }
  }
  normalizePoll(poll: Array<any>, voterNormalized: any): Poll {
    return {
      id: parseInt(poll[0]),
      question: poll[1],
      thumbnail: poll[2],
      results: poll[3].map((e: any) => parseInt(e)),
      options: poll[4].map((opt: any) => toAscii(opt).replace(/\u0000/g, "")),
      voted: voterNormalized.votedIds.length && voterNormalized.votedIds.find((votedId: any) => votedId == parseInt(poll[0]))
    }
  }
  vote(pollvote: PollVote) {
    this.web3.executeTransaction('vote', pollvote.id, pollvote.vote);
    console.log(pollvote);
  }
  createPoll(poll: PollForm) {
    this.web3.executeTransaction('createPoll', poll.question, poll.thumbnail || "", poll.options.map((o) => fromAscii(o)));
    console.log(poll)
  }
  onEvent(event: string) {
    return this.web3.onEvents(event);
  }
}
