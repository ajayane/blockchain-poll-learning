import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import ApexCharts from 'apexcharts';
import { PollVote } from '../types';

@Component({
  selector: 'app-poll-vote',
  templateUrl: './poll-vote.component.html',
  styleUrls: ['./poll-vote.component.scss']
})
export class PollVoteComponent implements AfterViewInit {

  @Input() voted: boolean = false;
  @Input() options: string[] = [];
  @Input() results: number[] = [];
  @Input() question: string = '';
  @Input() pollid: number = 0;

  @Output() pollVoted: EventEmitter<PollVote> = new EventEmitter();

  voteForm;
  constructor(private fb: FormBuilder) {
    this.voteForm = this.fb.group({
      selected: this.fb.control('', [Validators.required])
    });
  }
  ngAfterViewInit(): void {
    if (this.voted) {
      this.generateChart();
    }
  }

  submitForm() {
    const pollVoted: PollVote = {
      id: this.pollid,
      vote: this.voteForm.get('selected')?.value
    }
    this.pollVoted.emit(pollVoted);
  }
  generateChart() {
    const chartOptions: ApexCharts.ApexOptions = {
      series: [{
        name: 'Poll Analytics',
        data: this.results
      }],
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + ''; // + "%";
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#304758"]
        }
      },

      xaxis: {
        categories: this.options,
        position: 'top',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: {
          enabled: true,
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val + '';//+ "%";
          }
        }

      },
      title: {
        text: 'Poll count',
        floating: true,
        offsetY: 330,
        align: 'center',
        style: {
          color: '#444'
        }
      }
    };
    const chart = new ApexCharts(document.getElementById('poll-results'), chartOptions);
    chart.render();
  }
}
