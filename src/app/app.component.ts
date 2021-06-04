import { Component, OnInit } from '@angular/core';
import { Poll, PollForm, PollVote } from './types';
import { PollService } from './poll-service/poll.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  activepoll: any = null;
  polls = this.pollservice.getPolls();
  showForm = false;
  constructor(private pollservice: PollService) {

  }
  ngOnInit(): void {
    this.pollservice.onEvent('pollCreated').subscribe((d) => {
      this.polls = this.pollservice.getPolls();
    });
    this.pollservice.onEvent('voteCreated').subscribe((d) => {
      this.polls = this.pollservice.getPolls();
    });
  }

  setActivePoll(p: Poll) {
    this.activepoll = null;
    setTimeout(() => {
      this.activepoll = p;
    }, 100)
  }
  handleCreatePoll(poll: PollForm) {
    this.pollservice.createPoll(poll);
  }
  handlePollVoted(pollVote: PollVote) {
    this.pollservice.vote(pollVote);
  }
}
